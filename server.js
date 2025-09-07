import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("⛔ .env ცვლადები არ არის გამორთული: BOT_TOKEN ან CHAT_ID");
  process.exit(1);
}

app.post("/send", async (req, res) => {
  console.log("📨 /send მოთხოვნა შემოვიდა");
  
  const { message } = req.body;
  console.log("📝 მიღებული შეტყობინება:", message);
  
  if (!message) {
    console.warn("⚠️ შეტყობინება არ არის მოცემული");
    return res.status(400).json({ success: false, error: "შეტყობინება აუცილებელია" });
  }

  try {
    console.log("🚀 Telegram API-ს მოთხოვნის გამოგზავნა...");
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });
    
    console.log("⌛️ პასუხის მიღება Telegram API-დან...");
    const data = await response.json();
    console.log("📥 Telegram API პასუხი:", data);

    if (data.ok) {
      console.log("✅ შეტყობინება წარმატებით გაიგზავნა");
      return res.json({ success: true, data });
    } else {
      console.error("❌ Telegram API error:", data.description);
      return res.status(500).json({ success: false, error: "Telegram API-ის შეცდომა: " + data.description });
    }
  } catch (err) {
    console.error("🚨 სერვერის შეცდომა:", err);
    return res.status(500).json({ success: false, error: "შეცდომა სერვერთან კავშირში" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 სერვერი გაშვებულია პორტზე ${PORT}`);
});
