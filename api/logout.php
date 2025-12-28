<?php
require 'bootstrap.php';
require 'utils.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond('error', 'Only POST method allowed', 405);
}

try {
    
if (!isset($_COOKIE['sessionID'])) {
    respond('error', 'User is not logged in', 400);
}

$sessionID = clean((string)$_COOKIE['sessionID']);

$stmt = $pdo->prepare(
    "SELECT sessionID, isActive 
     FROM sessions 
     WHERE sessionID = ?"
);
$stmt->execute([$sessionID]);
$session = $stmt->fetch();

if (!$session) {
    respond('error', 'Invalid session', 400);
}

if ((int)$session['isActive'] !== 1) {
    respond('error', 'Session already inactive', 400);
}


$pdo->prepare(
    "UPDATE sessions SET isActive = 0 WHERE sessionID = ?"
)->execute([$sessionID]);


setcookie('sessionID', '', [
    'expires'  => time() - 3600,
    'path'     => '/',
    'secure'   => false,   // local dev
    'httponly' => true,
    'samesite' => 'Lax'
]);

} catch (PDOException $e) {
    respond('error', 'Database error during logout', 500);
}

respond('success', 'Logout successful');
