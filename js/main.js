// Fetch Section 2 content from homepage.html
fetch("views/homepage.html")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load Section 2 content");
    }
    return response.text();
  })
  .then((html) => {
    // Insert the fetched content into the placeholder (section-2-container)
    const section2Container = document.getElementById("section-2-container");
    section2Container.innerHTML = html;

    // Update the URL to reflect the homepage.html without the hash
    window.history.pushState({}, "", "views/homepage.html");
  })
  .catch((error) => console.error("Error:", error));

// Event listener for the scroll action (when the arrow is clicked)
document
  .getElementById("scroll-arrow")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default anchor behavior
    const section2Container = document.getElementById("section-2-container");
    section2Container.scrollIntoView({ behavior: "smooth" });
  });
