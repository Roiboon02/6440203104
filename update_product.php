<?php
header('Content-Type: application/json');
require 'db_connection.php'; // นำเข้าไฟล์เชื่อมต่อฐานข้อมูล

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // รหัสการอัปเดตสินค้า...
    // ตัวแปร $pdo สามารถใช้งานได้เนื่องจากถูกกำหนดใน db_connection.php แล้ว
    $productId = $_POST['product_id'];
    $productName = $_POST['product_name'];
    $productPrice = $_POST['product_price'];
    $productAmount = $_POST['product_amount'];
    $productUnit = $_POST['product_unit'];
    $productStatus = $_POST['product_status'];
    $productPhoto = null;

    // จัดการไฟล์ที่อัปโหลด
    if (isset($_FILES['product_photo']) && $_FILES['product_photo']['error'] == UPLOAD_ERR_OK) {
        $targetDir = "uploads/";
        $targetFile = $targetDir . basename($_FILES["product_photo"]["name"]);
        if (move_uploaded_file($_FILES["product_photo"]["tmp_name"], $targetFile)) {
            $productPhoto = $targetFile;
        } else {
            echo json_encode(['success' => false, 'error' => 'File upload failed']);
            exit();
        }
    }

    // อัปเดตข้อมูลสินค้า
    $query = "UPDATE `product` SET `product_name` = ?, `product_price` = ?, `product_amount` = ?, `product_unit` = ?, `product_status` = ?";
    $params = [$productName, $productPrice, $productAmount, $productUnit, $productStatus];

    if ($productPhoto) {
        $query .= ", `product_photo` = ?";
        $params[] = $productPhoto;
    }
    $query .= " WHERE `product_id` = ?";
    $params[] = $productId;

    // เตรียมและดำเนินการคำสั่ง SQL
    $stmt = $pdo->prepare($query);
    if ($stmt->execute($params)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Database update failed']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
