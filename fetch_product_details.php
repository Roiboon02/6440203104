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

$product_id = isset($_GET['product_id']) ? $_GET['product_id'] : '';

$sql = "SELECT product_id, product_name, product_price, product_photo, product_details, product_amount, product_unit FROM product WHERE product_id = '$product_id'";

$result = $conn->query($sql);
$product = $result->fetch_assoc();

echo json_encode($product);
$conn->close();
