document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            id: 1,
            name: 'Artículo 1',
            description: 'Descripción del artículo 1',
            price: 10.00,
            image: 'path/to/image1.jpg'
        },
        {
            id: 2,
            name: 'Artículo 2',
            description: 'Descripción del artículo 2',
            price: 20.00,
            image: 'path/to/image2.jpg'
        },
        // Agrega más productos según sea necesario
    ];

    const productList = document.querySelector('.product-list');

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">$${product.price.toFixed(2)}</div>
            <input type="number" class="quantity" value="1" min="1">
            <button data-id="${product.id}">Compra</button>
        `;

        productList.appendChild(productItem);
    });

    productList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const productId = e.target.getAttribute('data-id');
            const quantity = e.target.previousElementSibling.value;
            addToCart(productId, quantity);
        }
    });

    function addToCart(productId, quantity) {
        // Lógica para agregar el producto al carrito
        console.log(`Producto ${productId} agregado al carrito con cantidad ${quantity}`);
    }
});