document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    if (productId) {
        fetchProductDetails(productId);
    } else {
        alert('ไม่มีข้อมูลสินค้า');
        window.location.href = 'dashboard.html';
    }
    document.getElementById('loginButton').addEventListener('click', () => {
        window.location.href = 'login.html';
    });
    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back();
    });

    document.getElementById('buyButton').addEventListener('click', () => {
        // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือยัง
        const user = localStorage.getItem('user');
        if (user) {
            // ถ้าเข้าสู่ระบบแล้ว สามารถทำการซื้อได้
            alert('ทำการซื้อสินค้า!');
        } else {
            // ถ้าไม่ได้เข้าสู่ระบบ แสดงข้อความแจ้งเตือนและเปลี่ยนเส้นทางไปหน้า login.html
            alert('กรุณาเข้าสู่ระบบก่อนทำการซื้อสินค้า');
            window.location.href = 'login.html';
        }
    });
});

function fetchProductDetails(productId) {
    fetch(`fetch_product_details.php?product_id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('productImage').src = data.product_photo;
                document.getElementById('productName').textContent = data.product_name;
                document.getElementById('productPrice').textContent = `฿${data.product_price}`;
                document.getElementById('productAmount').textContent = `จำนวน: ${data.product_amount}`;
                document.getElementById('productUnit').textContent = `หน่วย: ${data.product_unit}`;
                document.getElementById('productDescription').textContent = data.product_details ? `รายละเอียด: ${data.product_details}` : 'ไม่มีรายละเอียด';
            } else {
                alert('ไม่พบข้อมูลสินค้า');
            }
        })
        .catch(error => console.error('Error fetching product details:', error));
}
