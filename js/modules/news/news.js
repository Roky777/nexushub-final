
import { fetchTopNews, searchNews } from "./api.js";
import { renderArticles } from "./ui.js";
import { showLoader, hideLoader, showError, clearError } from "./loader.js";

// Getting elements from HTML

const loader = document.getElementById("news-loader");
const errorBox = document.getElementById("news-error");
const newsContainer = document.getElementById("news-container");
const categoryButtons = document.querySelectorAll(".category-btn");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Cache fetched articles per category so re-opening a category
// doesn't spend another API request (the free GNews plan is limited).
const newsCache = {};

// Function to load category news

async function loadNews(category = "general") {
  // Serve from cache if we already fetched this category.
  if (newsCache[category]) {
    renderArticles(newsContainer, newsCache[category]);
    return;
  }

  try {
    showLoader(loader);
    clearError(errorBox);
    const data = await fetchTopNews(category);
    newsCache[category] = data.articles;
    renderArticles(newsContainer, data.articles);
  } catch (error) {
    showError(
      errorBox,
      "Couldn't load news right now — the free news API request limit may " +
        "have been reached. Please try again later."
    );
  } finally {
    hideLoader(loader);
  }
}

// Function to search news

async function loadSearchNews() {
  const keyword = searchInput.value.trim();
  if (keyword === "") {
    loadNews();
    return;
  }
  try {
    showLoader(loader);
    clearError(errorBox);
    const data = await searchNews(keyword);
    renderArticles(newsContainer, data.articles);
  } catch (error) {
    showError(errorBox, error.message);
  } finally {
    hideLoader(loader);
  }
}

// Category button click

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class
    button.classList.add("active");

    // Clear search box
    searchInput.value = "";

    // Load selected category
    loadNews(button.dataset.category);
  });
});

// Search button click

searchBtn.addEventListener("click", loadSearchNews);

// Search when Enter key is pressed

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    loadSearchNews();
  }
});

// Debounce search

let timer;

searchInput.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (searchInput.value.trim() !== "") {
      loadSearchNews();
    }
  }, 800);
});

// Lazy-load: only fetch news the first time the News tab is opened,
// instead of on every page load. This avoids spending an API request
// for visitors who never open the News section.

let newsLoaded = false;

function ensureNewsLoaded() {
  if (newsLoaded) return;
  newsLoaded = true;
  loadNews();
}

// Load when the News nav button is clicked...
document
  .querySelector('.nav-btn[data-view="news"]')
  ?.addEventListener("click", ensureNewsLoaded);

// ...or immediately if the page opens already on the News view
// (e.g. the last-viewed tab was restored).
document.addEventListener("DOMContentLoaded", () => {
  const newsView = document.getElementById("news");
  if (newsView && !newsView.hidden) ensureNewsLoaded();
});
