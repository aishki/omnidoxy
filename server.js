const corsAnywhere = require("cors-anywhere");

// Create a new CORS Anywhere server
const server = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ["origin", "x-requested-with"],
  removeHeaders: ["cookie", "cookie2"],
});

// Start the server on port 8080
server.listen(8080, "0.0.0.0", () => {
  console.log("CORS Anywhere server is running on http://localhost:8080");
});
