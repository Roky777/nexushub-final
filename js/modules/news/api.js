import { API_KEY, BASE_URL } from "./config.js";

export async function fetchTopNews(category = "general") {
    const url =
    `${BASE_URL}/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }
    return await response.json();
}

export async function searchNews(keyword){
    const url =
    `${BASE_URL}/search?q=${encodeURIComponent(keyword)}&lang=en&max=10&apikey=${API_KEY}`;
    const response = await fetch(url);
    if(!response.ok){
        throw new Error("Failed to fetch");
    }
    return await response.json();
}