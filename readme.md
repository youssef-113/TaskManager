# 🧩 Task Manager – Full Stack Project (Native PHP + Vanilla JS)

A full-stack Task Management application built with native PHP, MySQL, and a Vanilla JavaScript frontend. The project demonstrates session-based authentication, secure backend APIs, and a simple responsive frontend without using any frameworks.

---

## 🛠 Tech Stack

### Backend
- **PHP 8+**
- **MySQL**
- **Apache (XAMPP)**
- **PDO** (prepared statements)
- **Session-based authentication** (DB-backed)

### Frontend
- **HTML**
- **CSS**
- **Vanilla JavaScript** (Fetch API)

### Tools
- **Git & GitHub**
- **Postman** (API testing)

---

## 📂 Project Structure

```
TaskManager/
│
├── api/
│   ├── bootstrap.php
│   ├── utils.php
│   ├── register.php
│   ├── login.php
│   ├── logout.php
│   ├── tasks/
│   │   ├── create.php
│   │   ├── list.php
│   │   ├── update.php
│   │   └── delete.php
│
├── config/
│   └── database.php
│
├── frontend/
│   ├── index.html        (Login / Register)
│   ├── tasks.html        (Task Manager UI)
│   ├── style.css
│   └── app.js            (Frontend logic)
│
├── screenshots/
│   ├── backend/
│   └── frontend/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites
- PHP 8+
- MySQL
- XAMPP
- Git
- Browser (Chrome / Firefox)
- Postman (optional but recommended)

### 2️⃣ Clone Repository

```bash
git clone https://github.com/youssef-113/TaskManager.git
cd TaskManager
```

### 3️⃣ Database Setup

**Create database:**

```sql
CREATE DATABASE taskManager;
```

**Create tables:**

```sql
CREATE TABLE users (
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
    sessionID VARCHAR(64) NOT NULL,
    uid INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiresAt DATETIME NOT NULL,
    isActive TINYINT(1) DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4️⃣ Configure Database Connection

Edit `api/db.php`:

```php
$host = 'localhost';
$db   = 'taskManager';
$user = 'root';
$pass = '';
```

---

## ▶️ How to Run the Project

1. Start **Apache** and **MySQL** in XAMPP
2. Place project inside: `C:\xampp\htdocs\TaskManager`
3. Backend base URL: `http://localhost/TaskManager/api`
4. Frontend entry: `http://localhost/TaskManager/frontend/register.html`

📸 **Xampp app running**

![xampp app](screenshots/Screenshot%202025-12-28%20174512.png)

---

## 🔐 Authentication & Security

- Session-based authentication
- Sessions stored in database
- One active session per user
- Secure cookies (HttpOnly)
- All task APIs are protected
- Users can only access their own tasks

---

## 📡 Backend API Endpoints

### User Authentication

#### Register
**POST** `/api/register.php`

```json
{
  "name": "youssef1",
  "email": "youssef@test1.com",
  "password": "password123"
}
```
📸 **Register API Test**

![Register ](screenshots/Screenshot%202025-12-28%20192056.png)


#### Login
**POST** `/api/login.php`

```json
{
  "email": "youssef@test1.com",
  "password": "password123"
}
```
📸 **Login API Test**

![Login API Test](screenshots/Screenshot%202025-12-28%20192244.png)

---

### Task Management (Protected)

#### Logout
**POST** `/api/logout.php`

📸 **Logout API Test**

![Logout Screenshot](screenshots/Screenshot%202025-12-28%20193839.png)

---

### Task Management (Protected)

#### Create Task
**POST** `/api/tasks/create.php`

```json
{
  "title": "Finish project",
  "description": "Complete backend and frontend",
  "status": "pending"
}
```
📸 **Create Task API Test**

![Create Task Screenshot](screenshots/Screenshot%202025-12-28%20193213.png)

#### List Tasks (Paginated)
**GET** `/api/tasks/listTasks.php?page=1&limit=5`

📸 **List Tasks API Test**

![List Tasks Screenshot](screenshots/Screenshot%202025-12-28%20193405.png)

#### Update Task
**PUT** `/api/tasks/update.php`

```json
{
  "id": 1,
  "title": "Finish project",
  "description": "Project completed",
  "status": "done"
}
```
📸 **Update Task API Test**

![Update Task Screenshot](screenshots/Screenshot%202025-12-28%20193557.png)

#### Delete Task
**DELETE** `/api/tasks/delete.php`

```json
{
  "id": 1
}
```
📸 **Delete Task API Test**

![Delete Task Screenshot](screenshots/Screenshot%202025-12-28%20193807.png)

---

## 🖥 Frontend Description (Vanilla JS)

### Pages

**index.html**
- Login form
- Registration form

**tasks.html**
- Task list
- Add new task
- Update task status
- Delete task
- Logout

### Frontend Features
- Uses Fetch API
- Session cookies handled automatically
- Loading & error states
- Basic responsive layout
- Clean and readable UI

---

## 🧪 Testing

### Backend
- All endpoints tested using Postman
- Postman collection & environment created
- Session handling verified
- Pagination tested

### Frontend
- Manual browser testing
- Authentication flow tested
- Task CRUD tested
- Screenshots are available in `/screenshots`

---

## 📌 Assumptions Made

- Local development environment
- No role-based access control
- One session per user
- Backend API only (no server-side rendering)
- No password reset feature
- No soft deletes

---

## ⭐ Bonus Implemented

- ✅ DB-backed sessions
- ✅ Single session enforcement
- ✅ Pagination
- ✅ Centralized utilities
- ✅ Vanilla JS frontend
- ✅ Full Postman collection

---

## 🏁 Conclusion

This project demonstrates a complete full-stack application built from scratch using native PHP and Vanilla JavaScript. It focuses on correctness, security, and clarity rather than over-engineering, fulfilling all requirements of the technical assessment.

---

## 👨‍💻 Author

**Youssef**
- GitHub: [@youssef-113](https://github.com/youssef-113)