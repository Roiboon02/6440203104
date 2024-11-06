<?php
date_default_timezone_set('Asia/Bangkok'); // ตั้งค่าเขตเวลาเป็นเวลาของไทย
// กำหนดค่าการเชื่อมต่อฐานข้อมูล
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

// สร้างการเชื่อมต่อ
$conn = new mysqli($servername, $username, $password, $dbname);

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// รับ receipt_id จาก URL
$receipt_id = isset($_GET['receipt_id']) ? intval($_GET['receipt_id']) : 0;

if ($receipt_id === 0) {
    echo json_encode(null);
    exit;
}

// คำสั่ง SQL สำหรับดึงข้อมูลใบเสร็จพร้อมกับชื่อสินค้า
$sql = "SELECT r.receipt_id, r.order_id, r.receipt_name, r.member_id, r.telephone, r.receipt_date, r.receipt_time, p.product_name 
        FROM `receipt` r 
        JOIN `order_detail` od ON r.order_id = od.order_id 
        JOIN `product` p ON od.product_id = p.product_id 
        WHERE r.receipt_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $receipt_id);
$stmt->execute();
$result = $stmt->get_result();
$receipt = $result->fetch_assoc();

header('Content-Type: application/json');
echo json_encode($receipt);

// ปิดการเชื่อมต่อ
$stmt->close();
$conn->close();
