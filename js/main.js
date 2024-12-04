fetch("views/homepage.html")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load Section 2 content");
    }
    return response.text();
  })
  .then((html) => {
    const section2Container = document.getElementById("section-2-container");
    section2Container.innerHTML = html;

    // Re-initialize the search functionality
    initializeSearch();

    // Ensure the URL reflects `homepage.html` but keep the current page state
    window.history.replaceState({}, "", "index.html");
  })
  .catch((error) => console.error("Error:", error));

// Scroll action for the arrow
document
  .getElementById("scroll-arrow1")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const section2Container = document.getElementById("section-2-container");
    section2Container.scrollIntoView({ behavior: "smooth" });
  });
