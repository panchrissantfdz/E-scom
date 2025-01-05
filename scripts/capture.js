document.getElementById('captureForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);
    const fotoFile = document.getElementById('foto').files[0];

    if (!nombre || !descripcion || isNaN(precio) || isNaN(cantidad) || !fotoFile) {
        alert("Por favor, llena todos los campos correctamente.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const fotoBase64 = reader.result.split(',')[1]; // Extraer Base64

        const articulo = { nombre, descripcion, precio, cantidad, foto: fotoBase64 };
        const requestBody = { articulo };

        fetch('https://t9-2021630245.azurewebsites.net/api/AltaArticulo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    alert(`Error: ${errorData.message}`);
                    return;
                }
                alert('Artículo añadido correctamente.');
            })
            .catch((error) => {
                console.error('Error al comunicarse con el servidor:', error);
                alert('Ocurrió un error al procesar tu solicitud.');
            });
    };

    reader.readAsDataURL(fotoFile);
});
