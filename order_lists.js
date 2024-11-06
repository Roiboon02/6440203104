document.addEventListener('DOMContentLoaded', () => {
    const memberId = getMemberId(); // ฟังก์ชันเพื่อดึง member_id จาก session หรือ localStorage
    fetchOrders(memberId);
});
document.getElementById('backButton').addEventListener('click', () => {
    window.history.back();
});

function fetchOrders(memberId) {
    if (!memberId) {
        document.getElementById('orderHistoryContainer').innerHTML = "กรุณาเข้าสู่ระบบ"; // แจ้งเตือนหากไม่มี member_id
        return;
    }

    fetch(`order_list.php?member_id=${memberId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('orderHistoryContainer').innerHTML = data.error;
                return;
            }
            renderOrders(data);
        });
}


function renderOrders(orders) {
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>หมายเลขคำสั่งซื้อ</th>
                    <th>ชื่อสินค้า</th>
                    <th>ราคา</th>
                    <th>จำนวน</th>
                    <th>ชื่อผู้ซื้อ</th>
                    <th>วันที่</th>
                    <th>เวลา</th>
                    <th>รูปใบเสร็จ</th>
                    <th>สถานะ</th>
                </tr>
            </thead>
            <tbody>
    `;
    orders.forEach(order => {
        tableHTML += `
            <tr>
                <td>${order.order_id}</td>
                <td>${order.product_name}</td>
                <td>${order.order_price}</td>
                <td>${order.order_amount}</td>
                <td>${order.member_name}</td>
                <td>${order.order_date}</td>
                <td>${order.order_time}</td>
                <td><img src="qrcode/${order.order_photo}" alt="Product Image" width="100"></td>
                <td>${order.order_status}</td>
            </tr>
        `;
    });
    tableHTML += `
            </tbody>
        </table>
    `;
    document.getElementById('orderHistoryContainer').innerHTML = tableHTML;
}
function getMemberId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.member_id : null; // เปลี่ยนให้ดึง member_id จาก user ที่เข้าสู่ระบบ
}

function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}
