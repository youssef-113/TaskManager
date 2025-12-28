<?php
require 'bootstrap.php';
require 'utils.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

function checkUserByEmail($conn, $email)
{
    $sql = "SELECT id FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        respond('error', 'Database error while checking user existence', 500);
    }

    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();

    return $stmt->num_rows > 0;
}


if (json_last_error() !== JSON_ERROR_NONE) {
    respond('error', 'Invalid JSON format', 400);
}

if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
    respond('error', 'All fields are required', 422);
}


$passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare(
        "INSERT INTO users (name, email, password)
         VALUES (?, ?, ?)"
    );
    $stmt->execute([
        $data['name'],
        $data['email'],
        $passwordHash
    ]);
} catch (PDOException $e) {
    respond('error', 'Email already exists', 409);
}

$userId = $pdo->lastInsertId();


// remove existing sessions for this user
$pdo->prepare(
    "DELETE FROM sessions WHERE uid = ?"
)->execute([$userId]);

$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+1 day'));

$pdo->prepare(
    "INSERT INTO sessions (sessionID, uid, token, expiresAt)
     VALUES (?, ?, ?, ?)"
)->execute([
    session_id(),
    $userId,
    $token,
    $expiresAt
]);

$_SESSION['token'] = $token;

respond('success', 'Registered successfully');



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