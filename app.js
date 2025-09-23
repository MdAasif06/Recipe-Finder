/* ================================
   DOM Elements
================================ */
const recipeGrid = document.querySelector("[data-recipe-grid]");
const template = document.querySelector("#recipe-card-template");
const resultsCount = document.querySelector("[data-results-count]");
const emptyState = document.querySelector("[data-empty-state]");

const searchInput = document.querySelector("[data-search-input]");
const searchForm = document.querySelector("#search-form");
const clearBtn = document.querySelector("[data-clear-btn]");
const sortSelect = document.querySelector("[data-sort]");
const cuisineFilters = document.querySelectorAll("[data-filter-cuisine]");
const mealFilters = document.querySelectorAll("[data-filter-meal]");

const modal = document.querySelector("[data-modal]");
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const modalClose = document.querySelector("[data-modal-close]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalSubtitle = document.querySelector("[data-modal-subtitle]");
const modalImg = document.querySelector("[data-modal-image]");
const modalIngredients = document.querySelector("[data-modal-ingredients]");
const modalInstructions = document.querySelector("[data-modal-instructions]");
const modalTime = document.querySelector("[data-modal-time]");
const modalCuisine = document.querySelector("[data-modal-cuisine]");
const modalMeal = document.querySelector("[data-modal-meal]");

/* ================================
   State
================================ */
let recipes = [];        // all recipes from JSON
let currentRecipes = []; // filtered/sorted recipes

/* ================================
   Fetch Recipes from JSON
================================ */
fetch("./api/recipes.json") // make sure path is correct
  .then(res => res.json())
  .then(data => {
    recipes = data;
    currentRecipes = [...recipes];
    renderRecipes(currentRecipes); // initial render
  })
  .catch(err => console.error("Failed to load recipes:", err));

/* ================================
   Render Functions
================================ */
function renderRecipes(list) {
  recipeGrid.innerHTML = "";
  if (!list.length) {
    emptyState.classList.remove("visually-hidden");
  } else {
    emptyState.classList.add("visually-hidden");
    list.forEach(recipe => {
      const card = template.content.cloneNode(true);
      card.querySelector("[data-card-title]").textContent = recipe.title;
      card.querySelector("[data-card-desc]").textContent = recipe.desc;
      card.querySelector("[data-card-time]").textContent = `${recipe.time} min`;
      card.querySelector("[data-card-cuisine]").textContent = recipe.cuisine;
      card.querySelector("[data-card-image]").src = recipe.image;
      card.querySelector("[data-card-image]").alt = recipe.title;
      card.querySelector("[data-card-open]").addEventListener("click", () => openModal(recipe));
      recipeGrid.appendChild(card);
    });
  }
  resultsCount.textContent = list.length;
}

/* ================================
   Search + Filter + Sort
================================ */
function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedCuisines = Array.from(cuisineFilters).filter(cb => cb.checked).map(cb => cb.value);
  const selectedMeals = Array.from(mealFilters).filter(cb => cb.checked).map(cb => cb.value);
  const sortBy = sortSelect.value;

  let filtered = recipes.filter(r => {
    const matchesQuery =
      r.title.toLowerCase().includes(query) ||
      r.ingredients.some(i => i.toLowerCase().includes(query));
    const matchesCuisine = !selectedCuisines.length || selectedCuisines.includes(r.cuisine);
    const matchesMeal = !selectedMeals.length || selectedMeals.includes(r.meal);
    return matchesQuery && matchesCuisine && matchesMeal;
  });

  if (sortBy === "time-asc") filtered.sort((a, b) => a.time - b.time);
  if (sortBy === "time-desc") filtered.sort((a, b) => b.time - a.time);
  if (sortBy === "alpha") filtered.sort((a, b) => a.title.localeCompare(b.title));

  currentRecipes = filtered;
  renderRecipes(currentRecipes);
}

/* ================================
   Modal Functions
================================ */
function openModal(recipe) {
  modal.classList.remove("visually-hidden");
  modalTitle.textContent = recipe.title;
  modalSubtitle.textContent = recipe.desc;
  modalImg.src = recipe.image;
  modalImg.alt = recipe.title;
  modalIngredients.innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join("");
  modalInstructions.innerHTML = recipe.instructions.map(i => `<li>${i}</li>`).join("");
  modalTime.textContent = `${recipe.time} min`;
  modalCuisine.textContent = recipe.cuisine;
  modalMeal.textContent = recipe.meal;
}

function closeModal() {
  modal.classList.add("visually-hidden");
}

/* ================================
   Event Listeners
================================ */
searchForm.addEventListener("submit", e => {
  e.preventDefault();
  applyFilters();
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  cuisineFilters.forEach(cb => (cb.checked = false));
  mealFilters.forEach(cb => (cb.checked = false));
  sortSelect.value = "relevance";
  applyFilters();
});

cuisineFilters.forEach(cb => cb.addEventListener("change", applyFilters));
mealFilters.forEach(cb => cb.addEventListener("change", applyFilters));
sortSelect.addEventListener("change", applyFilters);

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

//navbar
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});