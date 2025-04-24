const functions = require("firebase-functions");
const axios = require("axios");
const cheerio = require("cheerio");

exports.crawl = functions.https.onRequest(async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).send("Query is missing.");
  }

  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const $ = cheerio.load(response.data);
    const links = [];

    $("a").each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.startsWith("http")) {
        links.push(href);
      }
    });

    res.json({
      query,
      results: links.slice(0, 10), // Trailing comma added here
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to crawl.");
  }
});
