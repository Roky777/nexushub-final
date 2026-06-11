import { getGitHubData }
from "./githubApi.js";

import {
  displayUser,
  displayRepositories,
  displayLanguages,
  clearUI
}
from "./githubUI.js";

const usernameInput =
  document.getElementById("usernameInput");

const searchBtn =
  document.getElementById("searchBtn");

const loading =
  document.getElementById("loading");

const error =
  document.getElementById("error");

let repositories = [];

searchBtn?.addEventListener("click", () => {

  const username =
    usernameInput.value.trim();

  if (!username) {

    showError(
      "Please enter a GitHub username"
    );

    return;
  }

  fetchGitHubUser(username);

});

usernameInput?.addEventListener(
  "keydown",
  (e) => {

    if (e.key === "Enter") {
      searchBtn.click();
    }

  }
);

async function fetchGitHubUser(username) {

  showLoading();

  hideError();

  try {

    const data =
      await getGitHubData(username);

    repositories =
      data.repos;

    displayUser(data.user);

    displayRepositories(repositories);

    displayLanguages(repositories);

    localStorage.setItem(
      "lastUser",
      username
    );

  }

  catch (err) {

    clearUI();

    showError(err.message);

  }

  finally {

    hideLoading();

  }

}

const sortRepos =
  document.getElementById("sortRepos");

sortRepos?.addEventListener(
  "change",
  () => {

    const sorted =
      [...repositories];

    switch(sortRepos.value){

      case "stars":

        sorted.sort(
          (a,b)=>
          b.stargazers_count -
          a.stargazers_count
        );

        break;

      case "name":

        sorted.sort(
          (a,b)=>
          a.name.localeCompare(b.name)
        );

        break;

      default:

        sorted.sort(
          (a,b)=>
          new Date(b.updated_at) -
          new Date(a.updated_at)
        );
    }

    displayRepositories(sorted);

  }
);

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showError(message) {
  error.textContent = message;
  error.classList.remove("hidden");
}

function hideError() {
  error.textContent = "";
  error.classList.add("hidden");
}

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const lastUser =
      localStorage.getItem("lastUser");

    if (lastUser) {

      usernameInput.value =
        lastUser;

      fetchGitHubUser(lastUser);

    }

  }
);