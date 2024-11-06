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

$sql = "SELECT od.order_id, p.product_name, od.order_price, od.order_amount, od.order_status, od.order_time, od.order_date, od.order_photo, m.name AS member_name
        FROM order_detail od
        JOIN product p ON od.product_id = p.product_id
        JOIN selling s ON p.product_id = s.product_id
        JOIN member m ON od.member_id = m.member_id
        WHERE od.member_id != s.member_id AND s.member_id = ?"; // เปลี่ยนเป็น != เพื่อไม่ให้รวมการซื้อสินค้าของสมาชิก
$stmt = $conn->prepare($sql);

$stmt->bind_param('i', $member_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($orders);
