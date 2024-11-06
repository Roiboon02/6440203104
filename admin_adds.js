document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back();
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    document.getElementById('addForm').addEventListener('submit', (e) => { // เปลี่ยนเป็น addForm
        e.preventDefault();
        const formData = new FormData(document.getElementById('addForm'));
        fetch('admin_add.php', { // ตรวจสอบให้แน่ใจว่าใช้ไฟล์ที่ถูกต้อง
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                if (result.success) {
                    window.location.href = 'admin.html';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                if (error) {
                    window.location.href = 'admin.html';
                }
                alert('บันทึกข้อมูล');
            });
    });
});
