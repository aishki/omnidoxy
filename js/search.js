document.addEventListener("DOMContentLoaded", () => {
  // Attach event listener to the search button
  const searchButton = document.getElementById("search-button");
  if (searchButton) {
    searchButton.addEventListener("click", async () => {
      const query = document.getElementById("search-input").value.trim();

      // Clear previous results
      const resultsContainer = document.getElementById("results-container");

      // Check if the input is empty
      if (!query) {
        resultsContainer.textContent = "Please enter a search term!";
        return;
      }

      // Redirect to results.html with query parameter if there's a search term
      window.location.href = `results.html?query=${encodeURIComponent(query)}`;
    });
  } else {
    console.error("Search button not found.");
  }
});
