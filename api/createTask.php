<?php
require 'bootstrap.php';
require 'utils.php';

try {
    $userId = getUserID($pdo);

    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        respond('error', 'Invalid JSON format', 400);
    }

    $title = clean(trim($data['title'] ?? ''));
    $description = clean(trim($data['description'] ?? ''));
    $status = clean(trim($data['status'] ?? 'pending'));

    if (!$title) {
        respond('error', 'Task title is required', 422);
    }

    $allowedStatus = ['pending', 'inProgress', 'done'];
    if (!in_array($status, $allowedStatus, true)) {
        respond('error', 'Invalid task status', 400);
    }

    $stmt = $pdo->prepare(
        "INSERT INTO tasks (userId, title, description, status)
         VALUES (?, ?, ?, ?)"
    );

    $stmt->execute([
        $userId,
        $title,
        $description ?: null,
        $status
    ]);

    respond('success', 'Task created successfully');
} catch (Exception $e) {
    respond('error', 'Internal server error', 500);
}

