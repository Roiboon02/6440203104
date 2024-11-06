<?php
session_start();
header('Content-Type: application/json');

// ปิดการแสดงข้อผิดพลาด HTML
error_reporting(E_ALL);
ini_set('display_errors', 0);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$order_id = $_POST['order_id'];
$target_dir = "qrcode/";
$target_file = $target_dir . basename($_FILES["paymentSlip"]["name"]);
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// ตรวจสอบว่าเป็นไฟล์ภาพหรือไม่
if (isset($_FILES["paymentSlip"]) && $_FILES["paymentSlip"]["error"] == UPLOAD_ERR_OK) {
    $check = getimagesize($_FILES["paymentSlip"]["tmp_name"]);
    if ($check === false) {
        echo json_encode(['success' => false, 'error' => 'ไฟล์ที่อัปโหลดไม่ใช่ภาพ']);
        exit();
    }

    // อัปโหลดไฟล์
    if (move_uploaded_file($_FILES["paymentSlip"]["tmp_name"], $target_file)) {
        // บันทึกชื่อไฟล์ในฐานข้อมูล
        $sql = "UPDATE order_detail SET order_photo = ?, order_status = 'ชำระเงินเสร็จสิ้น' WHERE order_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', basename($_FILES["paymentSlip"]["name"]), $order_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'อัปโหลดสลิปการโอนเงินเรียบร้อยแล้ว']);
        } else {
            echo json_encode(['success' => false, 'error' => 'ไม่สามารถบันทึกข้อมูลในฐานข้อมูลได้']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'ไม่สามารถอัปโหลดไฟล์ได้']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์']);
}

$conn->close();
