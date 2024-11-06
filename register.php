<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['message' => 'Connection failed: ' . $conn->connect_error]));
}

$email = $_POST['email'];
$name = $_POST['name'];
$telephone = $_POST['telephone'];
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];
$address = $_POST['address'];

// ตรวจสอบว่าอีเมลมี .com
if (!preg_match('/\.com$/', $email)) {
    echo json_encode(['message' => 'อีเมลต้องมี .com']);
    exit();
}

// ตรวจสอบรหัสผ่าน
if ($password !== $confirm_password) {
    echo json_encode(['message' => 'รหัสผ่านไม่ตรงกัน']);
    exit();
}

// ตรวจสอบว่าอีเมลนี้มีอยู่ในฐานข้อมูลแล้วหรือไม่
$email_check_sql = "SELECT * FROM member WHERE email = '$email'";
$result = $conn->query($email_check_sql);

if ($result->num_rows > 0) {
    echo json_encode(['message' => 'อีเมลนี้ถูกใช้ไปแล้ว']);
    exit();
}

// บันทึกรหัสผ่านแบบไม่เข้ารหัส (ไม่แนะนำ)
$sql = "INSERT INTO member (email, password, name, telephone, address) VALUES ('$email', '$password', '$name', '$telephone', '$address')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['message' => 'สมัครสมาชิกสำเร็จ']);
} else {
    echo json_encode(['message' => 'Error: ' . $sql . '<br>' . $conn->error]);
}

$conn->close();
