<?php
// db_connection.php
$servername = "localhost";
$username = "root"; // เปลี่ยนตามการตั้งค่าของคุณ
$password = ""; // เปลี่ยนตามการตั้งค่าของคุณ
$dbname = "project";

try {
    // สร้างการเชื่อมต่อ PDO
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // ตั้งค่า PDO ให้ส่งกลับข้อผิดพลาด
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Connection failed: ' . $e->getMessage()]);
    exit();
}
