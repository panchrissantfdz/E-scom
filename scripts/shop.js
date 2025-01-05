document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const purchaseButton = document.getElementById('purchase-button');

    // Función para mostrar los artículos del carrito
    function displayCartItems() {
        fetch('https://t9-2021630245.azurewebsites.net/api/ConsultaCarrito', {
            method: "GET"
        }).then(res => res.json()).then(cartItems => {
            cartItemsContainer.innerHTML = '';
            cartItems.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');

                cartItem.innerHTML = `
                    <h3>${item.nombre}</h3>
                    <p>${item.descripcion}</p>
                    <div class="price">$${item.precio.toFixed(2)}</div>
                    <div class="quantity">Cantidad: ${item.cantidad}</div>
                    <button class="remove-button" data-id="${item.id}">Eliminar</button>`;

                cartItemsContainer.appendChild(cartItem);
            });
        }).catch(error => console.error('Error:', error));
    }

    // Función para eliminar un producto del carrito
    function removeFromCart(productId) {
        fetch(`http://135.232.96.13:8080/ws/eliminar_articulo/${productId}`, {
            method: 'DELETE'
        }).then(res => res.json()).then(data => {
            console.log('Producto eliminado del carrito:', data);
            displayCartItems();
        }).catch(error => console.error('Error:', error));
    }

    // Función para realizar la compra
    function purchaseItems() {
        fetch('http://135.232.96.13:8080/ws/realizar_compra', {
            method: 'POST'
        }).then(res => res.json()).then(data => {
            console.log('Compra realizada:', data);
            displayCartItems();
        }).catch(error => console.error('Error:', error));
    }

    // Mostrar artículos del carrito al cargar la página
    displayCartItems();

    // Agregar evento para los botones de eliminar
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-button')) {
            const productId = e.target.getAttribute('data-id');
            removeFromCart(productId);
        }
    });

    // Agregar evento para el botón de realizar compra
    purchaseButton.addEventListener('click', purchaseItems);
});