const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Token token="31696e37b70e9fbb8fd765ab2bf67b76"',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching data.");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
