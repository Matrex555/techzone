import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config(); // .env ფაილიდან ვიტვირთავთ კონფიგურაციას

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// გამორთულია, თუ BOT_TOKEN ან CHAT_ID არ არის .env-ში ჩაწერილი
if (!BOT_TOKEN || !CHAT_ID) {
  console.error("გთხოვ შეამოწმე .env ფაილი: BOT_TOKEN და CHAT_ID სავალდებულოა!");
  process.exit(1); // პროგრამა დახუროს შეცდომით
}

app.post("/send", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "შეტყობინება აუცილებელია" });
    }

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`სერვერი გაშვებულია პორტზე ${PORT}`);
});
