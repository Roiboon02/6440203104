<?php
header('Content-Type: application/json');

// ข้อมูลการเชื่อมต่อฐานข้อมูล
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

// สร้างการเชื่อมต่อฐานข้อมูล
$conn = new mysqli($servername, $username, $password, $dbname);

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

// รับ product_id จากพารามิเตอร์ URL
$product_id = isset($_GET['product_id']) ? $_GET['product_id'] : '';

// ป้องกัน SQL Injection
$product_id = $conn->real_escape_string($product_id);

// สร้าง SQL Query เพื่อดึงข้อมูลผลิตภัณฑ์
$sql = "SELECT product_id, product_name, product_price, product_photo, product_details, product_amount, product_unit FROM product WHERE product_id = '$product_id'";
$result = $conn->query($sql);

// ตรวจสอบผลลัพธ์
if ($result && $result->num_rows > 0) {
    $product = $result->fetch_assoc();
    echo json_encode($product);
} else {
    echo json_encode(['error' => 'Product not found']);
}

// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
