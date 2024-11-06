<?php
session_start();
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$email = $_POST['email'];
$password = $_POST['password'];

// ตรวจสอบว่าอีเมลมี .com
// if (!preg_match('/\.com$/', $email)) {
if (!preg_match('/\@/', $email)) {
    echo json_encode(['success' => false, 'message' => 'ชื่อผู้ใช้ต้องเป็นรูปแบบอีเมล์']);
    exit();
}

$sql = "SELECT * FROM admin WHERE admin_email = ? AND admin_password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $user['role'] = 'admin';
    $_SESSION['user_id'] = $user['admin_id']; // เก็บ ID ของผู้ดูแลระบบในเซสชัน
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    $sql = "SELECT * FROM member WHERE email = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $user['role'] = 'member';
        $_SESSION['user_id'] = $user['member_id']; // เก็บ ID ของสมาชิกในเซสชัน
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'ไม่มีข้อมูลสมาชิก']);
    }
}
$stmt->close();
$conn->close();
