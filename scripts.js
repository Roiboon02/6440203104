document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        const isAdmin = user.role === 'admin';
        fetchProducts(isAdmin); // ส่งค่า isAdmin ไปยังฟังก์ชัน fetchProducts
    } else {
        console.error('User not found in localStorage');
        window.location.href = 'login.html'; // หากไม่มีข้อมูลผู้ใช้ให้เปลี่ยนเส้นทางไปที่หน้าเข้าสู่ระบบ
    }


    document.getElementById('searchButton').addEventListener('click', () => {
        const searchQuery = document.getElementById('searchInput').value;
        const selectedCategory = document.getElementById('categoryFilter').value;
        fetchProducts(user.role === 'admin', searchQuery, selectedCategory);
    });

    document.getElementById('loginButton').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    document.getElementById('registerButton').addEventListener('click', () => {
        window.location.href = 'register.html';
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
          <img src="${product.product_photo}" alt="${product.product_name}">
          <p>${product.product_name}</p>
          <p>฿${product.product_price}</p>
          <p>จำนวน: ${product.product_amount} ${product.product_unit}</p>
          ${isAdmin ? `<button onclick="confirmDelete(${product.product_id})">ลบ</button>` : `<button onclick="buyProduct(${product.product_id})">ซื้อ</button>`}
        </div>
      `).join('');
        })
        .catch(error => console.error('Error fetching products:', error));
}

function confirmDelete(productId) {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
        deleteProduct(productId);
    }
}

function deleteProduct(productId) {
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
                alert('ลบสินค้าสำเร็จ');
                // รีเฟรชรายการสินค้า
                const user = JSON.parse(localStorage.getItem('user'));
                fetchProducts(user && user.role === 'admin');
            } else {
                console.error('Error deleting product:', data);
            }
        })
        .catch(error => console.error('Error deleting product:', error));
}

function buyProduct(productId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        window.location.href = 'buy_product.html?product_id=' + productId;
    } else {
        window.location.href = 'login.html';
    }
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
