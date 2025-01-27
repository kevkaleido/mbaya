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
    const productId = itemElement.getAttribute('data-id');
    const productName = itemElement.getAttribute('data-name');
    const productPrice = parseFloat(itemElement.getAttribute('data-price'));

    // Initialize options
    let selectedSize = 'Not Specified';
    let selectedPrint = 'Not Specified';

    // Size selection only relevant on detail page
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

      // Get the selected print option
      const printSelect = itemElement.querySelector('#print-select');
      if (printSelect) {
        selectedPrint = printSelect.options[printSelect.selectedIndex].text;
      }
    }

    // Create or update cart item
    const existingIndex = cart.findIndex(ci => 
      ci.id === productId && 
      ci.size === selectedSize && 
      ci.print === selectedPrint
    );
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
        size: selectedSize,
        print: selectedPrint
      });
    }

    updateCartDisplay();
    saveCart();
  }

  function removeFromCart(productId, size, print) {
    const index = cart.findIndex(ci => 
      ci.id === productId && 
      ci.size === size && 
      ci.print === print
    );
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
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          ${item.size !== 'Not Specified' ? `<p>Size: ${item.size}</p>` : ''}
          ${item.print !== 'Not Specified' ? `<p>Print: ${item.print}</p>` : ''}
          <p>₦${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button class="remove-button">Remove</button>
        </div>
      `;

      // Attach event listener to the remove button
      li.querySelector('.remove-button').addEventListener('click', () => {
        removeFromCart(item.id, item.size, item.print);
      });

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
      message += `- ${item.name}`;
      if (item.size !== 'Not Specified') {
        message += ` (Size: ${item.size})`;
      }
      if (item.print !== 'Not Specified') {
        message += ` (Print: ${item.print})`;
      }
      message += ` x ${item.quantity} @ ₦${item.price.toFixed(2)} = ₦${lineTotal.toFixed(2)}\n`;
      total += lineTotal;
    });

    message += `\nTotal: ₦${total.toFixed(2)}\nAdditional notes:\n`;
    const phoneNumber = '+2347080795642';
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

  // Additional: Event listener for print options on detail page
  if (productDetail) {
    const addToCartButton = productDetail.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', () => {
      // Ensure the print option is captured in addToCart function
      // This is already handled in the addToCart function above
    });
  }

  // Optional: your carousel initialization, if needed
});
