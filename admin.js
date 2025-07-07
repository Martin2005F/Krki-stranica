// DOM elementi
const tabs = document.querySelectorAll(".admin-tab");
const panels = document.querySelectorAll(".admin-panel");

const categoryModal = document.getElementById("categoryModal");
const menuItemModal = document.getElementById("menuItemModal"); // ISPRAVLJENO ime varijable
const confirmDeleteModal = document.getElementById("confirmDeleteModal");
const confirmDeleteTitle = document.getElementById("confirmDeleteTitle");
const confirmDeleteMessage = document.getElementById("confirmDeleteMessage");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const addCategoryBtn = document.getElementById("addCategoryBtn");
const addMenuItemBtn = document.getElementById("addMenuItemBtn"); // ISPRAVLJENO ime varijable
const closeCategoryModalBtn = document.getElementById("closeCategoryModal");
const closeMenuItemModalBtn = document.getElementById("closeMenuItemModal");

const categoryForm = document.getElementById("categoryForm");
const menuItemForm = document.getElementById("menuItemForm");

const categoryList = document.getElementById("categoryList");
const menuItemList = document.getElementById("menuItemList");
const menuItemCategorySelect = document.getElementById(
  "menuItemCategorySelect"
);

const ordersList = document.getElementById("ordersList");

// Analitika elementi
const totalOrdersCard = document.getElementById("totalOrdersCard");
const totalMenuItemsCard = document.getElementById("totalMenuItemsCard");
const totalCategoriesCard = document.getElementById("totalCategoriesCard");
const totalRevenueCard = document.getElementById("totalRevenueCard");

// Podaci
let categories = [];
let menuItems = [];
let itemToDelete = null;
let editingCategoryId = null;
let editingMenuItemId = null;

// Tab Switching
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    panels.forEach((p) => (p.style.display = "none"));
    panels[index].style.display = "block";

    if (index === 1) renderOrders(); // Narudžbe tab
    if (index === 2) renderAnalytics(); // Analitika tab
  });
});

// Open/Close Modals
addCategoryBtn.addEventListener("click", () => {
  editingCategoryId = null;
  categoryForm.reset();
  categoryModal.classList.add("show");
});

addMenuItemBtn.addEventListener("click", () => {
  editingMenuItemId = null;
  updateCategorySelect();
  menuItemForm.reset();
  menuItemModal.classList.add("show");
});

closeCategoryModalBtn.addEventListener("click", () => {
  categoryModal.classList.remove("show");
});

closeMenuItemModalBtn.addEventListener("click", () => {
  menuItemModal.classList.remove("show");
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("show");
  }
});

// Add/Edit Category
categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(categoryForm);
  const categoryData = {
    name: formData.get("name"),
    description: formData.get("description"),
    sortOrder: Number(formData.get("sortOrder")),
    active: formData.get("active") === "on",
  };

  if (editingCategoryId) {
    const index = categories.findIndex((c) => c.id === editingCategoryId);
    if (index !== -1)
      categories[index] = { ...categories[index], ...categoryData };
  } else {
    categories.push({
      id: Date.now().toString(),
      ...categoryData,
    });
  }

  saveData();
  renderCategories();
  categoryForm.reset();
  categoryModal.classList.remove("show");
});

// Add/Edit Menu Item
menuItemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(menuItemForm);
  const itemData = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    description: formData.get("description"),
    image: formData.get("image"),
    category: formData.get("category"),
    prepTime: formData.get("prepTime"),
    ingredients: formData.get("ingredients"),
    allergens: formData.get("allergens"),
    sortOrder: Number(formData.get("sortOrder")),
    available: formData.get("available") === "on",
  };

  if (editingMenuItemId) {
    const index = menuItems.findIndex((i) => i.id === editingMenuItemId);
    if (index !== -1) menuItems[index] = { ...menuItems[index], ...itemData };
  } else {
    menuItems.push({
      id: Date.now().toString(),
      ...itemData,
    });
  }

  saveData();
  renderMenuItems();
  menuItemForm.reset();
  menuItemModal.classList.remove("show");
});

// Render Categories
function renderCategories() {
  categoryList.innerHTML = "";
  categories
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((cat) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
      <div class="card-top">
        <h3>${cat.name}</h3>
        <span class="status">${cat.active ? "Active" : "Inactive"}</span>
      </div>
      <p>${cat.description}</p>
      <div class="card-actions">
        <button onclick="editCategory('${
          cat.id
        }')"><i class="fas fa-pen"></i></button>
        <button onclick="showConfirmDelete('category', '${cat.id}', '${
        cat.name
      }')"><i class="fas fa-trash"></i></button>
      </div>
    `;
      categoryList.appendChild(div);
    });
  renderAnalytics();
}

// Render Menu Items
function renderMenuItems() {
  menuItemList.innerHTML = "";
  menuItems
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((item) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
      <div class="card-top">
        <h3>${item.name}</h3>
        <span class="status">€${item.price.toFixed(2)}</span>
      </div>
      <p>${item.description}</p>
      <div class="card-actions">
        <button onclick="editMenuItem('${
          item.id
        }')"><i class="fas fa-pen"></i></button>
        <button onclick="showConfirmDelete('menu', '${item.id}', '${
        item.name
      }')"><i class="fas fa-trash"></i></button>
      </div>
    `;
      menuItemList.appendChild(div);
    });
  renderAnalytics();
}

// Update category select for menu item form
function updateCategorySelect() {
  menuItemCategorySelect.innerHTML =
    '<option value="">Odaberi kategoriju</option>';
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    menuItemCategorySelect.appendChild(option);
  });
}

