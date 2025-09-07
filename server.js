import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// .env ფაილის ჩატვირთვა
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// JSON სხეულების წაკითხვა
app.use(express.json());

// Static ფაილების სერვინგი (public დირექტორიიდან)
app.use(express.static(path.join(__dirname, "public")));

// ENV ცვლადების ამოღება
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// შემოწმება: ხომ გვაქვს .env ცვლადები
if (!BOT_TOKEN || !CHAT_ID) {
  console.error("⛔ გთხოვ, გადაამოწმე .env ფაილი — BOT_TOKEN და CHAT_ID აუცილებელია!");
  process.exit(1);
}

// /send როუტი — იღებს შეტყობინებას და აგზავნის Telegram-ზე
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
      return res.json({ success: true, data });
    } else {
      return res.status(500).json({ success: false, error: "Telegram API-ის შეცდომა: " + data.description });
    }
  } catch (err) {
    console.error("სერვერის შეცდომა:", err);
    return res.status(500).json({ success: false, error: "შეცდომა სერვერთან კავშირში" });
  }
});

// პორტი Vercel-სთვის ან ლოკალურად
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 სერვერი გაშვებულია პორტზე ${PORT}`);
});
