// ฟังก์ชันดูใบเสร็จ
function viewReceipt(receiptId) {
    window.location.href = `receipt_view.html?receipt_id=${receiptId}`;
}

// ฟังก์ชันออกใบเสร็จ
function createReceipt(orderId) {
    const user = JSON.parse(localStorage.getItem('user'));
    const receiptName = prompt('กรุณาใส่ชื่อผู้รับใบเสร็จ:', user.name || '');
    const telephone = prompt('กรุณาใส่หมายเลขโทรศัพท์:', user.telephone || '');

    if (!receiptName || !telephone) {
        alert('ชื่อและหมายเลขโทรศัพท์เป็นข้อมูลที่จำเป็น');
        return;
    }

    const receiptData = {
        order_id: orderId,
        member_id: user.member_id,
        receipt_name: receiptName,
        telephone: telephone,
        receipt_date: new Date().toISOString().slice(0, 10) // วันที่ปัจจุบัน
    };

    fetch('create_receipt.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('ออกใบเสร็จเรียบร้อยแล้ว');
                window.location.href = `receipt_view.html?receipt_id=${result.receipt_id}`;
            } else {
                alert(result.error || 'ไม่สามารถออกใบเสร็จได้');
            }
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาด:', error);
            alert('ไม่สามารถออกใบเสร็จได้');
        });
}

// order_history.js
document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.member_id) {
        alert('กรุณาเข้าสู่ระบบ');
        window.location.href = 'login.html';
        return;
    }

    fetch(`order_history.php?member_id=${user.member_id}`)
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
                    <th>ราคา</th>
                    <th>จำนวน</th>
                    <th>สถานะ</th>
                    <th>วันที่</th>
                    <th>เวลา</th>
                    <th>รูป</th>
                    <th>ดำเนินการ</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(order => `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${order.product_name}</td>
                        <td>฿${order.order_price}</td>
                        <td>${order.order_amount}</td>
                        <td>${order.order_status}</td>
                        <td>${order.order_date}</td> <!-- แสดงวันที่ -->
                        <td>${order.order_time}</td> <!-- แสดงเวลา -->
                        <td><img src="qrcode/${order.order_photo}" alt="Payment Slip" /></td>
                        <td>
                            ${order.receipt_id ?
                    `<button onclick="viewReceipt(${order.receipt_id})">ดูใบเสร็จ</button>` :
                    `<button onclick="createReceipt(${order.order_id})">ออกใบเสร็จ</button>`}
                        </td>
                        <td>
                            ${order.order_status === 'ชำระเงินไม่สำเร็จ' ? `
                                <button onclick="showUploadSlipForm(${order.order_id})">อัปโหลดสลิปใหม่</button>
                            ` : ''}
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        `;
            container.appendChild(table);
        });

});

function showUploadSlipForm(orderId) {
    const formContainer = document.createElement('div');
    formContainer.className = 'upload-slip-form';

    formContainer.innerHTML = `
        <form id="uploadForm_${orderId}" enctype="multipart/form-data">
            <h3>อัปโหลดสลิปการโอนเงินสำหรับคำสั่งซื้อ ${orderId}</h3>
            <div class="qr-code">
                <img src="uploads/qrcode.jpg" alt="QR Code" />
            </div>
            <label for="paymentSlip_${orderId}">อัปโหลดสลิปการโอนเงิน:</label>
            <input type="file" id="paymentSlip_${orderId}" name="paymentSlip" required>
            <button type="button" onclick="uploadSlip(${orderId})">อัปโหลด</button>
        </form>
    `;

    document.getElementById('orderHistoryContainer').appendChild(formContainer);
}

function uploadSlip(orderId) {
    console.log("Order ID:", orderId);  // ตรวจสอบค่า orderId ใน console
    const fileInput = document.getElementById(`paymentSlip_${orderId}`);
    const file = fileInput.files[0];

    if (!file) {
        alert('กรุณาเลือกไฟล์สลิปการชำระเงิน');
        return;
    }

    const formData = new FormData();
    formData.append('paymentSlip', file);
    formData.append('order_id', orderId);

    fetch('upload_payment_slip.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(result.message || 'อัปโหลดสลิปเรียบร้อยแล้ว');
                location.reload();
            } else {
                alert(result.error || 'ไม่สามารถอัปโหลดสลิปได้');
            }
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาด:', error);
            alert('ไม่สามารถอัปโหลดสลิปได้');
        });
}

document.getElementById('backButton').addEventListener('click', () => {
    window.history.back();
});
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}