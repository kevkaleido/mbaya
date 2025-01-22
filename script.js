document.addEventListener('DOMContentLoaded', () => {
    // Retrieve or create empty cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // DOM references
    const cartList = document.getElementById('cart');
    const totalAmountElement = document.getElementById('total-amount');
    const checkoutButton = document.getElementById('checkout-button');
    const removeAllButton = document.getElementById('remove-all-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const productDetail = document.querySelector('.product-detail');
    const productGrid = document.getElementById('product-grid');
  
    // If on a product detail page, attach direct listener
    if (productDetail) {
      addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
          addToCart(productDetail, true); 
        });
      });
    }
  
    // If on products listing page, attach a generic click listener to the grid
    if (productGrid) {
      productGrid.addEventListener('click', event => {
        if (event.target.classList.contains('add-to-cart')) {
          const productItem = event.target.closest('.product-item');
          addToCart(productItem, false);
        }
      });
    }
  
    function addToCart(itemElement, isDetail) {
      let productId = itemElement.getAttribute('data-id');
      let productName = itemElement.getAttribute('data-name');
      let productPrice = parseFloat(itemElement.getAttribute('data-price'));
  
      // Size selection only relevant on detail page
      let selectedSize = 'Not Specified';
      if (isDetail) {
        const sizeOptions = itemElement.querySelectorAll('input[name="size"]');
        sizeOptions.forEach(option => {
          if (option.checked) {
            selectedSize = option.value;
          }
        });
        if (sizeOptions.length > 0 && selectedSize === 'Not Specified') {
          alert('Please select a size before adding to cart.');
          return;
        }
      }
  
      // Create or update cart item
      const existingIndex = cart.findIndex(ci => ci.id === productId && ci.size === selectedSize);
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          quantity: 1,
          size: selectedSize
        });
      }
  
      updateCartDisplay();
      saveCart();
    }
  
    function removeFromCart(productId, size) {
      const index = cart.findIndex(ci => ci.id === productId && ci.size === size);
      if (index !== -1) {
        cart.splice(index, 1);
        updateCartDisplay();
        saveCart();
      }
    }
  
    function removeAllFromCart() {
      cart.length = 0;
      updateCartDisplay();
      saveCart();
    }
  
    function updateCartDisplay() {
      if (!cartList) return; 
      cartList.innerHTML = '';
      let total = 0;
  
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} (Size: ${item.size}) - ₦${item.price.toFixed(2)} x ${item.quantity} `;
  
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-button');
        removeBtn.addEventListener('click', () => removeFromCart(item.id, item.size));
  
        li.appendChild(removeBtn);
        cartList.appendChild(li);
  
        total += (item.price * item.quantity);
      });
  
      if (totalAmountElement) {
        totalAmountElement.textContent = total.toFixed(2);
      }
    }
  
    function handleCheckout() {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      let message = 'Hello! I would like to place an order:\n\n';
      let total = 0;
  
      cart.forEach(item => {
        const lineTotal = item.price * item.quantity;
        message += `- ${item.name} (Size: ${item.size}) x ${item.quantity} @ ₦${item.price.toFixed(2)} = ₦${lineTotal.toFixed(2)}\n`;
        total += lineTotal;
      });
  
      message += `\nTotal: ₦${total.toFixed(2)}\nAdditional notes:\n`;
      const phoneNumber = '+2348163523594';
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
    }
  
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    // Attach checkout and remove-all event handlers if the buttons exist
    if (checkoutButton) checkoutButton.addEventListener('click', handleCheckout);
    if (removeAllButton) removeAllButton.addEventListener('click', removeAllFromCart);
  
    // On page load, update cart display from localStorage
    updateCartDisplay();
  
    // Optional: your carousel initialization, if needed
  });
  