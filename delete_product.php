<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

// Read input
$data = json_decode(file_get_contents('php://input'), true);
$product_id = isset($data['product_id']) ? intval($data['product_id']) : 0;

if ($product_id > 0) {
    $conn->begin_transaction();

    try {
        // อ่านอีเมลผู้ขายจากฐานข้อมูล
        $sql = "SELECT m.email, p.product_name FROM member m 
                JOIN selling s ON m.member_id = s.member_id 
                JOIN product p ON s.product_id = p.product_id 
                WHERE s.product_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $product_id);
        $stmt->execute();
        $stmt->bind_result($email_to, $product_name);
        $stmt->fetch();
        $stmt->close();

        $sql = "DELETE FROM receipt WHERE order_id IN (SELECT order_id FROM order_detail WHERE product_id = ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $product_id);
        $stmt->execute();
        $stmt->close();
        // ลบข้อมูลในตาราง order_detail ที่อ้างอิง product_id
        $sql = "DELETE FROM order_detail WHERE product_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $product_id);
        $stmt->execute();
        $stmt->close();

        // ลบข้อมูลในตาราง type ที่อ้างอิง product_id
        $sql = "DELETE FROM type WHERE product_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $product_id);
        $stmt->execute();
        $stmt->close();

        // ลบข้อมูลในตาราง selling ที่อ้างอิง product_id
        $sql = "DELETE FROM selling WHERE product_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $product_id);
        $stmt->execute();
        $stmt->close();

        // ลบข้อมูลในตาราง product
        $sql = "DELETE FROM product WHERE product_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $product_id);
        $stmt->execute();

        // ส่งอีเมลแจ้งเตือน
        if ($email_to) {
            $subject = "การแจ้งเตือน: ผลิตภัณฑ์ของคุณถูกลบ";
            $message = "เรียนเจ้าของผลิตภัณฑ์,\n\nแอดมินได้ทำการลบผลิตภัณฑ์ของท่านที่ชื่อ: {$product_name} (ID: {$product_id}).\n\nขอบคุณที่ใช้บริการของเรา!";
            $headers = "From: admin@example.com"; // เปลี่ยนเป็นอีเมลแอดมินที่ต้องการ

            mail($email_to, $subject, $message, $headers);
        }

        $conn->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid product ID']);
}

$conn->close();
