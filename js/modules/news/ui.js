export function renderArticles(
  container,
  articles
) {
  container.innerHTML = "";

  articles.forEach((article) => {
    container.innerHTML += `
      <article class="news-card">

        <img
          class="news-image"
          src="${
            article.image ||
            "https://via.placeholder.com/400x250"
          }"
        >

        <div class="news-content">

          <h3 class="news-title">
            ${article.title}
          </h3>

          <div class="news-meta">
            <span>
              ${article.source.name}
            </span>

            <span>
              ${new Date(
                article.publishedAt
              ).toLocaleDateString()}
            </span>
          </div>

          <p class="news-description">
            ${
              article.description ||
              "No description"
            }
          </p>

          <a
            href="${article.url}"
            target="_blank"
            class="read-more"
          >
            Read More
          </a>

        </div>

      </article>
    `;
  });
}