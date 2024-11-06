<?php
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

$member_id = isset($_GET['member_id']) ? intval($_GET['member_id']) : 0;

$sql = "SELECT p.product_id, p.product_name, p.product_price, p.product_photo, 
               p.product_amount, p.product_unit, p.product_status
        FROM product p
        JOIN selling s ON p.product_id = s.product_id
        WHERE s.member_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $member_id);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);

$stmt->close();
$conn->close();
