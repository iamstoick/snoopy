import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("Missing ?url param");
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Fastly-Debug": "1",
        "Pantheon-Debug": "1",
      },
    });
    const headers = {};
    response.headers.forEach((v, k) => (headers[k] = v));
    const body = await response.text();

    res.json({
      url: targetUrl,
      status: response.status,
      headers,
      body,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch target", details: err });
  }
});

app.listen(3000, () => {
  console.log("CORS proxy running on port 3000");
});
