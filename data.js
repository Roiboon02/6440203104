document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    const isAdmin = user.role === 'admin';
    fetchProducts(isAdmin); // ส่งค่า isAdmin ไปยังฟังก์ชัน fetchProducts
    fetchCategories(); // เรียกฟังก์ชันเพื่อดึงหมวดหมู่เมื่อหน้าโหลดเสร็จ
  } else {
    console.warn('User not found in localStorage, but allowing access to index page.');
    // ไม่ต้องเปลี่ยนเส้นทางไปหน้า login
    fetchProducts(false); // เรียกดูสินค้าในฐานะผู้ใช้ปกติ
    fetchCategories(); // เรียกฟังก์ชันเพื่อดึงหมวดหมู่เมื่อหน้าโหลดเสร็จ
  }

  document.getElementById('searchButton').addEventListener('click', () => {
    const searchQuery = document.getElementById('searchInput').value;
    const selectedCategory = document.getElementById('categoryFilter').value;
    fetchProducts(user ? user.role === 'admin' : false, searchQuery, selectedCategory);
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
                    <img src="${product.product_photo}" alt="${product.product_name}" onclick="buyProduct(${product.product_id})" style="cursor:pointer;">
                    <p>${product.product_name}</p>
                    <p>฿${product.product_price}</p>
                    <p>จำนวน: ${product.product_amount} ${product.product_unit}</p>
                    <p>ผู้ขาย: ${product.seller_name}</p> <!-- แสดงชื่อผู้ขาย -->
                    <a href="product_details.html?product_id=${product.product_id}" style="color: blue; text-decoration: underline;">รายละเอียดเพิ่มเติม</a>
                    <button onclick="buyProduct(${product.product_id})">ซื้อ</button>
                </div>
            `).join('');
    })
    .catch(error => console.error('Error fetching products:', error));
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

function buyProduct(productId) {
  const user = JSON.parse(localStorage.getItem('user'));

  // ตรวจสอบว่ามีข้อมูลผู้ใช้จริง ๆ หรือไม่
  if (user && user.role) {
    // ถ้าผู้ใช้ล็อกอิน ให้เปลี่ยนไปที่หน้า buy_product.html
    window.location.href = `buy_product.html?product_id=${productId}`;
  } else {
    // ถ้าผู้ใช้ไม่ได้ล็อกอิน ให้เปลี่ยนไปที่หน้า login.html
    alert('กรุณาเข้าสู่ระบบก่อนซื้อสินค้า');
    window.location.href = 'login.html';
  }
}
