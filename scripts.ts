document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    if (productList) {
        fetch('fetch_products.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.forEach((product: any) => {
                    const productElement = document.createElement('div');
                    productElement.className = 'product';
                    productElement.innerHTML = `
                        <img src="${product.product_photo}" alt="${product.product_name}">
                        <p>${product.product_name}</p>
                        <p>฿ ${product.product_price}</p>
                        <p>จำนวน ${product.product_amount} ${product.product_unit}</p>
                        <button onclick="buyProduct(${product.product_id})">ซื้อ</button>
                    `;
                    productList.appendChild(productElement);
                });
            })
            .catch(error => console.error('Error fetching products:', error));
    } else {
        console.error('Product list element not found');
    }
});

