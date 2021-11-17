$("#textoVenta").append("<h2>ENCONTRA LAS MEJORES BEBIDAS A LOS MEJORES PRECIOS!!!</h2>").css({ color: "black", type: "bold", position: "center" });

$("#mostrarFoto").click(function() {
    $("#foto").fadeIn(2000);
})

let carrito = [];
let dolarVenta;

let campoNombre = document.getElementById("nombre");
let campoEdad = document.getElementById("edad");

let formulario = document.getElementById("formulario");
formulario.addEventListener("submit", validarFormulario);
//Validación de datos del formulario
function validarFormulario(evento) {
    if ((campoNombre.value == "") || (isNaN(campoEdad.value))) {
        evento.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ingresa los datos correctamente!',
            footer: '<a href="">Quieres volver a intentar?</a>'
        })
    } else {
        //let nom = campoNombre.value;
        Swal.fire(
            'BIENVENIDO!',
            campoNombre.value,
            'success'
        )
    }
}

//Validador de edad
function validarEdad(entrada) {
    let edadInput = entrada.value;
    if (edadInput < 18) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Eres menor de edad, no puedes comprar!!!!',
            footer: '<a href="">Quieres volver a intentar?</a>'
        })
    }
}



$(document).ready(function() {
    obtenerValorDolar();
    $("#cotizacion").css({ background: 'green', color: 'white' });
    renderizarProductos();
})

function renderizarProductos() {
    for (const producto of productos) {
        $(".milista").append(`<li class="col-sm-3 list-group-item"><h3 style="display:none">ID:${producto.id}</h3>
        <img src=${producto.foto} widh="250" height="300">
        <p>Producto: ${producto.nombre}</p>
        <b> $ ${producto.precio}</b>
        <button class='btn btn-primary' id='btn${producto.id}'>Comprar</button>
        </li>`);
        $(`#btn${producto.id}`).on('click', function() {
            agregarAlCarrito(producto);
        });
    }
}

class productoCarrito {
    constructor(obj) {
        this.id = obj.id;
        this.foto = obj.foto;
        this.nombre = obj.nombre;
        this.precio = obj.precio;
        this.cantidad = 1;
    }
}

function agregarAlCarrito(productoNuevo) {
    let encontrado = carrito.find(prod => prod.id == productoNuevo.id);
    if (encontrado == undefined) {
        let productoAAgregar = new productoCarrito(productoNuevo);
        carrito.push(productoAAgregar);
        console.log(carrito);
        Swal.fire(
            'Nuevo producto agregado al carro',
            productoNuevo.nombre,
            'success'
        );
        $("#tablabody").append(`
        <tr>
            <td>${productoAAgregar.id}</td>
            <td>${productoAAgregar.nombre}</td>
            <td id='${productoAAgregar.id}'>${productoAAgregar.cantidad}</td>
            <td>${productoAAgregar.precio}</td>
        </tr>`);
    } else {
        let posicion = carrito.findIndex(p => p.id == productoNuevo.id);
        //console.log(posicion);
        carrito[posicion].cantidad += 1;
        $(`#${productoNuevo.id}`).html(carrito[posicion].cantidad);
        console.log(carrito);
    }
    localStorage.setItem("miCarrito", JSON.stringify(carrito));

}

//OBTENER DOLAR ACTUALIZADO
const obtenerValorDolar = () => {
    const APIURL = "https://api-dolar-argentina.herokuapp.com/api/dolarblue";
    $.ajax({
        method: "GET",
        url: APIURL,
        success: function(data) {
            $("#cotizacion").append(`<p align="center">Dolar compra:$ <b>${data.compra}</b> Dolar venta:$ <b>${data.venta}</b><p>`);
            console.log(data);
            dolarVenta = data.venta;
            renderizarProductos();
        }
    });
}