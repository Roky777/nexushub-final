
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

// Function to load category news

async function loadNews(category = "general") {
  try {
    showLoader(loader);
    clearError(errorBox);
    const data = await fetchTopNews(category);
    renderArticles(newsContainer, data.articles);
  } catch (error) {
    showError(errorBox, error.message);
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

// Load general news when page opens

document.addEventListener("DOMContentLoaded", () => {
  loadNews();
});
