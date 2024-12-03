// Get query from the URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query");

const resultsContainer = document.getElementById("results-container");
const dictionaryContainer = document.getElementById("dictionary-container");
const dictionaryContent = document.getElementById("dictionary-content");

// Stopwords for NLP logic
const stopwords = [
  "the",
  "and",
  "or",
  "is",
  "a",
  "of",
  "to",
  "in",
  "youll",
  "youre",
  "everyone",
];

// Function to highlight words dynamically and avoid duplicates
function highlightWords(quote) {
  const words = quote.split(" ");
  const numToHighlight = words.length > 20 ? 2 : 1;

  // Simple NLP: Select longer words and exclude stopwords
  const candidates = words
    .map((word) => word.replace(/[^a-zA-Z]/g, "")) // Normalize by stripping punctuation
    .filter(
      (word) => !stopwords.includes(word.toLowerCase()) && word.length > 4
    );

  const highlightedWords = new Set(); // Track highlighted words
  const selectedWords = [];

  // Select words to highlight (ensuring no duplicates)
  for (const word of candidates) {
    if (!highlightedWords.has(word.toLowerCase())) {
      selectedWords.push(word);
      highlightedWords.add(word.toLowerCase());
    }
    if (selectedWords.length >= numToHighlight) break; // Stop after selecting required number
  }

  // Wrap selected words with <span> for highlighting
  return words
    .map((word) => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, ""); // Strip punctuation for matching
      if (selectedWords.includes(cleanWord)) {
        selectedWords.splice(selectedWords.indexOf(cleanWord), 1); // Remove to avoid reusing
        return `<span class="highlight">${word}</span>`;
      }
      return word;
    })
    .join(" ");
}

// Function to fetch synonyms and definitions from Datamuse API
async function fetchWordDetails(word) {
  try {
    const [synonymsRes, definitionRes] = await Promise.all([
      fetch(`https://api.datamuse.com/words?rel_syn=${word}`),
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`),
    ]);

    const synonyms = await synonymsRes.json();
    const definitions = await definitionRes.json();

    return {
      synonyms: synonyms.map((syn) => syn.word).slice(0, 5),
      definitions: definitions[0]?.meanings[0]?.definitions || [],
    };
  } catch (error) {
    console.error("Error fetching word details:", error);
    return { synonyms: [], definitions: [] };
  }
}

// Function to display word details in the dictionary container
function displayWordDetails(word, details) {
  const { synonyms, definitions } = details;

  dictionaryContent.innerHTML = `
    <h4 class="highlighted-word">${word}</h4>
    <p class="synonyms"><strong>SYNONYMS:</strong><br> ${
      synonyms.join(", ") || "None"
    }</p>
    <p class="definition"><strong>DEFINITION:</strong><br> ${
      definitions.length > 0
        ? definitions[0].definition
        : "No definition available."
    }</p>
  `;
}

// Function to fetch and render quotes
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
    data.quotes.forEach(({ body, author }) => {
      const quoteElement = document.createElement("div");
      quoteElement.classList.add("quote-item");

      // Highlight words in the quote
      const highlightedQuote = highlightWords(body);

      const quoteText = document.createElement("p");
      quoteText.innerHTML = `"${highlightedQuote}"`;
      quoteText.classList.add("quote-text");

      const authorText = document.createElement("p");
      authorText.textContent = `${author}`;
      authorText.classList.add("quote-author");

      quoteElement.appendChild(quoteText);
      quoteElement.appendChild(authorText);
      resultsContainer.appendChild(quoteElement);

      // Add click listeners to highlighted words
      quoteText.querySelectorAll(".highlight").forEach((span) => {
        span.addEventListener("click", async () => {
          const word = span.textContent;
          const details = await fetchWordDetails(word);
          displayWordDetails(word, details);
        });
      });
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
