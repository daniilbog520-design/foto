import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import FormData from "form-data";

const app = express();
const PORT = 5000;

const TOKEN = "8305172568:AAEi7RIfghn9e5hMeQ7fNhSx48-zqK9PonI";
const CHAT_ID = "6565594906";

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static("public"));

app.post("/upload", async (req, res) => {
  try {
    const { image } = req.body;

    console.log("Отправка фото в Telegram...");

    // Конвертируем base64 в Buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Создаем FormData для отправки файла
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', imageBuffer, {
      filename: 'photo.jpg',
      contentType: 'image/jpeg',
    });

    // Отправляем фото в Telegram
    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const result = await response.json();
    console.log("Ответ от Telegram API:", JSON.stringify(result, null, 2));

    if (result.ok) {
      console.log("✅ Фото успешно доставлено!");
      res.send("✅ Фото успешно отправлено в Telegram!");
    } else {
      console.error("❌ Ошибка от Telegram API:", result.description);
      res.status(400).send(`❌ Ошибка Telegram: ${result.description}`);
    }
  } catch (err) {
    console.error("❌ Ошибка при отправке:", err.message);
    res.status(500).send("Ошибка при отправке фото.");
  }
});

app.listen(PORT, "0.0.0.0", () => console.log(`✅ Сервер запущен на порту ${PORT}`));
