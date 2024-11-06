document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product_id');
    const user = JSON.parse(localStorage.getItem('user'));

    // ตรวจสอบว่ามีข้อมูลผู้ใช้ใน localStorage และเติมข้อมูลในฟอร์มอัตโนมัติ
    if (user) {
        document.getElementById('fullName').value = user.name || '';
        document.getElementById('telephone').value = user.telephone || '';
        document.getElementById('address').value = user.address || '';
    } else {
        // ถ้าไม่มีข้อมูลผู้ใช้ ให้กลับไปที่หน้า login
        window.location.href = 'login.html';
    }

    // โหลดข้อมูลสินค้า
    fetch(`get_product.php?product_id=${productId}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('productPhoto').src = product.product_photo;
            document.getElementById('productName').textContent = product.product_name;
            document.getElementById('productPrice').textContent = product.product_price;
            document.getElementById('productDetails').textContent = product.product_details;
            document.getElementById('productAmount').textContent = `${product.product_amount} ${product.product_unit}`;
            const productPrice = parseFloat(product.product_price);
            const quantityInput = document.getElementById('quantity');
            const totalPriceSpan = document.getElementById('totalPrice');

            quantityInput.addEventListener('input', function () {
                const quantity = parseInt(this.value) || 0;
                const totalPrice = productPrice * quantity;
                totalPriceSpan.textContent = totalPrice.toFixed(2);
            });
        })
        .catch(error => console.error('ไม่สามารถซื้อสินค้าได้:', error));

    // ปุ่ม backButton
    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back();
    });

    // เปลี่ยนวิธีการชำระเงิน
    document.getElementById('paymentMethod').addEventListener('change', function () {
        const qrCodeSection = document.getElementById('qrCodeSection');
        qrCodeSection.style.display = this.value === 'qr' ? 'block' : 'none';

        // ถ้าเลือก QR code ให้ตั้งค่าเวลา 2 นาที
        if (this.value === 'qr') {
            startTimer(); // เริ่มตัวนับเวลา
        }
    });

    // ส่งข้อมูลการสั่งซื้อ
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(document.getElementById('orderForm'));
        formData.append('product_id', productId);

        fetch('buy_product.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('สั่งซื้อสำเร็จ!');
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    });

    // ตั้งค่า Logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    // ฟังก์ชันเริ่มตัวนับเวลา
    function startTimer() {
        const timeoutDuration = 120000; // 2 นาที
        let timeLeft = timeoutDuration / 1000; // เวลาที่เหลือในวินาที
        const qrCodeSection = document.getElementById('qrCodeSection');

        // สร้างองค์ประกอบเพื่อแสดงเวลาที่เหลือ
        const timerDisplay = document.createElement('p');
        timerDisplay.id = 'timerDisplay';
        timerDisplay.textContent = 'เวลาที่เหลือ: 2:00'; // แสดงเวลาเริ่มต้น
        qrCodeSection.appendChild(timerDisplay);

        const timer = setInterval(() => {
            timeLeft--;

            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            // อัปเดตการแสดงเวลาที่เหลือ
            timerDisplay.textContent = `เวลาที่เหลือ: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

            if (timeLeft <= 0) {
                clearInterval(timer); // ยกเลิก Timer
                alert("หมดเวลาในการสแกนคิวอาร์โค้ด! คำสั่งซื้อนี้จะถูกยกเลิก.");
                window.location.href = 'dashboard.html'; // เปลี่ยนไปยังหน้า dashboard
            }
        }, 1000); // อัปเดตทุก 1 วินาที

        // ลบ Timer ถ้าผู้ใช้ทำการสั่งซื้อ
        document.getElementById('orderForm').addEventListener('submit', () => {
            clearInterval(timer); // ยกเลิก Timer
        });
    }
});
