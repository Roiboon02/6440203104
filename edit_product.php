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

if ($productId) {
    $sql = "SELECT product_id, product_name, product_price, product_photo, product_amount, product_unit, product_status 
            FROM product 
            WHERE product_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();

    echo json_encode($product);
} else {
    echo json_encode(['error' => 'Product ID is not specified']);
}

$conn->close();
