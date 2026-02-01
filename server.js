const express = require("express");
const { Redis } = require("@upstash/redis");
const { v4: uuidv4 } = require("uuid");
const path = require("path");


require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

function now(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return Number(req.headers["x-test-now-ms"]);
  }

  return Date.now();
}



app.get("/api/healthz", async (req, res) => {      
  try {
    await redis.ping();
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

app.post("/api/paste", async (req, res) => {          
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds && ttl_seconds < 1) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views && max_views < 1) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const id = uuidv4();
  const expires_at = ttl_seconds ? now(req) + ttl_seconds * 1000 : null;

 const pasteData = {
    content,
    expires_at,
    max_views: max_views ?? null,
    views: 0,
  };

  if (ttl_seconds) {
    await redis.set(`paste:${id}`, pasteData, { ex: ttl_seconds });
  } else {
    await redis.set(`paste:${id}`, pasteData);
  }

  res.status(201).json({
    id,
    url: `${req.protocol}://${req.get("host")}/p/${id}`,
  });
});


app.get("/api/paste/:id", async (req, res) => {
  const paste = await redis.get(`paste:${req.params.id}`);

  if (!paste) {
    return res.status(404).json({ error: "Not found" });
  }

  const time = now(req);

  if (paste.expires_at && time > paste.expires_at) {
    return res.status(404).json({ error: "Time limit expired" });
  }

  if (paste.max_views && paste.views >= paste.max_views) {
    return res.status(404).json({ error: "View limit is reached" });
  }

  paste.views++;
  await redis.set(`paste:${req.params.id}`, paste);

  const timeLeft = paste.expires_at
  ? Math.max(0, Math.floor((paste.expires_at - time) / 1000))
  : null;

  res.json({
    content: paste.content,
    remaining_views: paste.max_views ? paste.max_views - paste.views : null,
    time_left:timeLeft
  });
});


app.get("/p/:id", (req, res) =>{
    res.sendFile(path.join(__dirname, "public","view.html"));
})

const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`server is running on port ${port}.....`)
})

 