<?php
session_start();
header('Content-Type: application/json');
date_default_timezone_set('Asia/Bangkok'); // ตั้งค่าเขตเวลาเป็นเวลาของไทย

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$product_id = isset($_POST['product_id']) ? $_POST['product_id'] : '';
$quantity = isset($_POST['quantity']) ? $_POST['quantity'] : 1;
$paymentMethod = isset($_POST['paymentMethod']) ? $_POST['paymentMethod'] : '';

// ดึง member_id จาก session
$member_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

// ตรวจสอบข้อมูล
if (empty($product_id)) {
    echo json_encode(['error' => 'Missing product_id']);
    exit();
}

if ($member_id === null) {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

// ดึงข้อมูลสินค้า
$sql = "SELECT product_price, product_amount FROM product WHERE product_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $product_id);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();
$stmt->close();

if (!$product) {
    echo json_encode(['error' => 'ไม่พบสินค้า']);
    exit();
}

$product_price = $product['product_price'];
$product_amount = $product['product_amount'];

// ตรวจสอบจำนวนสินค้าที่เพียงพอ
if ($quantity > $product_amount) {
    echo json_encode(['error' => 'สินค้าในคลั่งไม่เพียงพอ']);
    exit();
}

$total_price = $product_price * $quantity;
$remaining_stock = $product_amount - $quantity;

// อัปเดตจำนวนสินค้าที่เหลือและสถานะสินค้า
$product_status = $remaining_stock > 0 ? 'มีสินค้า' : 'สินค้าหมด';
$sql = "UPDATE product SET product_amount = ?, product_status = ? WHERE product_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('isi', $remaining_stock, $product_status, $product_id);
$stmt->execute();
$stmt->close();

// การจัดการการอัปโหลดสลิป
// กำหนดค่า order_photo เป็น paywait.png หากชำระเงินแบบ COD
$order_photo = '';
if ($paymentMethod === 'cod') {
    $order_photo = 'paywait.png';
} elseif ($paymentMethod === 'qr' && isset($_FILES['paymentSlip'])) {
    $targetDir = "qrcode/";
    $targetFile = $targetDir . basename($_FILES["paymentSlip"]["name"]);
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    $allowedTypes = ['jpg', 'png', 'jpeg', 'gif'];
    if (in_array($imageFileType, $allowedTypes)) {
        if (move_uploaded_file($_FILES["paymentSlip"]["tmp_name"], $targetFile)) {
            $order_photo = basename($_FILES["paymentSlip"]["name"]);
        } else {
            echo json_encode(['error' => 'Error uploading the file.']);
            exit();
        }
    } else {
        echo json_encode(['error' => 'Invalid file type.']);
        exit();
    }
}

// บันทึกคำสั่งซื้อใน order_detail พร้อมเวลาและวันที่
$order_status = $paymentMethod === 'cod' ? 'รอการชำระเงิน' : 'ชำระเงินเสร็จสิ้น';
$order_date = date('Y-m-d'); // วันที่ปัจจุบัน
$order_time = date('H:i:s'); // เวลาปัจจุบัน

$sql = "INSERT INTO order_detail (product_id, order_price, order_amount, order_photo, member_id, order_status, order_date, order_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('idisssss', $product_id, $total_price, $quantity, $order_photo, $member_id, $order_status, $order_date, $order_time);
$stmt->execute();
$stmt->close();

echo json_encode(['success' => true]);

$conn->close();
