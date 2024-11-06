<?php
session_start();
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$order_id = $data['order_id'];
$order_status = $data['order_status'];

// ตรวจสอบสถานะการชำระเงินก่อนอัปเดต
if ($order_status === 'ชำระเงินไม่สำเร็จ') {
    echo json_encode(['error' => 'สถานะการชำระเงินไม่สำเร็จ กรุณาสแกนคิวอาร์โค้ดและอัปโหลดสลิปใหม่']);
    exit();
}

// อัปเดตสถานะการชำระเงินตามที่เลือก
$sql = "UPDATE order_detail SET order_status = ? WHERE order_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('si', $order_status, $order_id);

if ($stmt->execute()) {
    echo json_encode(['message' => 'อัปเดตสถานะเรียบร้อยแล้ว']);
} else {
    echo json_encode(['error' => 'ไม่สามารถอัปเดตสถานะได้']);
}

$stmt->close();
$conn->close();
