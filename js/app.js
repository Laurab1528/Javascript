/**************** 
    VARIABLES
****************/
//Formulario de productos
const formProducto = document.getElementById('formularioProducto');

//El contenedor donde irán los productos cargados
const listaProductos = document.getElementById('listaProductos');

/**************** 
    FUNCIONES
****************/
//Valida si está vacío el campo
const esVacio = (value) => value.trim() === "";

//Valida si es positivo el campo
const esPositivo = (value) => parseFloat(value) > 0;

//Genera un id único que nos servirá para eliminar el producto una vez cargado.
const generarid = () => Math.floor(Math.random() * (1000000 - 1)) + 1;

//´Crea una etiqueta p con un mensaje y la retorna para que pueda ser utilizada en otro lado
const mostrarMensaje = (mensaje, tipo) => {
    const p = document.createElement('p');
    p.textContent = mensaje;
    p.classList.add('form-text');
    p.classList.add(tipo);
    return p;
}

//Limpia los mensajes de incorrecto
const limpiarMensaje = (input) => {
    if (input.nextElementSibling != null) {
        input.parentNode.lastElementChild.remove();
    }
}

//Valida el campo numérico. No es necesario separarlo en dos if pero creo que es más fácil de entender
const validarNumero = (input) => {
    let errores = 0;
    if (esVacio(input.value)) {
        errores++;
    }
    if (!esPositivo(input.value)) {
        errores++;
    }
    return errores;
}

//Valida todo campo de texto
const validarNombre = (input) => {
    let errores = 0;
    if (esVacio(input.value)) {
        errores++;
    }
    return errores;
}

//Si el campo es incorrecto, muestra el mensaje
const invalidarCampo = (input) => {
    limpiarMensaje(input);
    input.parentNode.appendChild(mostrarMensaje('Campo incorrecto', 'invalido'));
}

//Se encarga de validar el formulario. Utiliza la variable errores para llevar la cuenta
const validarFormulario = (e) => {
    e.preventDefault();
    let errores = 0;
    limpiarMensaje(formProducto.codigo);
    limpiarMensaje(formProducto.precio);
    limpiarMensaje(formProducto.nombre);
    if (validarNumero(formProducto.codigo) > 0) {
        invalidarCampo(formProducto.codigo);
        errores++;
    }
    if (validarNumero(formProducto.precio) > 0) {
        invalidarCampo(formProducto.precio);
        errores++;
    }
    if (validarNombre(formProducto.nombre) > 0) {
        invalidarCampo(formProducto.nombre);
        errores++;
    }
    return errores;
}

//Trae los datos de localStorage, si no había nada inicializa como un array vacío. Retorna un array en ambos casos
const traerLocalStorage = (key) => {
    const productosGuardados = JSON.parse(localStorage.getItem(key));
    let productos = [];
    if (productosGuardados !== null) {
        productos = productosGuardados
    }
    return productos;
}

    

        
   
    

//Muestra los productos en pantalla. Además se encarga de hacer la cuenta del total (esto debería ser otra función aparte)
const mostrarProductos = (productos) => {
    listaProductos.innerHTML = '';
    let total = 0;
    const fragment = document.createDocumentFragment();
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('card', 'col-12', 'col-md-6', 'col-lg-4', 'offset-md-3', 'offset-lg-4', 'my-3');
        const body = document.createElement('body');
        body.classList.add('card-body');
        body.innerHTML = `
            <p class="item"><span>Código: </span> ${producto.codigo}</p>
            <p class="item"><span>Nombre: </span> ${producto.nombre}</p>
            <p class="item"><span>Precio: </span> $${producto.precio}</p>
            <button id="${producto.id}" class="btn btn-danger remove">Eliminar</button>
        `
        div.appendChild(body);
        fragment.appendChild(div);
        total += parseFloat(producto.precio);

    });
    listaProductos.appendChild(fragment);
    document.querySelector('#total span').textContent = total;
}




//Agrega un producto a un array pasado por parámetro
const agregarProducto = (productos) => {
    productos.push({ id: generarid(), codigo: formProducto.codigo.value, nombre: formProducto.nombre.value, precio: formProducto.precio.value });
}

//Guarda el array en localStorage
const guardarLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

//Muestra la ventanita que dice que se agregó el producto correctamente
const mostrarToast = () => {
    const mensaje = document.getElementById('mensaje');
    mensaje.classList.add('show');
    setTimeout(() => mensaje.classList.remove('show'), 3000);
    console.log(mensaje);
}

//Borra el producto que tenga el id pasado por parámetro
const borrarProducto = (id) => {
    let productos = traerLocalStorage('productos');
    productos = productos.filter(producto => producto.id != id);
    guardarLocalStorage('productos', productos);
    mostrarProductos(productos);
}

//Evento que sirve para validar el formulario y agregar el producto en caso que se haya validado correctamente la información
formProducto.addEventListener("submit", (e) => {
    if (!validarFormulario(e)) {
        mostrarToast();
        const productos = traerLocalStorage('productos');
        agregarProducto(productos);
        console.log(productos);
        mostrarProductos(productos);

        guardarLocalStorage('productos', productos);
    }
})

//Evento que escucha los botones de eliminar para remover un producto
listaProductos.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
        borrarProducto(e.target.id);
    }
});

//Al iniciar la página pedimos que se muestren los productos del localStorage
mostrarProductos(traerLocalStorage('productos'));





