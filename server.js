// server.js
import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const BOT_TOKEN = "7965775712:AAFbFkyxiYuWg892Rulc02FDAh9rML_FtYI";
const CHAT_ID = "2095571514";

fetch("https://telegram-server.onrender.com/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "გამარჯობა Telegram!" })
});
app.post("/send", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: "შეტყობინება აუცილებელია" });
        }
    const response = await fetch(`https://techzone-f4hj.onrender.com`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
            }),
        });
        const data = await response.json();
        if (data.ok) {
            res.json({ success: true, data });
        } else {
            res.status(500).json({ success: false, error: "Telegram API-ის შეცდომა: " + data.description });
        }
    } catch (err) {
        console.error("სერვერის შეცდომა:", err);
        res.status(500).json({ success: false, error: "შეცდომა სერვერთან კავშირში" });
    }
});

app.listen(3000, () => console.log("🚀 სერვერი გაშვებულია http://localhost:3000-ზე"));
