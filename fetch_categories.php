<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$sql = "SELECT DISTINCT type_name FROM type"; // ดึงข้อมูล type_name
$result = $conn->query($sql);
$categories = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['type_name']; // เพิ่ม type_name ลงใน array
    }
}

echo json_encode($categories); // ส่งข้อมูลหมวดหมู่เป็น JSON
$conn->close();
