let cart = [];

function addToCart(productName, price) {
    const product = { name: productName, price: price, quantity: 1 };
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
        cartItems.appendChild(li);
    });
}

function toggleForm() {
    const form = document.getElementById('order-form');
    form.classList.toggle('hidden');
}

function placeOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const phone = document.getElementById('phone').value;
    const payment = document.getElementById('payment').value;
    const notes = document.getElementById('notes').value;
    
    if (!name || !address || !neighborhood || !phone || !payment) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const orderDetails = {
        name: name,
        address: address,
        neighborhood: neighborhood,
        phone: phone,
        payment: payment,
        notes: notes,
        cart: cart
    };

    sendOrderToGoogleSheets(orderDetails);
}

function sendOrderToGoogleSheets(order) {
    const formattedOrder = `
    Nombre: ${order.name}\n
    Dirección: ${order.address}\n
    Barrio: ${order.neighborhood}\n
    Teléfono: ${order.phone}\n
    Pago: ${order.payment}\n
    Observaciones: ${order.notes}\n
    \n
    Detalles del Pedido:\n
    ${order.cart.map(item => `${item.name} - $${item.price} x ${item.quantity}`).join('\n')}
    `;

    fetch('https://script.google.com/macros/s/AKfycbyq7dWVv4MKY7pCh6LxaATr07CGRMdIYu9kECdYxMQh34KES4ogUHGht942BnDq06sB/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'message': formattedOrder
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log('Datos enviados a Google Sheets:', data);

        const phoneNumber = '+573136751943';
        const whatsappMessage = `
        *Pedido Recibido (RICURAS DEL PANDEBONO*\n\n
        Nombre: ${order.name}\n
        Dirección: ${order.address}\n
        Barrio: ${order.neighborhood}\n
        Teléfono: ${order.phone}\n
        Pago: ${order.payment}\n
        Observaciones: ${order.notes}\n
        \n
        *Detalles del Pedido:*\n
        ${order.cart.map(item => `${item.name} - $${item.price} x ${item.quantity}`).join('\n')}
        `;
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.location.href = whatsappUrl;

        alert('Pedido realizado exitosamente.');
    })
    .catch(error => console.error('Error al enviar datos:', error));
}

