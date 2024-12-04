function initializeSearch() {
  const searchButton = document.getElementById("search-button");
  if (searchButton) {
    searchButton.addEventListener("click", async () => {
      const query = document.getElementById("search-input").value.trim();

      // Check if the input is empty
      if (!query) {
        const resultsContainer = document.getElementById("results");
        if (resultsContainer) {
          resultsContainer.textContent = "Please enter a search term!";
        } else {
          console.warn("Results container not found.");
        }
        return;
      }

      // Determine the current page and set the redirection path
      if (
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/"
      ) {
        // From index.html, redirect to views/results.html
        window.location.href = `views/results.html?query=${encodeURIComponent(
          query
        )}`;
      } else if (window.location.pathname.endsWith("results.html")) {
        // From results.html, stay on the page and update the query
        window.location.href = `results.html?query=${encodeURIComponent(
          query
        )}`;
      } else {
        console.warn("Unexpected page. Defaulting to views/results.html.");
        window.location.href = `views/results.html?query=${encodeURIComponent(
          query
        )}`;
      }
    });
  } else {
    console.error("Search button not found.");
  }
}

// Initialize search functionality when the script is loaded
document.addEventListener("DOMContentLoaded", initializeSearch);
