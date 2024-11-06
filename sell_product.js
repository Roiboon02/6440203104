document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back();
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    document.getElementById('sellForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(document.getElementById('sellForm'));
        fetch('sell_product.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                if (result.success) {
                    window.location.href = 'dashboard.html';
                }
            })

    });
});
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}