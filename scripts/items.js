const API_URL_ALL = "https://t9-2021630245.azurewebsites.net/api/TodosArticulos";
const API_URL_SEARCH = "https://t9-2021630245.azurewebsites.net/api/ConsultaArticulo?";
const API_URL_ADD_TO_CART = "https://t9-2021630245.azurewebsites.net/api/AgregaCarrito";

// Función para cargar todos los artículos (GET)
function loadAllItems() {
    fetch(API_URL_ALL, {
        method: "GET",
    })
        .then(res => res.json())
        .then(items => renderItems(items))
        .catch(error => {
            console.error("Error al cargar todos los artículos:", error);
            alert("Ocurrió un error al cargar los artículos.");
        });
}

// Función para buscar artículos específicos (POST)
function loadFilteredItems(searchQuery) {
    fetch(API_URL_SEARCH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busqueda: searchQuery }),
    })
        .then(res => res.json())
        .then(items => renderItems(items))
        .catch(error => {
            console.error("Error al buscar los artículos:", error);
            alert("Ocurrió un error al buscar los artículos.");
        });
}

// Función para agregar un artículo al carrito
function addToCart(articleId) {
    if (!articleId) {
        alert("El ID del artículo es requerido.");
        console.error("ID del artículo no válido:", articleId);
        return;
    }

    // Obtener el input de cantidad usando el ID del artículo
    const quantityInput = document.getElementById(`quantity-${articleId}`);
    const quantity = parseInt(quantityInput?.value, 10);

    // Validar que se haya ingresado una cantidad válida
    if (!quantityInput || isNaN(quantity) || quantity <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }

    // Construir el cuerpo de la solicitud
    const requestBody = {
        "carrito": {
            "id_articulo": parseInt(articleId, 10), // Convertir a número
            "cantidad": quantity
        }
    };

    // Enviar la solicitud al servidor
    fetch(API_URL_ADD_TO_CART, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    })
    .then(res => {
        if(typeof res === "object") {
            resObject = res.json();
        } else {
            resObject = res.text();
        }

        if (!res.ok) {
            throw new Error(`Error del servidor: ${res.status} ${res.statusText}. Detalles: ${resObject.message}`);
        }

        return resObject;
    })
    .then(data => {
        alert("Artículo agregado al carrito exitosamente.");
        console.log("Respuesta del servidor:", data);
    })
    .catch(error => {
        console.error("Error al agregar al carrito:", error.message);
        alert(`Error al agregar el artículo al carrito: ${error.message}`);
    });
}



// Función para renderizar artículos en el contenedor
function renderItems(items) {
    const container = document.getElementById("items-container");
    container.innerHTML = ""; // Limpiar resultados previos

    if (!items.length) {
        container.innerHTML = "<p>No se encontraron artículos.</p>";
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
        cantidad.textContent = `Cantidad disponible: ${item.cantidad || 0}`;
        itemDiv.appendChild(cantidad);

        if (item.foto) {
            const foto = document.createElement("img");
            foto.src = `data:image/jpeg;base64,${item.foto}`;
            foto.alt = item.nombre || "Artículo";
            itemDiv.appendChild(foto);
        }

        // Input para cantidad
        const cantidadToAdd = document.createElement("input");
        cantidadToAdd.classList.add("cantidad-input");
        cantidadToAdd.setAttribute("placeholder", "Cantidad");
        cantidadToAdd.setAttribute("type", "number");
        cantidadToAdd.setAttribute("id", `quantity-${item["id_articulo"]}`);
        itemDiv.appendChild(cantidadToAdd);

        // Botón para agregar al carrito con data-id
        const addToCartButton = document.createElement("button");
        addToCartButton.classList.add("agregar-carrito-btn");
        addToCartButton.textContent = "Agregar al Carrito";

        // Asociar ID del artículo en un atributo data-id
        addToCartButton.setAttribute("data-id", item["id_articulo"]);
        addToCartButton.addEventListener("click", (event) => {
            const articleId = event.target.getAttribute("data-id");
            console.log("ID enviado a addToCart:", articleId);
            addToCart(articleId); // Pasar el ID del artículo
        });

        itemDiv.appendChild(addToCartButton);
        container.appendChild(itemDiv);
    });
}


// Función para manejar la búsqueda
function handleSearch() {
    const searchInput = document.querySelector(".container input").value.trim();
    if (searchInput) {
        loadFilteredItems(searchInput); // Buscar productos filtrados
    } else {
        loadAllItems(); // Cargar todos los productos si no hay búsqueda
    }
}

// Inicializar los eventos
window.onload = () => {
    loadAllItems(); // Cargar todos los artículos al inicio

    // Agregar evento al botón de búsqueda
    document.querySelector(".container button").addEventListener("click", handleSearch);

    // Permitir búsqueda al presionar "Enter"
    document.querySelector(".container input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    });
};
