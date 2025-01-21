Footwear Shop Application with responsive design

This project is being done using HTML, CSS, and JavaScript. Users can browse products on the product grid page, view detailed information on individual product pages, add items to their cart, and manage their cart.

Features

	•	Add to Cart: Users can add products to the cart from the product grid or product detail pages.
	•	Cart Management: View, remove individual items, or clear all items from the cart.
	•	Persistent Cart: The cart is saved in localStorage, ensuring it persists across page reloads.
	•	Checkout Simulation: Users can proceed to checkout with a simulated alert.

Script.js

This file contains the JavaScript code that manages the cart functionality. Here are the main functions:

	•	addToCart(productItem, isDetail): Adds a product to the cart. If isDetail is true, it gets product details from the product detail page; otherwise, from the product grid page.
	•	removeFromCart(productId): Removes a product from the cart based on its ID.
	•	removeAllFromCart(): Clears the entire cart.
	•	updateCartDisplay(): Updates the display of the cart with the current items and total amount.
	•	handleProceedToCheckout(): Simulates proceeding to checkout.
	•	saveCart(): Saves the cart to localStorage.

The cart data is stored in localStorage so that it persists even when the page is reloaded.
