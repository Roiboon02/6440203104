document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const receiptId = urlParams.get('receipt_id');

    if (!receiptId) {
        alert('ไม่พบใบเสร็จ');
        window.history.back();
        return;
    }

    fetch(`get_receipt.php?receipt_id=${receiptId}`)
        .then(response => response.json())
        .then(data => {
            if (!data) {
                document.getElementById("receiptContainer").innerHTML = "<p>ไม่พบข้อมูลใบเสร็จ</p>";
                return;
            }

            document.getElementById('receiptId').textContent = data.receipt_id;
            document.getElementById('orderId').textContent = data.order_id;
            document.getElementById('productName').textContent = data.product_name;
            document.getElementById('receiptName').textContent = data.receipt_name;
            document.getElementById('telephone').textContent = data.telephone;
            document.getElementById('receiptDate').textContent = data.receipt_date; // วันที่ออกใบเสร็จ
            document.getElementById('receiptTime').textContent = data.receipt_time; // เวลาออกใบเสร็จ
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาด:', error);
            alert('ไม่สามารถดึงข้อมูลใบเสร็จได้');
        });

    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back();
    });
});