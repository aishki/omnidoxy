// Define default and emotion-specific colors
const defaultBackground =
  "linear-gradient(117deg, rgba(97, 65, 18, 1) 0%, rgba(191, 128, 33, 1) 100%)";
const defaultHighlightColor = "#92723F";

// Emotion-based color mappings
const emotionColors = {
  love: {
    gradient:
      "linear-gradient(117deg, rgba(173,0,82,1) 0%, rgba(255,170,205,1) 100%)",
    highlight: "#AD0052", // Deep magenta
  },
  romance: {
    gradient:
      "linear-gradient(117deg, rgba(0,0,0,1) 0%, rgba(160,18,18,1) 100%)",
    highlight: "#A01212", // Crimson red
  },
  sad: {
    gradient:
      "linear-gradient(117deg, rgba(72,0,173,1) 0%, rgba(58,160,231,1) 100%)",
    highlight: "#4800AD", // Indigo
  },
  anger: {
    gradient:
      "linear-gradient(117deg, rgba(0,0,0,1) 0%, rgba(160,18,18,1) 100%)",
    highlight: "#A01212", // Crimson red
  },
  rage: {
    gradient:
      "linear-gradient(117deg, rgba(0,0,0,1) 0%, rgba(160,18,18,1) 100%)",
    highlight: "#A01212", // Crimson red
  },
  happy: {
    gradient:
      "linear-gradient(117deg, rgba(194,133,0,1) 0%, rgba(255,143,0,1) 54%, rgba(194,255,184,1) 100%)",
    highlight: "#C28500", // Gold
  },
};

// Function to get colors for the provided emotion
function getColorsForEmotion(emotion) {
  return (
    emotionColors[emotion] || {
      gradient: defaultBackground,
      highlight: defaultHighlightColor,
    }
  );
}

// Highlight words dynamically with click functionality
function highlightWords(quote, highlightColor, onClickHandler) {
  const words = quote.split(" ");
  const numToHighlight = words.length > 20 ? 2 : 1;

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

  const candidates = words
    .map((word) => word.replace(/[^a-zA-Z]/g, ""))
    .filter(
      (word) => !stopwords.includes(word.toLowerCase()) && word.length > 4
    );

  const highlightedWords = new Set();
  const selectedWords = [];

  for (const word of candidates) {
    if (!highlightedWords.has(word.toLowerCase())) {
      selectedWords.push(word);
      highlightedWords.add(word.toLowerCase());
    }
    if (selectedWords.length >= numToHighlight) break;
  }

  return words
    .map((word) => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, "");
      if (selectedWords.includes(cleanWord)) {
        return `<span class="highlight" style="color: ${highlightColor};" onclick="${onClickHandler}('${cleanWord}')">${word}</span>`;
      }
      return word;
    })
    .join(" ");
}

// Fetch synonyms and definitions from APIs
async function fetchWordDetails(word) {
  const merriamApiKey = "1cf60e33-e2e6-4a59-ba71-4a487661d9ec";
  const merriamUrl = `https://www.dictionaryapi.com/api/v3/references/sd4/json/${word}?key=${merriamApiKey}`;
  const datamuseUrl = `https://api.datamuse.com/words?rel_syn=${word}`;

  try {
    const [merriamResponse, datamuseResponse] = await Promise.all([
      fetch(merriamUrl),
      fetch(datamuseUrl),
    ]);

    const merriamData = await merriamResponse.json();
    const datamuseData = await datamuseResponse.json();

    const phonetic = merriamData[0]?.hwi?.prs[0]?.mw || "N/A";
    const audio = merriamData[0]?.hwi?.prs[0]?.sound?.audio || null;
    const definitions = merriamData.map((entry) => ({
      partOfSpeech: entry.fl || "Other definition:",
      definition: entry.shortdef.join(", "),
    }));
    const synonyms = datamuseData.map((item) => item.word);

    return { phonetic, audio, definitions, synonyms };
  } catch (error) {
    console.error("Error fetching word details:", error);
    return {
      phonetic: "Error",
      audio: null,
      definitions: [
        { partOfSpeech: "Error", definition: "Error fetching details." },
      ],
      synonyms: ["Error fetching synonyms."],
    };
  }
}

// Display word details in a modal or container
function displayWordDetails(word, details) {
  const dictionaryContent = document.getElementById("dictionary-content");
  const { phonetic, audio, definitions, synonyms } = details;

  dictionaryContent.innerHTML = `
    <h4 class="highlighted-word">${word}</h4>
    <p class="phonetic">${phonetic}
      ${
        audio
          ? `<span class="audio-icon" onclick="playAudio('${audio}')">🔊</span>`
          : ""
      }
    </p>
    <p class="synonyms-label"><strong>SYNONYMS:</strong></p>
    <p class="synonyms-entry">${synonyms.join(", ")}</p>
    <p class="definition-label"><strong>Definition:</strong></p>
    ${definitions
      .map(
        ({ partOfSpeech, definition }) => `
      <div class="definition-entry">
        <p class="part-of-speech">${partOfSpeech}</p>
        <p class="definition">${definition}</p>
      </div>
    `
      )
      .join("")}
  `;
}

function playAudio(audioFile) {
  const audio = new Audio(
    `https://media.merriam-webster.com/audio/prons/en/us/mp3/${audioFile[0]}/${audioFile}.mp3`
  );
  audio.play();
}

// Fetch and display quotes
async function getData(query) {
  const apiUrl = `https://favqs.com/api/quotes/?filter=${query}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: 'Token token="31696e37b70e9fbb8fd765ab2bf67b76"',
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching quotes.");
    }

    const data = await response.json();
    const resultsContainer = document.getElementById("results-container");

    resultsContainer.innerHTML = "";

    if (data.quotes.length === 0) {
      resultsContainer.textContent = "No quotes found.";
      return;
    }

    // Add the search results header
    const searchLabel = document.createElement("h2");
    searchLabel.classList.add("search-label");
    searchLabel.textContent = `Search Results for "${query}"`;
    resultsContainer.appendChild(searchLabel);

    const { gradient, highlight } = getColorsForEmotion(query);

    data.quotes.forEach(({ body, author }) => {
      const quoteElement = document.createElement("div");
      quoteElement.classList.add("quote-item");

      const highlightedQuote = highlightWords(
        body,
        highlight,
        "handleWordClick"
      );

      const quoteText = document.createElement("p");
      quoteText.innerHTML = `"${highlightedQuote}"`;
      quoteText.classList.add("quote-text");

      const authorText = document.createElement("p");
      authorText.textContent = author;
      authorText.classList.add("quote-author");
      authorText.style.background = gradient;

      quoteElement.appendChild(quoteText);
      quoteElement.appendChild(authorText);
      resultsContainer.appendChild(quoteElement);

      document.querySelectorAll(".highlight").forEach((span) =>
        span.addEventListener("click", async (e) => {
          const word = e.target.textContent;
          const details = await fetchWordDetails(word);
          displayWordDetails(word, details);
        })
      );
    });

    // Check if quotes are present and apply the transform to dictionary container
    if (data.quotes.length > 0) {
      const dictionaryContainer = document.getElementById(
        "dictionary-container"
      );
      dictionaryContainer.style.transform = "translateY(-50%)";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run
const query = new URLSearchParams(window.location.search).get("query");
if (query) getData(query);
else document.getElementById("results-container").textContent = "No query.";
