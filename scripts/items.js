function loadItems() {
    fetch('http://135.232.96.13:8080/Servicio/rest/ws/consulta_carrito', {
        method: "GET"
    }).then(res => res.json()).then(items1 => {
        const container = document.getElementById('items-container');
        items1.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const nombre = document.createElement('h2');
            nombre.textContent = item.nombre;
            itemDiv.appendChild(nombre);

            const descripcion = document.createElement('p');
            descripcion.textContent = item.descripcion;
            itemDiv.appendChild(descripcion);

            const precio = document.createElement('p');
            precio.textContent = `Precio: $${item.precio}`;
            itemDiv.appendChild(precio);

            const cantidad = document.createElement('p');
            cantidad.textContent = `Cantidad: ${item.cantidad}`;
            itemDiv.appendChild(cantidad);

            if (item.foto) {
                const foto = document.createElement('img');
                foto.src = `data:image/jpeg;base64,${item.foto}`;
                foto.alt = item.nombre;
                itemDiv.appendChild(foto);
            }

            container.appendChild(itemDiv);
        });
    }).catch(error => console.error('Error:', error));
}

window.onload = loadItems;