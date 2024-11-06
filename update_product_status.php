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
$productId = $data['product_id'];

if ($productId) {
    // อัปเดตสถานะสินค้าเป็น 'สินค้าหมด'
    $sql = "UPDATE product SET product_status = 'สินค้าหมด' WHERE product_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $productId);
    $success = $stmt->execute();

    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid product ID']);
}

$conn->close();
