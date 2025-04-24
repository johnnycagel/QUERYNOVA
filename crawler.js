const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const visited = new Set();
const index = [];

async function crawl(url, depth = 1) {
  if (depth === 0 || visited.has(url)) return;
  visited.add(url);

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("title").text();
    index.push({ title, url });

    const links = $("a")
      .map((_, a) => $(a).attr("href"))
      .get()
      .filter((href) => href && href.startsWith("http"));

    for (let link of links.slice(0, 5)) {
      await crawl(link, depth - 1);
    }
  } catch (e) {
    console.log(`Failed to crawl ${url}`);
  }
}

// Start crawling
crawl("https://example.com", 2).then(() => {
  fs.writeFileSync("searchIndex.json", JSON.stringify(index, null, 2));
  console.log("Crawling complete!");
});
