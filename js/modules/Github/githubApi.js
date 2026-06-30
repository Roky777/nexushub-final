// Fetch GitHub data through our serverless proxy ("/api/github"),
// which attaches a token (higher rate limit) and caches results.
// If the proxy isn't available (e.g. local development), fall back
// to calling the GitHub API directly.
export async function getGitHubData(username) {
  let proxied = null;
  try {
    proxied = await fetch(
      `/api/github?username=${encodeURIComponent(username)}`
    );
  } catch (error) {
    proxied = null; // proxy unreachable — use the direct fallback
  }

  if (proxied) {
    if (proxied.status === 404) {
      throw new Error("GitHub user not found.");
    }
    if (proxied.ok) {
      return await proxied.json();
    }
    // Any other proxy error falls through to a direct request below.
  }

  // ---- Direct fallback (local dev / no proxy) ----
  const [userRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    ),
  ]);

  if (userRes.status === 404) {
    throw new Error("GitHub user not found.");
  }
  if (userRes.status === 403) {
    throw new Error("GitHub API rate limit exceeded.");
  }
  if (!userRes.ok || !repoRes.ok) {
    throw new Error("Failed to fetch GitHub data.");
  }

  return {
    user: await userRes.json(),
    repos: await repoRes.json(),
  };
}
