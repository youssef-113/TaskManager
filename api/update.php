<?php
require 'bootstrap.php';
require 'utils.php';

try {
    $userId = getUserID($pdo);

    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        respond('error', 'Invalid JSON format', 400);
    }

    $taskId = (int)($data['id'] ?? 0);
    $title = clean(trim($data['title'] ?? ''));
    $description = clean(trim($data['description'] ?? ''));
    $status = clean(trim($data['status'] ?? ''));

    if ($taskId <= 0) {
        respond('error', 'Task ID is required', 422);
    }

    if (!$title) {
        respond('error', 'Task title is required', 422);
    }

    $allowedStatus = ['pending', 'inProgress', 'done'];
    if (!in_array($status, $allowedStatus, true)) {
        respond('error', 'Invalid task status', 400);
    }

    $stmt = $pdo->prepare(
        "UPDATE tasks
         SET title = ?, description = ?, status = ?
         WHERE id = ? AND userId = ?"
    );

    $stmt->execute([
        $title,
        $description ?: null,
        $status,
        $taskId,
        $userId
    ]);

    if ($stmt->rowCount() === 0) {
        respond('error', 'Task not found or not authorized', 404);
    }

    respond('success', 'Task updated successfully');
} catch (Exception $e) {
    respond('error', 'Internal server error', 500);
}
