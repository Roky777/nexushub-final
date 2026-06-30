const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("gh-name");
const bio = document.getElementById("bio");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");
const locationElement = document.getElementById("location");
const profileLink = document.getElementById("profileLink");

const profileContainer =
  document.getElementById("profileContainer");

const repoContainer =
  document.getElementById("repoContainer");

const languageContainer =
  document.getElementById("languageContainer");

export function displayUser(user) {

  profileContainer.classList.remove("hidden");

  avatar.src = user.avatar_url;

  nameElement.textContent =
    user.name || user.login;

  bio.textContent =
    user.bio || "No bio available";

  followers.textContent =
    user.followers;

  following.textContent =
    user.following;

  repos.textContent =
    user.public_repos;

  locationElement.textContent =
    user.location || "Not Available";

  profileLink.href =
    user.html_url;
}

export function displayRepositories(repoList) {

  repoContainer.innerHTML = "";

  if (!repoList.length) {
    repoContainer.innerHTML =
      "<p>No repositories found.</p>";
    return;
  }

  repoList.forEach(repo => {

    const card =
      document.createElement("div");

    card.classList.add("repo-card");

    card.innerHTML = `
      <h3>
        <a href="${repo.html_url}" target="_blank">
          ${repo.name}
        </a>
      </h3>

      <p>
        ${repo.description || "No description available"}
      </p>

      <div class="repo-info">
        <span>⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count}</span>
        <span>${repo.language || "Unknown"}</span>
        <span>
          ${new Date(repo.updated_at).toLocaleDateString()}
        </span>
      </div>
    `;

    repoContainer.appendChild(card);

  });

}

export function displayLanguages(repoList) {

  languageContainer.innerHTML = "";

  const languageCount = {};

  repoList.forEach(repo => {

    if (repo.language) {

      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;
    }
  });

  const entries =
    Object.entries(languageCount);

  if (!entries.length) {

    languageContainer.innerHTML =
      "<p>No language data available.</p>";

    return;
  }

  const total = entries.reduce(
    (sum, [, count]) => sum + count,
    0
  );

  entries
    .sort((a, b) => b[1] - a[1])
    .forEach(([language, count]) => {

      const percentage =
        ((count / total) * 100).toFixed(1);

      const div =
        document.createElement("div");

      div.classList.add("language-item");

      div.textContent =
        `${language} - ${percentage}%`;

      languageContainer.appendChild(div);

    });

}

export function clearUI() {

  profileContainer.classList.add("hidden");

  repoContainer.innerHTML = "";

  languageContainer.innerHTML = "";

}