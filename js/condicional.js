



const traerLocalStorage = (key) => {
    const productosGuardados = JSON.parse(localStorage.getItem(key));
    let productos = [];
    if (productosGuardados !== null) {
        productos = productosGuardados
    }
    return productos;
    
}


var Producto1;
let total = 0;

Producto1=traerLocalStorage('productos');

//resumen del pago
for (var cadena of Producto1) {

    $("#app").append(`<div><h2> Producto: ${cadena.nombre}</h3>
    <p>  codigo: ${cadena.codigo}</p>
    <b> $ ${cadena.precio}COP</b>`);

    total += parseFloat(cadena.precio);
    
    
}

$('#app').append(`<div> <h1>Total: ${total}</h1></div>`);