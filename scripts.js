let cart = [];
let selectedItem = null;
let selectedPrice = 0;

function addToCartPrompt(name, price) {
  selectedItem = name;
  selectedPrice = price;
  document.getElementById("modalItemName").innerText = `Dodaj: ${name}`;
  document.getElementById("modalQuantity").value = 1;
  document.getElementById("itemModal").classList.add("active");
}

function closeItemModal() {
  document.getElementById("itemModal").classList.remove("active");
}

function confirmAddToCart() {
  const qty = parseInt(document.getElementById("modalQuantity").value);
  const sauce = document.getElementById("modalSauce").value;
  const bread = document.getElementById("modalBread").value;
  const fullName = `${selectedItem} (${bread}, ${sauce})`;

  for (let i = 0; i < qty; i++) {
    cart.push({ name: fullName, price: selectedPrice, quantity: 1 });
  }
  updateCart();
  closeItemModal();
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCart();
}

function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCart();
}

function updateQuantity(name, change) {
  const item = cart.find((item) => item.name === name);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(name);
    } else {
      updateCart();
    }
  }
}

function setQuantity(name, qty) {
  const quantity = parseInt(qty);
  if (isNaN(quantity) || quantity < 1) return;
  const item = cart.find((i) => i.name === name);
  if (item) {
    item.quantity = quantity;
    updateCart();
  }
}

function updateCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? "flex" : "none";

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">€${item.price.toFixed(2)}</div>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="updateQuantity('${
          item.name
        }', -1)">-</button>
        <input type="number" class="quantity" min="1" value="${
          item.quantity
        }" onchange="setQuantity('${item.name}', this.value)" />
        <button class="quantity-btn" onclick="updateQuantity('${
          item.name
        }', 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = total.toFixed(2);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">Košarica je prazna</p>';
  }
}

function toggleCart() {
  const cartSummary = document.getElementById("cartSummary");
  if (cartSummary) cartSummary.classList.toggle("active");
}

function checkout() {
  if (cart.length === 0) {
    alert("Vaša košarica je prazna!");
    return;
  }

  let orderText = "Narudžba:%0A%0A";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    orderText += `${item.name} x${item.quantity} - €${itemTotal.toFixed(2)}%0A`;
  });

  orderText += `%0AUkupno: €${total.toFixed(2)}%0A%0A`;
  orderText += "Molimo potvrdite narudžbu i vrijeme dostave.";

  const phoneNumber = "+385311234567";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${orderText}`;
  const regularUrl = `tel:${phoneNumber}`;

  if (window.innerWidth <= 768) {
    window.open(whatsappUrl, "_blank");
  } else {
    if (confirm("Želite li poslati narudžbu putem WhatsApp-a ili nazvati?")) {
      window.open(whatsappUrl, "_blank");
    } else {
      window.open(regularUrl);
    }
  }
}

function addToCartAndRedirect(name, price) {
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = savedCart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    savedCart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(savedCart));
  window.location.href = "order.html";
}

function markToday() {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const todayIndex = new Date().getDay();
  const todayId = days[todayIndex];
  const todayElement = document.getElementById(todayId);
  if (todayElement) {
    todayElement.classList.add("today");
  }
}

function checkOpenStatus() {
  const statusIndicator = document.getElementById("statusIndicator");
  if (!statusIndicator) return;

  const now = new Date();
  const day = now.getDay(); // 0=nedjelja, 1=ponedjeljak, ...
  const timeInMinutes = now.getHours() * 60 + now.getMinutes();

  const schedule = {
    0: [[1080, 1440]], // Nedjelja 18:00-00:00
    1: [
      [570, 780],
      [1080, 1440],
    ], // Ponedjeljak 09:30-13:00 i 18:00-00:00
    2: [
      [570, 780],
      [1080, 1440],
    ], // Utorak
    3: [
      [570, 780],
      [1080, 1440],
    ], // Srijeda
    4: [
      [570, 780],
      [1080, 1440],
    ], // Četvrtak
    5: [
      [570, 780],
      [1080, 1500],
    ], // Petak 09:30-13:00 i 18:00-01:00
    6: [
      [570, 780],
      [1080, 1500],
    ], // Subota
  };

  const todaySchedule = schedule[day] || [];
  let isOpen = false;

  for (const [start, end] of todaySchedule) {
    if (timeInMinutes >= start && timeInMinutes < end) {
      isOpen = true;
      break;
    }
  }

  if (isOpen) {
    statusIndicator.textContent = "Otvoreno sada";
    statusIndicator.classList.remove("closed");
    statusIndicator.classList.add("open");
  } else {
    statusIndicator.textContent = "Trenutno zatvoreno";
    statusIndicator.classList.remove("open");
    statusIndicator.classList.add("closed");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  markToday();
  checkOpenStatus();
  updateCart();
  setInterval(checkOpenStatus, 60000);
});

function handleScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".animate-fadeInUp, .animate-fadeInLeft, .animate-fadeInRight"
  );

  animatedElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      // Pokreni animaciju ako element ulazi u 85% visine viewporta
      el.style.animationPlayState = "running";
      el.style.opacity = "1";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Zaustavi animacije dok se ne pokrenu scrollom
  document
    .querySelectorAll(
      ".animate-fadeInUp, .animate-fadeInLeft, .animate-fadeInRight"
    )
    .forEach((el) => {
      el.style.animationPlayState = "paused";
    });
  handleScrollAnimations(); // U slučaju da je element odmah vidljiv
});

window.addEventListener("scroll", handleScrollAnimations);

const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
