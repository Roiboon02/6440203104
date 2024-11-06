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

$data = json_decode(file_get_contents("php://input"), true);
$productName = $data['product_name'];
$productPrice = $data['product_price'];
$productPhoto = $data['product_photo'];
$productAmount = $data['product_amount'];
$productDetails = $data['product_details'];
$productUnit = $data['product_unit'];

if ($productName && $productPrice && $productPhoto) {
    // เพิ่มผลิตภัณฑ์ใหม่
    $sql = "INSERT INTO product (product_name, product_price, product_photo, product_amount, product_details, product_unit, product_status) 
            VALUES (?, ?, ?, ?, ?, ?, 'มีสินค้า')";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdissss", $productName, $productPrice, $productPhoto, $productAmount, $productDetails, $productUnit);
    $success = $stmt->execute();

    if ($success) {
        echo json_encode(['success' => true, 'product_id' => $stmt->insert_id]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
}

$conn->close();
