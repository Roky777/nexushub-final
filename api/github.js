// =====================================
//  VERCEL SERVERLESS FUNCTION:  /api/github
//  Proxies the GitHub REST API so that:
//    1. We can attach a token (set GITHUB_TOKEN in Vercel project
//       settings) which raises the rate limit from 60 requests/hour
//       (unauthenticated) to 5,000/hour — fixing "rate limit exceeded".
//    2. Responses are cached at Vercel's CDN, so repeated lookups of
//       the same user don't spend new requests.
//
//  Query param:  ?username=octocat
// =====================================

module.exports = async (req, res) => {
  const username = (req.query.username || "").trim();
  if (!username) {
    res.status(400).json({ error: "username is required" });
    return;
  }

  const headers = {
    "User-Agent": "NexusHub",
    Accept: "application/vnd.github+json",
  };
  // Token is optional — with it we get the higher rate limit.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
        { headers }
      ),
    ]);

    if (userRes.status === 404) {
      res.status(404).json({ error: "GitHub user not found." });
      return;
    }
    if (!userRes.ok) {
      res.status(userRes.status).json({ error: "GitHub request failed." });
      return;
    }

    const user = await userRes.json();
    const repos = repoRes.ok ? await repoRes.json() : [];

    // Cache each user's data for 1 hour at the CDN.
    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );
    res.status(200).json({ user, repos });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub data." });
  }
};
