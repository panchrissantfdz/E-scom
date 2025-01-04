document.getElementById('captureForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const cantidad = document.getElementById('cantidad').value;
    const foto = document.getElementById('foto').files[0];

    const reader = new FileReader();
    reader.onloadend = function() {
        const fotoData = reader.result.split(',')[1]; // Get base64 part

        const newItem = { nombre, descripcion, precio, cantidad, foto: fotoData };

        fetch('http://135.232.96.13:8080/ws/alta_articulos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        }).then(res => res.json()).then(data => {
            console.log(data);
            window.location.href = 'items.html';
        }).catch(error => console.error('Error:', error));
    };
    reader.readAsDataURL(foto);
});