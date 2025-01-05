document.getElementById('captureForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const cantidad = document.getElementById('cantidad').value;
    const foto = document.getElementById('foto').files[0];

   const reader = new FileReader();
    reader.onloadend = function() {
    const fotoData = reader.result.split(',')[1]; // Extraer la parte Base64
    // Asegurarte de que la foto no sea null o undefined
    if (!fotoData) {
        console.error('Error: No se pudo leer la imagen.');
        return;
    }
    const newItem = { nombre, descripcion, precio: Number(precio), cantidad: Number(cantidad), foto: fotoData };

    fetch('https://t9-2021630245.azurewebsites.net/api/AltaArticulo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
        }).then(res => res.json()).then(data => {
            console.log(data);
        }).catch(error => console.error('Error:', error));
    };
    reader.readAsDataURL(foto);
});