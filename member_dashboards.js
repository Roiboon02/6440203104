document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch and display products
    fetchProducts(user.member_id);

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});
document.getElementById('backButton').addEventListener('click', () => {
    window.history.back();
});
function fetchProducts(memberId) {
    fetch(`fetch_member_products.php?member_id=${memberId}`)
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            if (Array.isArray(data)) {
                productList.innerHTML = data.map(product => `
                    <div class="product-item">
                        <img src="${product.product_photo}" alt="${product.product_name}">
                        <p>${product.product_name}</p>
                        <p>฿${product.product_price}</p>
                        <p>จำนวน: ${product.product_amount} ${product.product_unit}</p>
                        <p>สถานะ: ${product.product_status}</p>
                        <button onclick="editProduct(${product.product_id})">แก้ไข</button>
                        <button onclick="deleteProduct(${product.product_id})">ลบ</button>
                    </div>
                `).join('');
            } else {
                productList.innerHTML = '<p>ไม่มีสินค้าที่ลงขาย</p>';
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

function editProduct(productId) {
    window.location.href = `edit_product.html?product_id=${productId}`;
}

function deleteProduct(productId) {
    if (confirm('คุณแน่ใจว่าต้องการลบสินค้านี้หรือไม่?')) {
        fetch('delete_product.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('ลบสินค้าสำเร็จ');
                    window.location.reload();
                } else {
                    alert('เกิดข้อผิดพลาดในการลบสินค้า: ' + (data.error || 'ไม่ทราบข้อผิดพลาด'));
                }
            })
            .catch(error => console.error('Error deleting product:', error));
    }
}
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}