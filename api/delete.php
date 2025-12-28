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

    if ($taskId <= 0) {
        respond('error', 'Task ID is required', 422);
    }

    $stmt = $pdo->prepare(
        "DELETE FROM tasks WHERE id = ? AND userId = ?"
    );

    $stmt->execute([$taskId, $userId]);

    if ($stmt->rowCount() === 0) {
        respond('error', 'Task not found or not authorized', 404);
    }

    respond('success', 'Task deleted successfully');
} catch (Exception $e) {
    respond('error', 'Internal server error', 500);
}
