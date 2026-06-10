export async function getGitHubData(username) {

  const [userRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
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
    repos: await repoRes.json()
  };
}