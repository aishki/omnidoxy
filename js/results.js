// Get query from the URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query");

const resultsContainer = document.getElementById("results-container");

async function getData(query) {
  const apiUrl = `http://localhost:8080/https://favqs.com/api/quotes/?filter=${query}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: 'Token token="31696e37b70e9fbb8fd765ab2bf67b76"',
      },
    });

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("No quotes found for the query.");
      } else if (response.status === 401) {
        throw new Error("Unauthorized: Check your API token.");
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();

    // Clear previous results
    resultsContainer.innerHTML = "";

    // Check if quotes are found
    if (data.quotes.length === 0) {
      resultsContainer.textContent = "No quotes found. Try a different search!";
      return;
    }

    // Display results
    data.quotes.forEach((quote) => {
      const quoteElement = document.createElement("div");
      quoteElement.classList.add("quote-item");

      const quoteText = document.createElement("p");
      quoteText.textContent = `"${quote.body}"`;
      quoteText.classList.add("quote-text");

      const authorText = document.createElement("p");
      authorText.textContent = `- ${quote.author}`;
      authorText.classList.add("quote-author");

      quoteElement.appendChild(quoteText);
      quoteElement.appendChild(authorText);
      resultsContainer.appendChild(quoteElement);
    });
  } catch (error) {
    resultsContainer.textContent = "An error occurred while fetching results.";
    console.error("Error:", error);
  }
}

// Call the fetch function
if (query) {
  getData(query);
} else {
  resultsContainer.textContent = "No search query provided.";
}
