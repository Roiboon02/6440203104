document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    if (productId) {
        fetchProductDetails(productId);
    } else {
        alert('ไม่มีข้อมูลสินค้า');
        window.location.href = 'dashboard.html';
    }
    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back();
    });
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});
document.getElementById('buyButton').addEventListener('click', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    if (productId) {
        window.location.href = `buy_product.html?product_id=${productId}`;
    } else {
        alert('ไม่พบข้อมูลสินค้า');
    }
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
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}