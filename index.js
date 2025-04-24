async function search() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const resultsDiv = document.getElementById("results");

  const res = await fetch("searchIndex.json");
  const data = await res.json();

  const results = data.filter(item =>
    item.title.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    resultsDiv.innerHTML = `<p>No results found for "${query}"</p>`;
    return;
  }

  resultsDiv.innerHTML = results.map(item =>
    `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`
  ).join("");
}
