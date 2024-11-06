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

$member_id = isset($_GET['member_id']) ? $_GET['member_id'] : null;

if ($member_id === null) {
    echo json_encode(['error' => 'Missing member_id']);
    exit();
}

$sql = "SELECT od.order_id, od.product_id, p.product_name, od.order_price, od.order_amount, od.order_status, od.order_photo, r.receipt_id, od.order_date, od.order_time
        FROM order_detail od
        JOIN product p ON od.product_id = p.product_id
        LEFT JOIN receipt r ON od.order_id = r.order_id
        WHERE od.member_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param('i', $member_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    // เพิ่มการตรวจสอบสถานะการชำระเงิน
    $row['order_status'] = $row['order_status'] === 'ชำระเงินไม่สำเร็จ' ? 'ชำระเงินไม่สำเร็จ' : $row['order_status'];
    $orders[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($orders);
