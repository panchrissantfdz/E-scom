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


function addToCart(articleId) {
    const quantityInput = document.getElementById(`quantity-${articleId}`);
    const quantity = parseInt(quantityInput.value, 10);

    if (isNaN(quantity) || quantity <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }

    fetch(API_URL_ADD_TO_CART, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            carrito: {
                id_articulo: articleId,
                cantidad: quantity
            }
        })
    })
        .then(async res => {
            if (!res.ok) {
                throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            alert("Artículo agregado al carrito exitosamente.");
            console.log("Respuesta del servidor:", data);
        })
        .catch(error => {
            console.error("Error al agregar al carrito:", error.message);
            alert("Ocurrió un error al agregar el artículo al carrito.");
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

        const nombre = document.createElement("h2");
        nombre.textContent = item.nombre;
        itemDiv.appendChild(nombre);

        const descripcion = document.createElement("p");
        descripcion.textContent = item.descripcion;
        itemDiv.appendChild(descripcion);

        const precio = document.createElement("p");
        precio.textContent = `Precio: $${item.precio}`;
        itemDiv.appendChild(precio);

        const cantidad = document.createElement("p");
        cantidad.textContent = `Cantidad: ${item.cantidad}`;
        itemDiv.appendChild(cantidad);

        if (item.foto) {
            const foto = document.createElement("img");
            foto.src = `data:image/jpeg;base64,${item.foto}`;
            foto.alt = item.nombre;
            itemDiv.appendChild(foto);
        }

        const cantidadToAdd = document.createElement("input");
        cantidadToAdd.classList.add("cantidad-input");
        cantidadToAdd.setAttribute("placeholder", "Cantidad");
        itemDiv.appendChild(cantidadToAdd);

        const addToCart = document.createElement("button");
        addToCart.classList.add("agregar-carrito-btn");
        addToCart.textContent = "Agregar al Carrito";
        addToCart.addEventListener("click", () => addToCart(item.id));
        itemDiv.appendChild(addToCart);

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
