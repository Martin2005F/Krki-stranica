const menuItems = [
  {
    name: "Pileći Kebab",
    price: 8.5,
    category: "Kebabs",
    image: "Chicken kebab.avif",
    description:
      "Sočno pečeno pileće meso s mediteranskim začinima i svježim povrćem.",
  },
  {
    name: "Juneći Kebab",
    price: 9.0,
    category: "Kebabs",
    image: "lamb Kebab.avif",
    description:
      "Ukusan juneći kebab mariniran u aromatičnim začinima i lagano pečen.",
  },
  {
    name: "Mješani Kebab",
    price: 10.0,
    category: "Kebabs",
    image: "Mixed kebab.avif",
    description:
      "Kombinacija pilećeg i junećeg mesa, savršeno začinjena za bogat okus.",
  },
  {
    name: "Vegetarijanski Kebab",
    price: 7.5,
    category: "Kebabs",
    image: "veggie-kebab.webp",
    description:
      "Svježe povrće pečeno na žaru, začinjeno s mediteranskim začinima.",
  },
  {
    name: "Ljuti Kebab",
    price: 9.5,
    category: "Kebabs",
    image: "spicy-kebab.jpg",
    description:
      "Za ljubitelje začinjene hrane, ljuti kebab s dodatkom čili umaka.",
  },
  {
    name: "Riblji Kebab",
    price: 11.0,
    category: "Kebabs",
    image: "fish-kebab.jpg",
    description: "Nježno riblje meso s mediteranskim začinima, pečeno na žaru.",
  },
  {
    name: "Coca-cola",
    price: 2.5,
    category: "Beverages",
    image: "coca-cola.jpg",
    description: "Klasična gazirana Coca-Cola.",
  },
  {
    name: "Fanta",
    price: 2.0,
    category: "Beverages",
    image: "fanta.jpg",
    description: "Ukusan narančasti gazirani sok.",
  },
  // Dodaj po potrebi i ostale kategorije
];

function renderMenu(category = "All Items") {
  const menuGrid = document.querySelector(".menu-grid");

  const filteredItems =
    category === "All Items"
      ? menuItems
      : menuItems.filter((item) => item.category === category);

  if (filteredItems.length === 0) {
    menuGrid.innerHTML = `<p style="font-size:1.2rem; padding:20px;">Nema stavki u odabranoj kategoriji.</p>`;
    return;
  }

  menuGrid.innerHTML = filteredItems
    .map(
      (item, index) => `
    <div class="menu-card scroll-animate" style="animation-delay: ${
      index * 100
    }ms;">
      <img src="${item.image}" alt="${item.name}" class="menu-image" />
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="menu-footer">
        <span>€${item.price.toFixed(2)}</span>
        <button class="order-btn" onclick="addItem('${item.name}', ${
        item.price
      })">Dodaj</button>
      </div>
    </div>
  `
    )
    .join("");

  handleScrollAnimations(); // Pokreni animacije
}

function addItem(name, price) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartBox = document.querySelector(".cart-box");

  if (cart.length === 0) {
    cartBox.innerHTML = `
      <h3><i class="fas fa-shopping-cart"></i> Košarica (0)</h3>
      <p>Vaša košarica je prazna</p>
      <button class="checkout-btn" onclick="submitOrder()">Naruči sada</button>
      <button id="backHomeBtn" class="checkout-btn" style="background-color: #555; margin-top: 10px;">
        Povratak na početnu
      </button>
    `;
    addBackHomeListener();
    return;
  }

  let total = 0;
  let cartHTML = `
    <h3><i class="fas fa-shopping-cart"></i> Košarica (${cart.length})</h3>
    <div class="cart-items">
      ${cart
        .map((item, index) => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          return `
            <div class="cart-item">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">€${item.price.toFixed(2)} x ${
            item.quantity
          } = €${itemTotal.toFixed(2)}</div>
              </div>
              <div class="cart-controls">
                <button class="cart-btn" onclick="changeQty(${index}, -1)">−</button>
                <span>${item.quantity}</span>
                <button class="cart-btn" onclick="changeQty(${index}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${index})">Ukloni</button>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
    <div class="cart-total">Ukupno: €${total.toFixed(2)}</div>
    <button class="checkout-btn" onclick="submitOrder()">Naruči sada</button>
    <button id="backHomeBtn" class="checkout-btn" style="background-color: #555; margin-top: 10px;">
      Povratak na početnu
    </button>
  `;

  cartBox.innerHTML = cartHTML;
  addBackHomeListener();
}

function addBackHomeListener() {
  const backBtn = document.getElementById("backHomeBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html"; // ili tvoja početna stranica
    });
  }
}

function changeQty(index, delta) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function submitOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Vaša košarica je prazna.");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const newOrder = {
    id: Date.now(),
    timestamp: Date.now(),
    items: cart,
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Očisti košaricu i ponovno renderiraj
  localStorage.removeItem("cart");
  renderCart();

  // Prikaži modal s animacijom
  const modal = document.getElementById("orderConfirmationModal");
  modal.classList.remove("hidden");
  modal.classList.remove("hide");
  modal.classList.add("show");
}

// Funkcija za zatvaranje modala s fade-out animacijom
function closeModal() {
  const modal = document.getElementById("orderConfirmationModal");
  modal.classList.remove("show");
  modal.classList.add("hide");

  // Nakon trajanja animacije (400ms) sakrij modal
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 400);
}

document.getElementById("closeModalBtn").addEventListener("click", closeModal);

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  renderMenu();

  document.querySelectorAll(".category").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".category")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.getAttribute("data-category");
      renderMenu(category);
    });
  });

  // Pokreni scroll animacije i na scroll event
  window.addEventListener("scroll", handleScrollAnimations);
  handleScrollAnimations(); // i odmah na početku

  // Dodaj event listener za gumb povratka na početnu
  const backHomeBtn = document.getElementById("backHomeBtn");
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      window.location.href = "index.html"; // ovdje postavi putanju do početne stranice
    });
  }
});

// Funkcija za otkrivanje elemenata u viewportu i dodavanje klase
function handleScrollAnimations() {
  const animElements = document.querySelectorAll(".scroll-animate");
  const windowHeight = window.innerHeight;

  animElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= windowHeight * 0.85) {
      el.classList.add("visible");
    }
  });
}
