<?php
require 'bootstrap.php';
require 'utils.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond('error', 'Only GET method allowed', 405);
}

try {
    $userId = getUserID($pdo);

    $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        respond('error', 'User not found', 404);
    }

    respond('success', $user);
} catch (Exception $e) {
    respond('error', 'Internal server error', 500);
}
