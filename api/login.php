<?php

require 'bootstrap.php';
require 'utils.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
try{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond('error', 'Only POST method allowed', 405);
}


$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    respond('error', 'Invalid JSON format', 400);
}

$email = clean(trim($data['email'] ?? ''));
$password_raw = clean(trim($data['password'] ?? ''));

if (!$email) {
    respond('error', 'Email is required', 400);
}

if (!$password_raw) {
    respond('error', 'Password is required', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond('error', 'Invalid email address', 400);
}


$stmt = $pdo->prepare(
    "SELECT id, password FROM users WHERE email = ?"
);
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    respond('error', 'Invalid email or password', 400);
}


if (!password_verify($password_raw, $user['password'])) {
    respond('error', 'Invalid email or password', 400);
}

$userId = (int)$user['id'];


$pdo->prepare(
    "UPDATE sessions SET isActive = 0 WHERE uid = ?"
)->execute([$userId]);


$sessionID = bin2hex(random_bytes(32));
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+90 days'));
$isActive = 1;

$pdo->prepare(
    "INSERT INTO sessions (sessionID, uid, token, expiresAt, isActive)
     VALUES (?, ?, ?, ?, ?)"
)->execute([
    $sessionID,
    $userId,
    $token,
    $expiresAt,
    $isActive
]);

setcookie('sessionID', $sessionID, [
    'expires'  => strtotime($expiresAt),
    'path'     => '/',
    'secure'   => false,   
    'httponly' => true,
    'samesite' => 'Lax'
]);
}
catch (PDOException $e) {
    respond('error', 'Database error during login', 500);
}

respond('success', 'Login successful');
