<?php
session_start();
header('Content-Type: application/json');



$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['order_id'])) {
    echo json_encode(['success' => false, 'error' => 'ไม่มี order_id']);
    exit();
}

$order_id = $data['order_id'];
$new_status = 'ชำระเงินเสร็จสิ้น'; // สถานะใหม่ที่ต้องการตั้ง

$sql = "UPDATE order_detail SET order_status = ? WHERE order_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('si', $new_status, $order_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'ไม่สามารถเปลี่ยนสถานะการชำระเงินได้: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
