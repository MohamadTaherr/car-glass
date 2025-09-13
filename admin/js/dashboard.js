document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const productsList = document.getElementById('products-list');
    const addProductForm = document.getElementById('add-product-form');
    const addProductStatus = document.getElementById('add-product-status');
    const logoutButton = document.getElementById('logout-button');

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/admin/login.html';
    });

    // Function to fetch and display products
    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch products');

            const products = await response.json();
            productsList.innerHTML = products.map(p => `
                <div class="product-item-admin">
                    <strong>${p.name}</strong> (Brand: ${p.brand}) - Stock: ${p.stock}, Price: $${p.selling_price}
                </div>
            `).join('');
        } catch (error) {
            productsList.innerHTML = `<p class="error">${error.message}</p>`;
        }
    };

    // Function to add a new product
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        const productData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to add product');

            addProductStatus.textContent = 'Product added successfully!';
            addProductStatus.className = 'success';
            addProductForm.reset();
            fetchProducts(); // Refresh the product list
        } catch (error) {
            addProductStatus.textContent = error.message;
            addProductStatus.className = 'error';
        }
    });

    // Initial fetch of products
    fetchProducts();
});
