document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');

    fetch('/api/public/products')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            if (products.length === 0) {
                productsList.innerHTML = '<p>No products found.</p>';
                return;
            }

            const productItems = products.map(product => `
                <div class="product-item">
                    <h3>${product.name}</h3>
                    <p>Brand: ${product.brand}</p>
                    <p><strong>Price:</strong> $${product.selling_price.toFixed(2)}</p>
                </div>
            `).join('');

            productsList.innerHTML = productItems;
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            productsList.innerHTML = '<p>Error loading products. Please try again later.</p>';
        });
});
