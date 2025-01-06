document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const purchaseButton = document.getElementById('purchase-button');
    const clearButton = document.getElementById('clear-button');

    // Función para mostrar los artículos del carrito
    function displayCartItems() {
        fetch('https://t9-2021630245.azurewebsites.net/api/ConsultaCarrito', {
            method: "GET"
        }).then(res => res.json()).then(cartItems => {
            renderCartItems(cartItems);
        }).catch(error => {
            console.error("Error al obtener los artículos del carrito:", error.message);
            alert(`Error al cargar los artículos del carrito: ${error.message}`);
        });
    }

    // Función para renderizar artículos en el contenedor del carrito
    function renderCartItems(items) {
        cartItemsContainer.innerHTML = ""; // Limpiar resultados previos

        if (!items.length) {
            cartItemsContainer.innerHTML = "<p>No se encontraron artículos en el carrito.</p>";
            return;
        }

        items.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");

            // Agregar nombre y detalles del artículo
            const nombre = document.createElement("h2");
            nombre.textContent = item.nombre || "Artículo sin nombre";
            itemDiv.appendChild(nombre);

            const descripcion = document.createElement("p");
            descripcion.textContent = item.descripcion || "Sin descripción";
            itemDiv.appendChild(descripcion);

            const precio = document.createElement("p");
            precio.textContent = `Precio: $${item.precio || "No disponible"}`;
            itemDiv.appendChild(precio);

            const cantidad = document.createElement("p");
            cantidad.textContent = `Cantidad: ${item.cantidad || 0}`;
            itemDiv.appendChild(cantidad);

            if (item.foto) {
                const foto = document.createElement("img");
                foto.src = `data:image/jpeg;base64,${item.foto}`;
                foto.alt = item.nombre || "Artículo";
                itemDiv.appendChild(foto);
            }

            // Botón para eliminar del carrito
            const removeFromCartButton = document.createElement("button");
            removeFromCartButton.classList.add("remove-cart-btn");
            removeFromCartButton.textContent = "Eliminar";

            // Asociar ID del artículo en un atributo data-id
            removeFromCartButton.setAttribute("data-id", item["id_articulo"]);
            removeFromCartButton.addEventListener("click", (event) => {
                const articleId = event.target.getAttribute("data-id");
                removeFromCart(articleId); // Pasar el ID del artículo
            });

            itemDiv.appendChild(removeFromCartButton);
            cartItemsContainer.appendChild(itemDiv);
        });
    }

    // Función para eliminar un producto del carrito
    function removeFromCart(productId) {
        fetch('https://t9-2021630245.azurewebsites.net/api/EliminaCarrito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_articulo: productId })
        }).then(res => res.json()).then(data => {
            console.log('Producto eliminado del carrito:', data);
            alert('Artículo eliminado exitosamente del carrito.');
            displayCartItems(); // Actualizar la lista de artículos del carrito
        }).catch(error => {
            console.error("Error al eliminar el artículo del carrito:", error.message);
            alert(`Error al eliminar el artículo del carrito: ${error.message}`);
        });
    }

    // Función para realizar la compra
    function purchaseCart() {
        fetch('https://t9-2021630245.azurewebsites.net/api/ConsultaCarrito', {
            method: "GET"
        }).then(res => res.json()).then(cartItems => {
            const promises = cartItems.map(item =>
                fetch('https://t9-2021630245.azurewebsites.net/api/EliminaCarrito', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_articulo: item.id_articulo })
                })
            );

            Promise.all(promises)
                .then(() => {
                    console.log("Compra exitosa");
                    alert('Compra realizada exitosamente.');
                    displayCartItems(); // Actualizar la lista de artículos del carrito
                })
                .catch(error => {
                    console.error("Error durante la compra:", error.message);
                    alert(`Error al realizar la compra: ${error.message}`);
                });
        }).catch(error => {
            console.error('Error al obtener los artículos del carrito:', error.message);
            alert(`Error al cargar los artículos para la compra: ${error.message}`);
        });
    }

    // Función para limpiar el carrito
    function clearCart() {
        fetch('https://t9-2021630245.azurewebsites.net/api/ConsultaCarrito', {
            method: "GET"
        }).then(res => res.json()).then(cartItems => {
            const promises = cartItems.map(item =>
                fetch('https://t9-2021630245.azurewebsites.net/api/EliminaCarrito', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_articulo: item.id_articulo })
                })
            );

            Promise.all(promises)
                .then(() => {
                    console.log("Artículos eliminados del carrito exitosamente");
                    alert('Carrito limpiado exitosamente.');
                    displayCartItems(); // Actualizar la lista de artículos del carrito
                })
                .catch(error => {
                    console.error("Error al limpiar el carrito:", error.message);
                    alert(`Error al limpiar el carrito: ${error.message}`);
                });
        }).catch(error => {
            console.error('Error al obtener los artículos del carrito:', error.message);
            alert(`Error al cargar los artículos para limpiar el carrito: ${error.message}`);
        });
    }

    // Asignar eventos a los botones
    purchaseButton.addEventListener("click", purchaseCart);
    clearButton.addEventListener("click", clearCart);

    // Cargar los artículos del carrito al cargar la página
    displayCartItems();
});
