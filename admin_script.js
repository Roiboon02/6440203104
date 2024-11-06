document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    document.getElementById('searchButton').addEventListener('click', () => {
        const searchQuery = document.getElementById('searchInput').value;
        fetchProducts(searchQuery);
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});

function fetchProducts(isAdmin, query = '', category = '') {
    fetch(`admin_products.php?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error('Error fetching products:', data);
                return;
            }
            const productList = document.getElementById('product-list');
            productList.innerHTML = data.map(product => `
                <div class="product-item">
                    <img src="${product.product_photo}" alt="${product.product_name}" onclick="buyProduct(${product.product_id}, ${product.member_id})" style="cursor:pointer;">
                    <p>${product.product_name}</p>
                    <p>฿${product.product_price}</p>
                    <p>จำนวน: ${product.product_amount} ${product.product_unit}</p>
                    <p>ผู้ขาย: ${product.seller_name}</p> <!-- แสดงชื่อผู้ขาย -->
                    <a href="product_memberdetails.html?product_id=${product.product_id}" style="color: blue; text-decoration: underline;">รายละเอียดเพิ่มเติม</a>
<button onclick="deleteProduct(${product.product_id})">ลบ</button>
<button onclick="editProduct(${product.product_id})">แก้ไข</button>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error fetching products:', error));
}
function deleteProduct(productId) {
    if (confirm('คุณแน่ใจว่าต้องการลบผลิตภัณฑ์นี้?')) {
        fetch('delete_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_id: productId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('ลบผลิตภัณฑ์สำเร็จ');
                    fetchProducts(); // Refresh the product list
                } else {
                    alert(`ลบผลิตภัณฑ์ไม่สำเร็จ: ${data.error}`);
                    console.error('Error deleting product:', data);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

function editProduct(productId) {
    window.location.href = `admin_edit.html?product_id=${productId}`;
}
function fetchCategories() {
    fetch('fetch_categories.php')
        .then(response => response.json())
        .then(data => {
            const categoryFilter = document.getElementById('categoryFilter');
            categoryFilter.innerHTML = '<option value="">หมวดหมู่ทั้งหมด</option>'; // Default option to show all categories
            if (Array.isArray(data)) {
                categoryFilter.innerHTML += data.map(category => `
                    <option value="${category}">${category}</option>
                `).join('');
            } else {
                console.error('Error fetching categories:', data);
            }
        })
        .catch(error => console.error('Error fetching categories:', error));
}