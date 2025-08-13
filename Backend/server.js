import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./Gemini.js";
// import fetch from "node-fetch";
import open from "open";
import { exec } from "child_process";

//we can access all methods of express
const app = express();
//accessing Port
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// app.use(cookieParser());
const port = process.env.PORT || 5000;
//Creating server

//ye niche controller hai
// app.get("/", (req, res) => {
//   res.send("hi");
// });
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// --- New Spotify Desktop Open Route ---
app.get("/play", (req, res) => {
  const song = req.query.song;
  if (!song) {
    return res.status(400).send("❌ Song name is required.");
  }

  // This opens the Spotify desktop app and searches for the song
  open(`spotify:search:${encodeURIComponent(song)}`);

  res.send(`🎵 Searching for "${song}" in Spotify...`);
});

// ✅ NEW: Ping route to warm up backend
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// app.get("/", async (req, res) => {
//   let prompt = req.query.prompt;
//   let data = await geminiResponse(prompt);
//   res.json(data);
// });

app.listen(8000, () => {
  //   (async () => {
  connectDb();
  //   })();
  console.log("Server is started");
});
