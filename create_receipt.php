<?php
session_start();
header('Content-Type: application/json');
date_default_timezone_set('Asia/Bangkok'); // ตั้งค่าเขตเวลาเป็นเวลาของไทย

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$order_id = $data['order_id'];
$member_id = $data['member_id'];
$receipt_name = $data['receipt_name'];
$telephone = $data['telephone'];
$receipt_date = $data['receipt_date'];

// เช็คว่ามีใบเสร็จสำหรับคำสั่งซื้อนี้หรือไม่
$sqlCheck = "SELECT COUNT(*) FROM receipt WHERE order_id = ? AND member_id = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("ii", $order_id, $member_id);
$stmtCheck->execute();
$stmtCheck->bind_result($count);
$stmtCheck->fetch();
$stmtCheck->close();

if ($count > 0) {
    echo json_encode(["success" => false, "error" => "ใบเสร็จนี้ถูกออกไปแล้ว"]);
    $conn->close();
    exit;
}

// คำสั่ง SQL สำหรับบันทึกใบเสร็จ
// คำสั่ง SQL สำหรับบันทึกใบเสร็จ
$sql = "INSERT INTO receipt (order_id, receipt_name, member_id, telephone, receipt_date, receipt_time) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$receipt_date = date('Y-m-d'); // วันที่ปัจจุบัน
$receipt_time = date('H:i:s'); // รับเวลาปัจจุบันในรูปแบบเวลา
$stmt->bind_param("isssss", $order_id, $receipt_name, $member_id, $telephone, $receipt_date, $receipt_time);

if ($stmt->execute()) {
    $receipt_id = $stmt->insert_id; // รับค่า receipt_id หลังจากการบันทึก
    echo json_encode(["success" => true, "receipt_id" => $receipt_id]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
