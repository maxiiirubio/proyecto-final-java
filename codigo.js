const divProductos = document.getElementById("divProductos")
const divCarrito = document.getElementById("divCarrito")
const btnCarrito = document.getElementById("btnCarrito")
const contador = document.getElementById("contador")
const finalizar = document.getElementById("btnFinalizar")

// Asincronismo
const cargarProductos = async () => {
    const response = await fetch('/productos.json')
    const productos = await response.json()
    return productos
}

// Funcion para mostrar productos en html
cargarProductos().then(productos => {
    productos.forEach((producto, indice) => {
        divProductos.innerHTML+= `
        <div class="card productos" id="producto${indice}" style="width: 25rem;">
            <img src="/imagenes/${producto.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Marca: ${producto.marca}</p>
                <p class="card-text">Precio: $${producto.precio}</p>
                <p class="card-text">Stock: ${producto.stock}</p>
                <p class="card-text">Id: ${producto.id}</p>
                <button class="btn btn-primary">Agregar al carrito</button>
            </div>
        </div>
        `
    })
})



let carrito = []
let compraFinal = []


// localStorage para guardar los productos en el carrito
if(localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
} else{
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
// localStorage para guardar la compra finalizada
if(localStorage.getItem('compra')) {
    compraFinal = JSON.parse(localStorage.getItem('compra'))
} else{
    localStorage.setItem('compra', JSON.stringify(compraFinal))
}

// Funcion para agregar productos al carrito
cargarProductos().then(productos => {
    productos.forEach((producto, indice) => {
        const cardProducto = document.getElementById(`producto${indice}`)
    
        cardProducto.children[1].children[5].addEventListener('click', () => {
            Toastify({
				text: `${producto.nombre} ${producto.marca} agregado al carrito`,
				duration: 3000,
				// destination: "https://github.com/apvarun/toastify-js",
				// newWindow: true,
				close: false,
				gravity: "bottom", // `top` or `bottom`
				position: "right", // `left`, `center` or `right`
				stopOnFocus: true, // Prevents dismissing of toast on hover
				style: {
				  background: "linear-gradient(to right, #350b5c, #000000)",
				  color: "#ffffff"
				},
				onClick: function(){} // Callback after click
			  }).showToast();
            if(carrito.find(prod => prod.id == producto.id)) {
                let index = carrito.findIndex((prod => prod.id == producto.id))
                if(carrito[index].cantidad < producto.stock){
                    carrito[index].cantidad++
                }
            } else {
                const prodCarrito = {id: producto.id, nombre: producto.nombre, marca: producto.marca, precio: producto.precio, cantidad: producto.cantidad, img: producto.img}
                carrito.push(prodCarrito)
            }

            contador.innerText = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
    
            localStorage.setItem('carrito', JSON.stringify(carrito))
    
    })
    })
})

// Mostrar carrito
btnCarrito.addEventListener('click', () => {
    const verProdCarrito = JSON.parse(localStorage.getItem('carrito'))
    
    divCarrito.innerHTML= ""
    verProdCarrito.forEach((producto, indice) => {
        divCarrito.innerHTML += `
        <div class="card" id="producto${indice}" style="width: 18rem;">
            <img src="/imagenes/${producto.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Marca: ${producto.marca}</p>
                <p class="card-text">Precio: $${producto.precio}</p>
                <p class="card-text">Cantidad: ${producto.cantidad}</p>
                <p class="card-text">Id: ${producto.id}</p>
                <button class="btn btn-danger">Eliminar Producto</button>
            </div>
        </div>
        `
    })
    // Borrar producto del carrito
    verProdCarrito.forEach((producto, indice) => {
        const borrarElemnto = document.getElementById(`producto${indice}`)
        
        borrarElemnto.children[1].children[5].addEventListener('click', () => {
            borrarElemnto.remove()
            carrito.splice(indice, 1)
            if(borrarElemnto == true){
                contador.innerText = carrito.reduce((acc, prod) => acc - prod.precio * prod.cantidad, 0) 
            } else {
                contador.innerText = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
            }

            
            localStorage.setItem("carrito", JSON.stringify(carrito))
            
        })
    })
    // Finalizar compra
    verProdCarrito.forEach((producto, indice) => {
        const borrarElemnto = document.getElementById(`producto${indice}`)
        
        finalizar.addEventListener('click', () => {
            Swal.fire({
                icon: 'success',
                title: 'COMPRA FINALIZADA'
            })
            const productoCarrito = {id: producto.id, nombre: producto.nombre, marca: producto.marca, precio: producto.precio, cantidad: producto.cantidad}
            compraFinal.push(productoCarrito)
            localStorage.setItem('compra', JSON.stringify(compraFinal))
            contador.innerText = "" 
            borrarElemnto.remove()
            carrito.splice(indice, 1)
            localStorage.setItem("carrito", JSON.stringify(carrito))
        })
    })
})


