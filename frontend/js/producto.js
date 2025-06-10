// URL base del endpoint
const API_URL = "http://localhost/CRUD-main/CRUD/backend/api_productos.php"; // Cambia esta URL según corresponda

// Obtener todos los productos (GET)
function listarProductos() {
    document.getElementById('formAgregarProducto').classList.remove('hide-form'); // Esto muestra el form
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            console.log("Productos:", data);
            mostrarTablaProductos(data);
        })
        .catch(err => console.error("Error al obtener productos:", err));
}

// Función para mostrar la tabla de productos en el div 'productosContainer'
function mostrarTablaProductos(productos) {
    const container = document.getElementById('productosContainer');
    if (!Array.isArray(productos) || productos.length === 0) {
        container.innerHTML = '<p>No hay productos para mostrar.</p>';
        return;
    }

    let html = '<table border="1" cellpadding="5"><thead><tr>';
    html += '<th>ID</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Acciones</th></tr></thead><tbody>';

    productos.forEach(producto => {
        html += `<tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.precio}</td>
            <td>
                <button onclick="mostrarFormularioModificar(${producto.id})">Modificar</button>
                <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function mostrarFormularioModificar(id) {
    document.getElementById('formAgregarProducto').classList.add('hide-form');
    const container = document.getElementById('productosContainer');
    fetch(`${API_URL}/id/${id}`)
        .then(res => res.json())
        .then(producto => {
            if (Array.isArray(producto)) producto = producto[0] || {};
            console.log(producto); // <-- Mira en la consola qué llega realmente
            container.innerHTML = `
                <h2>Modificar Producto</h2>
                <form id="formModificarProducto">
                    <label>Nombre: <input type="text" id="modificarNombre" value="${producto.nombre || ''}"></label><br>
                    <label>Descripción: <input type="text" id="modificarDescripcion" value="${producto.descripcion || ''}"></label><br>
                    <label>Precio: <input type="number" id="modificarPrecio" value="${producto.precio || ''}"></label><br>
                    <button type="button" onclick="modificarProducto(${id}, document.getElementById('modificarNombre').value, document.getElementById('modificarDescripcion').value, document.getElementById('modificarPrecio').value)">Guardar</button>
                    <button type="button" onclick="listarProductos()">Cancelar</button>
                </form>
            `;
        })
        .catch(err => console.error("Error al obtener producto:", err));
}

function agregarProductoDesdeFormulario() {
    let nombre = document.getElementById('nombreProducto').value;
    let descripcion = document.getElementById('descripcionProducto').value;
    let precio = parseFloat(document.getElementById('precioProducto').value);
    agregarProducto(nombre, descripcion, precio);
}

// Agregar un producto nuevo (POST)
function agregarProducto(nombre, descripcion, precio) {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, precio })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Producto agregado:", data);
            listarProductos();
        })
        .catch(err => console.error("Error al agregar producto:", err));
}

// Modificar un producto (PUT)
function modificarProducto(id, nombre, descripcion, precio) {
    fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, nombre: nombre, descripcion: descripcion, precio: precio })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Producto modificado:", data);
            listarProductos();
        })
        .catch(err => console.error("Error al modificar producto:", err));
}

// Eliminar un producto (DELETE)
function eliminarProducto(id) {
    fetch(`${API_URL}?id=${id}`, { // Usa ?id= en vez de $id=
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        console.log("Producto eliminado:", data);
        listarProductos();
    })
    .catch(err => console.error("Error al eliminar producto:", err));
}

// Carga inicial de productos
listarProductos();

// Muestra el formulario de agregar
document.getElementById('formAgregarProducto').classList.remove('hide-form');