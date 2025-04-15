
//Array to hold cart items
let cart = [];

//When the DOM content is loaded, set up event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Select all elements , class 'AddCartButton'
    const addToCartButtons = document.querySelectorAll('.AddCartButton');
    //class 'quantity-btn'
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    //class 'filter-checkbox'
    const checkboxes = document.querySelectorAll('.filter-checkbox');

    // Add event listener to each buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    quantityButtons.forEach(button => {
        button.addEventListener('click', updateQuantity);
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilter);
    });
});

// Function to add product to cart
function addToCart(event) {
    // Find the closest ancestor element with class 'product'
    const productDiv = event.target.closest('.product');
    // Get product name and price, quantity from data attributes
    const productName = productDiv.dataset.product;
    const price = parseFloat(productDiv.dataset.price);
    const quantity = parseInt(productDiv.querySelector('.quantity').textContent);

    // If the product already exists, update its quantity
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name: productName, price: price, quantity: quantity });
    }

    updateCart();
    showAlert();
}
// Function to show alert
function showAlert() {
    var message = "Your item added to Cart \n Click on the 'View Cart' icon ";
    alert(message);
}

// Function to update quantity
function updateQuantity(event) {
    // Get action (increase or decrease) from data attribute
    const action = event.target.dataset.action;
    // Find the closest ancestor element with class 'product'
    const productDiv = event.target.closest('.product');
    // Get quantity element
    const quantityElement = productDiv.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);

    // Update quantity based on action
    if (action === 'increase') {
        quantity++;
    } else if (action === 'decrease' && quantity > 1) {
        quantity--;
    }

    // Update quantity display
    quantityElement.textContent = quantity;
}

// Function to filter
function handleFilter() {
    // Get all checked checkboxes
    const checkedCheckboxes = document.querySelectorAll('.filter-checkbox:checked');
    // Get values of checked checkboxes
    const selectedCategories = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

    // Get all product elements
    const products = document.querySelectorAll('.product');
     // Loop through each product
    products.forEach(product => {
        // Get category of product
        const category = product.dataset.category;
        // If no categories selected
        if (selectedCategories.length === 0 || selectedCategories.includes(category)) {
            product.style.display = 'block';
        } else {// Otherwise, hide product
            product.style.display = 'none';
        }
    });
}

// Function to update cart display
function updateCart() {
    // Get cart element
    const cartElement = document.getElementById('cart');
    let cartContent = '';

    let total = 0;

    // Loop through each item in cart
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

         // Add item to cart content
        cartContent += `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.quantity}</span>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
            `;
    });
    // If cart is empty disable checkout button
    if (cart.length === 0) {
        cartContent = '<p>No items in cart</p>';
        document.getElementById('redirectButton').disabled = true; 
    } else {
        document.getElementById('redirectButton').disabled = false; 
    }

    // Update cart content and total price display
    cartElement.innerHTML = cartContent;
    document.getElementById('total').innerText = total.toFixed(2);

    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Event listener for checkout button
document.getElementById('redirectButton').addEventListener('click', function () {
    if (cart.length === 0) {// If cart is empty, show alert
        alert('Your cart is empty. Please add items before checking out.');
    } else {
        const totalPrice = document.getElementById('total').innerText;
        window.location.href = `CheckoutForm.html?total=${totalPrice}`; // Redirect to checkout page with total price as query parameter

    }
});

// Function to remove item from cart
function removeFromCart(event) {
    // Get index of item to remove from data attribute
    const indexToRemove = parseInt(event.target.dataset.index);
    // Remove item from cart array
    cart.splice(indexToRemove, 1);
    // Update cart display
    updateCart();
}

