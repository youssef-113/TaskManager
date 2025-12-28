<?php
require 'bootstrap.php';
require 'utils.php';

try {
    $userId = getUserID($pdo);

    $stmt = $pdo->prepare(
        "SELECT id, title, description, status, createdAt, updatedAt
         FROM tasks
         WHERE userId = ?
         ORDER BY createdAt DESC"
    );

    $stmt->execute([$userId]);
    $tasks = $stmt->fetchAll();

    respond('success', $tasks);
} catch (Exception $e) {
    respond('error', 'Internal server error', 500);
}
