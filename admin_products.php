<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

$conn = new mysqli($servername, $username, $password, $dbname);
$productId = isset($_GET['product_id']) ? $_GET['product_id'] : null;
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$search = isset($_GET['search']) ? $_GET['search'] : '';
$category = isset($_GET['category']) ? $_GET['category'] : '';

$sql = "SELECT p.product_id, p.product_name, p.product_price, p.product_photo, 
               p.product_amount, p.product_unit, m.name AS seller_name 
        FROM product p 
        LEFT JOIN selling s ON p.product_id = s.product_id 
        LEFT JOIN member m ON s.member_id = m.member_id 
        WHERE p.product_name LIKE '%$search%'";

if ($category) {
    $sql .= " AND product_id IN (SELECT product_id FROM type WHERE type_name = '$category')";
}

$result = $conn->query($sql);
$products = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);
$conn->close();
