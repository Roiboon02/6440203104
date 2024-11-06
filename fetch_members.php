<?php
$servername = "localhost"; // ชื่อเซิร์ฟเวอร์
$username = "root"; // ชื่อผู้ใช้ฐานข้อมูล (ถ้าใช้ root ให้ไม่ใส่รหัสผ่าน)
$password = ""; // รหัสผ่าน (ถ้าไม่มีรหัสผ่านให้ใช้ "")
$dbname = "project"; // ชื่อฐานข้อมูลที่คุณสร้างไว้

// สร้างการเชื่อมต่อ
$conn = new mysqli($servername, $username, $password, $dbname);

// เช็คการเชื่อมต่อ
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ดึงข้อมูลสมาชิก
$sql = "SELECT member_id, email, password, name, telephone, address FROM member WHERE 1";
$result = $conn->query($sql);

$members = array();
if ($result->num_rows > 0) {
    // เก็บข้อมูลสมาชิกในอาเรย์
    while ($row = $result->fetch_assoc()) {
        $members[] = $row;
    }
}

// ส่งข้อมูลสมาชิกเป็น JSON
echo json_encode($members);

$conn->close();
