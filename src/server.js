import express from "express";
import fetch from "node-fetch";
const app = express();

app.get("/proxyImage", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const imageBlob = await response.buffer();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", response.headers.get("content-type"));
    res.send(imageBlob);
  } catch (error) {
    res.status(500).send("Error proxying the image");
  }
});

app.get("/", (req, res) => {
  res.send({ hello: "world" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
