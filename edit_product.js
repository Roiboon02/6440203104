document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');
    const editProductForm = document.getElementById('editProductForm');

    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back();
    });

    if (!productId) {
        alert('ไม่พบรหัสสินค้าที่ต้องการแก้ไข');
        window.location.href = 'member_dashboard.html';
        return;
    }

    // Fetch product details
    fetch(`edit_product.php?product_id=${productId}`)
        .then(response => response.json())
        .then(product => {
            console.log(product); // ดูค่าที่ได้รับ
            if (product && !product.error) {
                document.getElementById('productId').value = product.product_id || '';
                document.getElementById('productName').value = product.product_name || '';
                document.getElementById('productPrice').value = product.product_price || 0; // ใช้ 0 ถ้า undefined
                document.getElementById('productAmount').value = product.product_amount || 0; // ใช้ 0 ถ้า undefined
                document.getElementById('productUnit').value = product.product_unit || '';
                document.getElementById('productStatus').value = product.product_status || 'มีสินค้า'; // ค่าเริ่มต้น
                document.getElementById('currentPhotoContainer').innerHTML = `<img src="${product.product_photo || 'default_photo.jpg'}" alt="${product.product_name || 'Default Product'}" style="max-width: 200px; margin-bottom: 10px;">`;
            } else {
                alert('ไม่พบข้อมูลสินค้า');
            }
        })
        .catch(error => console.error('Error fetching product details:', error));

    editProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(editProductForm);
        fetch('update_product.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                return response.text(); // เปลี่ยนเป็น text แทน JSON
            })
            .then(data => {
                console.log(data); // แสดงข้อมูลที่ได้รับจากเซิร์ฟเวอร์
                try {
                    const jsonData = JSON.parse(data); // แปลงกลับเป็น JSON
                    if (jsonData.success) {
                        alert('อัปเดตสินค้าเรียบร้อยแล้ว');
                        window.location.href = 'member_dashboard.html';
                    } else {
                        alert('เกิดข้อผิดพลาด: ' + jsonData.error);
                    }
                } catch (e) {
                    alert('เกิดข้อผิดพลาด: ' + e.message);
                }
            })
            .catch(error => console.error('Error updating product:', error));
    });
});

function toggleMenu() {
    document.getElementById('dropdownMenu').classList.toggle('show');
}

window.onclick = function (event) {
    if (!event.target.matches('.user-icon *')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
