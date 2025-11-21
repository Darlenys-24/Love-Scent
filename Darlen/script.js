let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ------ Guardar y actualizar ------
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarIndicador() {
    const indicador = document.querySelector(".carrito-indicador");
    const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    if (cantidadTotal > 0) {
        indicador.style.display = "flex";
        indicador.textContent = cantidadTotal;
        indicador.classList.add("nuevo");
        setTimeout(() => indicador.classList.remove("nuevo"), 500);
    } else {
        indicador.style.display = "none";
    }
}

// ------ Sumar cantidades ------
function calcularTotal() {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

// ------ Modificar cantidad en tarjetas ------
function modificarCantidadProducto(btn, cambio) {
    const contenedor = btn.parentElement;
    const cantidadSpan = contenedor.querySelector(".cantidad");
    let cantidad = parseInt(cantidadSpan.textContent);

    cantidad += cambio;
    if (cantidad < 1) cantidad = 1;

    cantidadSpan.textContent = cantidad;
}

// ------ Agregar al carrito ------
function agregarCarritoProducto(btn) {
    const producto = btn.parentElement;
    const nombre = producto.dataset.nombre;
    const precio = parseFloat(producto.dataset.precio);
    const cantidad = parseInt(producto.querySelector(".cantidad").textContent);

    const existente = carrito.find(item => item.nombre === nombre);

    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad });
    }

    guardarCarrito();
    actualizarCarrito();
    actualizarIndicador();
}

// ------ Modificar cantidad dentro del carrito ------
function modificarCantidadCarrito(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    guardarCarrito();
    actualizarCarrito();
    actualizarIndicador();
}

// ------ Eliminar producto ------
function eliminarItem(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
    actualizarIndicador();
}

// ------ Mostrar carrito ------
function actualizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalHTML = document.getElementById("total");

    lista.innerHTML = "";

    carrito.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <strong>${item.nombre}</strong><br>
                RD$${item.precio} x ${item.cantidad}
            </div>

            <div class="cant-carrito">
                <button onclick="modificarCantidadCarrito(${index}, -1)">−</button>
                <span>${item.cantidad}</span>
                <button onclick="modificarCantidadCarrito(${index}, 1)">+</button>
                <button class="btn-eliminar" onclick="eliminarItem(${index})">❌</button>
            </div>
        `;

        lista.appendChild(li);
    });

    totalHTML.textContent = calcularTotal();
}

// ------ Abrir / cerrar carrito ------
function toggleCarrito() {
    document.getElementById("carrito-panel").classList.toggle("open");
}

// ------ WhatsApp ------
function enviarPedido() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let mensaje = "¡Hola! Me gustaría hacer un pedido:%0A%0A";

    carrito.forEach(item => {
        mensaje += `• ${item.nombre} (x${item.cantidad}) - RD$${item.precio * item.cantidad}%0A`;
    });

    mensaje += `%0ATotal: RD$${calcularTotal()}`;

    window.open(`https://wa.me/18297031574?text=${mensaje}`, "_blank");
}

// ------ Inicializar ------
actualizarCarrito();
actualizarIndicador();
