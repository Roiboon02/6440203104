document.addEventListener("DOMContentLoaded", function () {
    fetch(`admin_history.php`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("orderHistoryContainer");
            if (data.length === 0) {
                container.innerHTML = "<p>ไม่มีประวัติการสั่งซื้อ</p>";
                return;
            }

            const table = document.createElement("table");
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>หมายเลขคำสั่งซื้อ</th>
                        <th>ชื่อสินค้า</th>
                        <th>ชื่อผู้ซื้อ</th>
                        <th>ชื่อผู้ขาย</th>
                        <th>ราคา</th>
                        <th>จำนวน</th>
                        <th>สถานะ</th>
                        <th>รูป</th>
                        <th>เปลี่ยนสถานะการชำระเงิน</th>
                        <th>ยืนยันการเปลี่ยนสถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(order => `
                        <tr>
                            <td>${order.order_id}</td>
                            <td>${order.product_name}</td>
                            <td>${order.buyer_name}</td>
                            <td>${order.seller_name}</td>
                            <td>${order.order_price}</td>
                            <td>${order.order_amount}</td>
                            <td>${order.order_status}</td>
                            <td><img src="qrcode/${order.order_photo}" alt="Payment Slip" /></td>
                            <td>
                                <select id="orderStatus_${order.order_id}">
                                    <option value="ยืนยันการชำระเงิน" ${order.order_status === 'ยืนยันการชำระเงิน' ? 'selected' : ''}>ยืนยันการชำระเงิน</option>
                                    <option value="รอการชำระเงิน" ${order.order_status === 'รอการชำระเงิน' ? 'selected' : ''}>รอการชำระเงิน</option>
                                    <option value="ชำระเงินเสร็จสิน" ${order.order_status === 'ชำระเงินเสร็จสิน' ? 'selected' : ''}>ชำระเงินเสร็จสิน</option>
                                    <option value="ชำระเงินไม่สำเร็จ" ${order.order_status === 'ชำระเงินไม่สำเร็จ' ? 'selected' : ''}>ชำระเงินไม่สำเร็จ</option>
                                </select>
                            </td>
                            <td>
                                <button onclick="confirmPayment(${order.order_id})">ยืนยัน</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            `;
            container.appendChild(table);
        });

    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back();
    });
});

// ฟังก์ชันยืนยันการชำระเงิน
function confirmPayment(orderId) {
    // รับค่าสถานะที่เลือก
    const selectedStatus = document.querySelector(`#orderStatus_${orderId}`).value;

    // ตรวจสอบว่ามีการเลือกสถานะ
    if (!selectedStatus) {
        alert("กรุณาเลือกสถานะก่อนยืนยันการชำระเงิน");
        return;
    }

    fetch('confirm_payment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId, order_status: selectedStatus }) // ส่งสถานะที่เลือกไป
    })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert(result.error);
            } else {
                alert(result.message);
                window.location.reload(); // รีเฟรชหน้าหลังจากยืนยัน
            }
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาด:', error);
        });
}

function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}
