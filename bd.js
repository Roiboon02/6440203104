document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        const isAdmin = user.role === 'admin';
        fetchProducts(isAdmin);
    } else {
        console.error('User not found in localStorage');
        window.location.href = 'login.html';
    }

    document.getElementById('searchButton').addEventListener('click', () => {
        const searchQuery = document.getElementById('searchInput').value;
        const selectedCategory = document.getElementById('categoryFilter').value;
        fetchProducts(user.role === 'admin', searchQuery, selectedCategory);
    });

});

function fetchProducts(isAdmin, query = '', category = '') {
    fetch(`fetch_products.php?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`)
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
                    <button onclick="buyProduct(${product.product_id}, ${product.member_id})">ซื้อ</button>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error fetching products:', error));
}


// ฟังก์ชันสำหรับซื้อสินค้า
function buyProduct(productId, sellerMemberId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.member_id === sellerMemberId) {
        alert('คุณไม่สามารถซื้อสินค้าของตัวเองได้');
    } else {
        // เปลี่ยนไปยังหน้าซื้อสินค้าตาม productId
        window.location.href = `buy_product.html?product_id=${productId}`;
    }
}

function fetchCategories() {
    fetch('fetch_categories.php')
        .then(response => response.json())
        .then(data => {
            const categoryFilter = document.getElementById('categoryFilter');
            categoryFilter.innerHTML = '<option value="">หมวดหมู่ทั้งหมด</option>';
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

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
