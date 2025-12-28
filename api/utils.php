<?php
require 'bootstrap.php';

function respond($status, $data, $httpCode = 200, $extra = [])
{
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code($httpCode);
    $response = ['status' => $status];

    if (is_string($data)) {
        $response['message'] = $data;
    } else {
        $response['data'] = $data;
    }

    if (is_array($extra) && !empty($extra)) {
        $response = array_merge($response, $extra);
    }

    if (ob_get_length()) {
        ob_clean();
    }
    echo json_encode($response);
    exit;
}

function clean($data)
{
    if (is_string($data)) {
        $data = trim($data);
    }
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function getUserFullName($pdo, $id)
{
    try {
        $stmt = $pdo->prepare("SELECT name FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row['name'] ?? 'register User';
    } catch (Exception $e) {
        return 'register User';
    }
}

function checkUserExists($pdo, $id)
{
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return (bool)$stmt->fetch();
    } catch (Exception $e) {
        respond('error', 'Failed to check user existence', 500);
    }
}

function getUserID($pdo)
{
    if (!isset($_COOKIE['sessionID'])) {
        respond('error', 'Login required. Please log in.', 401);
    }

    $sessionID = $_COOKIE['sessionID'];

    try {
        $stmt = $pdo->prepare(
            "SELECT uid 
             FROM sessions 
             WHERE sessionID = ? 
               AND isActive = 1 
               AND expiresAt > NOW()"
        );

        $stmt->execute([$sessionID]);
        $row = $stmt->fetch();

        if (!$row) {
            setcookie('sessionID', '', time() - 3600, '/');
            respond('error', 'Session expired or invalid. Please log in again.', 401);
        }

        return (int)$row['uid'];
    } catch (Exception $e) {
        respond('error', 'Session validation failed', 500);
    }
}


/**CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'inProgress', 'done') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  sessionID varchar(64) NOT NULL,
  uid int(11) NOT NULL,
  token varchar(255) NOT NULL,
  expiresAt datetime NOT NULL,
  isActive tinyint(1) DEFAULT 1,
  createdAt timestamp NOT NULL DEFAULT current_timestamp()
) 



 */