document.addEventListener('DOMContentLoaded', () => {
    // Retrieve cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Query DOM elements for cart display
    const cartList = document.getElementById('cart');
    const totalAmountElement = document.getElementById('total-amount');
    const checkoutButton = document.getElementById('checkout-button');
    const removeAllButton = document.getElementById('remove-all-button');
  
    // Query DOM elements related to adding products
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const productDetail = document.querySelector('.product-detail');
    const productGrid = document.getElementById('product-grid');
  
    // =============== EVENT HANDLERS FOR ADD TO CART ===============
  
    // If on a product detail page, attach add-to-cart listener
    if (productDetail) {
      addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
          const productItem = button.closest('.product-detail');
          addToCart(productItem, true); // 'true' indicates a detailed product page
        });
      });
    }
  
    // If on a product grid page, attach a generic click listener
    if (productGrid) {
      productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
          const productItem = event.target.closest('.product-item');
          addToCart(productItem, false);
        }
      });
    }
  
    /**
     * addToCart:
     *   1. Gathers product info
     *   2. Validates size selection (if on product detail page)
     *   3. Adds or increments item in the cart
     *   4. Updates cart display and saves to localStorage
     */
    function addToCart(productItem, isDetail) {
      let productId, productName, productPrice, selectedSize = null;
  
      if (isDetail) {
        productId = productItem.getAttribute('data-id');
        productName = productItem.querySelector('h2').innerText;
        productPrice = parseFloat(
          productItem.querySelector('p:nth-child(3)').innerText.replace('Price: $', '')
        );
        
        // Validate that user has selected a size
        const sizeOptions = productItem.querySelectorAll('input[name="size"]');
        sizeOptions.forEach(option => {
          if (option.checked) {
            selectedSize = option.value;
          }
        });
        
        if (!selectedSize) {
          alert('Please select a size before adding to cart.');
          return;
        }
      } else {
        // For the product grid, you might handle size differently
        productId = productItem.getAttribute('data-id');
        productName = productItem.getAttribute('data-name');
        productPrice = parseFloat(productItem.getAttribute('data-price'));
        // If the grid also includes size selection, capture it similarly
        // selectedSize = ...
      }
  
      // Create cart item
      const cartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
        size: selectedSize || 'Not Specified'
      };
  
      // Check if item exists in cart; if yes, increment quantity
      const existingItemIndex = cart.findIndex(item => 
        item.id === productId && item.size === selectedSize
      );
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push(cartItem);
      }
  
      updateCartDisplay();
      saveCart();
    }
  
    /**
     * removeFromCart:
     *   Removes a single item from cart by matching productId 
     *   (and possibly size if multiple variations exist).
     */
    function removeFromCart(productId, size) {
      const itemIndex = cart.findIndex(item => item.id === productId && item.size === size);
      if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        updateCartDisplay();
        saveCart();
      }
    }
  
    /**
     * removeAllFromCart:
     *   Empties the entire cart.
     */
    function removeAllFromCart() {
      cart.length = 0;
      updateCartDisplay();
      saveCart();
    }
  
    /**
     * updateCartDisplay:
     *   1. Clears the current cart display
     *   2. Rebuilds it from 'cart' array
     *   3. Updates total price
     */
    function updateCartDisplay() {
      cartList.innerHTML = '';
      let totalAmount = 0;
      
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} (Size: ${item.size}) - $${item.price.toFixed(2)} x ${item.quantity}  `;
  
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => removeFromCart(item.id, item.size));
        
        li.appendChild(removeButton);
        cartList.appendChild(li);
  
        totalAmount += (item.price * item.quantity);
      });
  
      totalAmountElement.textContent = totalAmount.toFixed(2);
    }
  
    /**
     * handleProceedToCheckout:
     *   Replaces the default flow with a WhatsApp Business link.
     *   1. Builds a message from the cart items
     *   2. Opens WhatsApp chat with the prepopulated text
     */
    function handleProceedToCheckout() {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
  
      // Build the cart summary string
      let message = 'Hello! I would like to place an order:\n\n';
      let totalAmount = 0;
  
      cart.forEach(item => {
        const lineTotal = item.price * item.quantity;
        message += `- ${item.name} (Size: ${item.size}) x ${item.quantity} @ $${item.price.toFixed(2)} = $${lineTotal.toFixed(2)}\n`;
        totalAmount += lineTotal;
      });
  
      message += `\nTotal: $${totalAmount.toFixed(2)}\n`;
      message += 'Additional notes: \n'; // You can add more order notes here
  
      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message);
  
      // Replace with your WhatsApp Business phone number (no dashes/spaces)
      const phoneNumber = '1234567890';
  
      // Construct the WhatsApp link
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
      // Open the link in a new tab/window
      window.open(whatsappLink, '_blank');
    }
  
    /**
     * saveCart:
     *   Persists the cart array to localStorage
     */
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    // Attach event handlers for checkout and removing all items
    checkoutButton.addEventListener('click', handleProceedToCheckout);
    removeAllButton.addEventListener('click', removeAllFromCart);
  
    // Initialize cart display on page load
    updateCartDisplay();
  
    // =============== SIMPLE CAROUSEL LOGIC ===============
    initProductCarousel();
    
    /**
     * initProductCarousel:
     *   Simple horizontal slider for product images
     *   with next/prev controls and optional indicators.
     */
    function initProductCarousel() {
      const carouselTrack = document.querySelector('.carousel-track');
      if (!carouselTrack) return;
  
      const slides = Array.from(carouselTrack.querySelectorAll('.carousel-image'));
      const prevButton = document.querySelector('.prev-button');
      const nextButton = document.querySelector('.next-button');
      const indicators = Array.from(document.querySelectorAll('.indicator'));
  
      let currentIndex = 0;
  
      // Helper to update active slide
      function updateCarousel(index) {
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === index);
        });
        indicators.forEach((ind, i) => {
          ind.classList.toggle('active', i === index);
        });
      }
  
      // Go to next slide
      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel(currentIndex);
      });
  
      // Go to previous slide
      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(currentIndex);
      });
  
      // Indicator clicks
      indicators.forEach(ind => {
        ind.addEventListener('click', () => {
          currentIndex = parseInt(ind.getAttribute('data-slide'));
          updateCarousel(currentIndex);
        });
      });
    }
  });
  