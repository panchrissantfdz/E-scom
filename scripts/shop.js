document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const purchaseButton = document.getElementById('purchase-button');

    // Función para mostrar los artículos del carrito
    function displayCartItems() {
        fetch('https://t9-2021630245.azurewebsites.net/api/ConsultaCarrito', {
            method: "GET"
        }).then(res => res.json()).then(cartItems => {
            renderCartItems(cartItems);
        }).catch(error => console.error('Error:', error));
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
                console.log("ID enviado a removeFromCart:", articleId);
                removeFromCart(articleId); // Pasar el ID del artículo
            });

            itemDiv.appendChild(removeFromCartButton);
            cartItemsContainer.appendChild(itemDiv);
        });
    }

    // Función para eliminar un producto del carrito
    function removeFromCart(productId) {
        fetch(`https://t9-2021630245.azurewebsites.net/api/EliminarArticulo/${productId}`, {
            method: 'DELETE'
        }).then(res => res.json()).then(data => {
            console.log('Producto eliminado del carrito:', data);
            displayCartItems(); // Actualizar la lista de artículos del carrito
        }).catch(error => console.error('Error:', error));
    }

    // Cargar los artículos del carrito al cargar la página
    displayCartItems();
});