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

// ปรับ SQL Query
$sql = "SELECT 
            od.order_id, 
            od.product_id, 
            p.product_name, 
            od.order_price, 
            od.order_amount, 
            od.order_photo, 
            od.order_status, 
            od.order_time, 
            od.order_date,
            b.name AS buyer_name,
            se.name AS seller_name  -- ใช้ชื่อผู้ขาย
        FROM 
            order_detail od
        JOIN 
            product p ON od.product_id = p.product_id
        JOIN 
            member b ON od.member_id = b.member_id  -- ผู้ซื้อ
        JOIN 
            selling s ON p.product_id = s.product_id
        JOIN 
            member se ON s.member_id = se.member_id";  // ผู้ขาย

$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($orders);