// Confirm Delete
function showConfirmDelete(type, id, name) {
  itemToDelete = { type, id };
  confirmDeleteTitle.textContent = "Jeste li sigurni?";
  confirmDeleteMessage.textContent = `Želite li obrisati "${name}"?`;
  confirmDeleteModal.classList.add("show");
}

cancelDeleteBtn.addEventListener("click", () => {
  confirmDeleteModal.classList.remove("show");
});

confirmDeleteBtn.addEventListener("click", () => {
  if (!itemToDelete) return;

  if (itemToDelete.type === "category") {
    const nameToDelete = getCategoryNameById(itemToDelete.id);
    categories = categories.filter((c) => c.id !== itemToDelete.id);
    menuItems = menuItems.filter((m) => m.category !== nameToDelete);
  } else {
    menuItems = menuItems.filter((m) => m.id !== itemToDelete.id);
  }
  saveData();
  renderCategories();
  renderMenuItems();
  confirmDeleteModal.classList.remove("show");
});

// Get Category Name by ID
function getCategoryNameById(id) {
  const category = categories.find((c) => c.id === id);
  return category ? category.name : "";
}

// Edit Handlers
function editCategory(id) {
  const category = categories.find((c) => c.id === id);
  if (!category) return;

  editingCategoryId = id;
  categoryForm.name.value = category.name;
  categoryForm.description.value = category.description;
  categoryForm.sortOrder.value = category.sortOrder;
  categoryForm.active.checked = category.active;

  categoryModal.classList.add("show");
}

function editMenuItem(id) {
  const item = menuItems.find((i) => i.id === id);
  if (!item) return;

  editingMenuItemId = id;
  updateCategorySelect();

  menuItemForm.name.value = item.name;
  menuItemForm.price.value = item.price;
  menuItemForm.description.value = item.description;
  menuItemForm.image.value = item.image;
  menuItemForm.category.value = item.category;
  menuItemForm.prepTime.value = item.prepTime;
  menuItemForm.ingredients.value = item.ingredients;
  menuItemForm.allergens.value = item.allergens;
  menuItemForm.sortOrder.value = item.sortOrder;
  menuItemForm.available.checked = item.available;

  menuItemModal.classList.add("show");
}

// Render Orders
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (!ordersList) return;

  if (orders.length === 0) {
    ordersList.innerHTML = `
      <div class="order-card empty">
        <p>Trenutno nema zaprimljenih narudžbi.</p>
      </div>`;
    return;
  }

  ordersList.innerHTML = orders
    .map((order, index) => {
      const itemsHTML = order.items
        .map(
          (item) =>
            `<li>${item.name} x${item.quantity} = €${(
              item.price * item.quantity
            ).toFixed(2)}</li>`
        )
        .join("");

      return `
        <div class="order-card">
          <h4>Narudžba #${order.id}</h4>
          <p>Vrijeme: ${new Date(order.timestamp).toLocaleString()}</p>
          <ul>${itemsHTML}</ul>
          <p><strong>Ukupno:</strong> €${order.items
            .reduce((sum, i) => sum + i.price * i.quantity, 0)
            .toFixed(2)}</p>
          <button class="complete-order-btn" onclick="completeOrder(${index})">Gotova narudžba</button>
        </div>`;
    })
    .join("");
  renderAnalytics();
}

// Complete (Delete) Order
function completeOrder(index) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.splice(index, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}

// Render Analytics
function renderAnalytics() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  totalOrdersCard.textContent = orders.length;
  totalMenuItemsCard.textContent = menuItems.length;
  totalCategoriesCard.textContent = categories.length;

  const revenue = orders.reduce((total, order) => {
    return (
      total +
      order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  }, 0);

  totalRevenueCard.textContent = `€${revenue.toFixed(2)}`;
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("menuItems", JSON.stringify(menuItems));
}

// Load data from localStorage
function loadData() {
  categories = JSON.parse(localStorage.getItem("categories")) || [];
  menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
}

// Initial load
const defaultCategories = [
  { id: "1", name: "Kebab", description: "", sortOrder: 0, active: true },
  { id: "2", name: "Pića", description: "", sortOrder: 1, active: true },
];

const defaultMenuItems = [
  {
    id: "1",
    name: "Pileći Kebab",
    price: 8.5,
    description: "Sočno pečeno pileće meso ...",
    category: "Kebab",
    sortOrder: 0,
    available: true,
    image: "Chicken kebab.avif",
  },
  {
    id: "2",
    name: "Coca-cola",
    price: 2.5,
    description: "Klasična gazirana Coca-Cola.",
    category: "Pića",
    sortOrder: 0,
    available: true,
    image: "coca-cola.jpg",
  },
  // Dodaj ostale stavke...
];

// Funkcija za učitavanje podataka s početkom defaulta
function loadData() {
  categories = JSON.parse(localStorage.getItem("categories"));
  menuItems = JSON.parse(localStorage.getItem("menuItems"));

  // Ako nema podataka u localStorage, postavi default i spremi
  if (!categories || categories.length === 0) {
    categories = defaultCategories;
    localStorage.setItem("categories", JSON.stringify(categories));
  }

  if (!menuItems || menuItems.length === 0) {
    menuItems = defaultMenuItems;
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }
}

// Na početku koda pozovi loadData
loadData();
renderCategories();
renderMenuItems();
renderOrders();
renderAnalytics();

renderAnalytics();

