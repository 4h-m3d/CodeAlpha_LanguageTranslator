import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Azure Translator API details
const apiKey = process.env.AZURE_TRANSLATOR_KEY;
const endpoint = "https://api.cognitive.microsofttranslator.com";
const region = process.env.AZURE_REGION;

// Validate credentials before starting server
if (!apiKey || !region) {
  console.error("❌ Missing Azure Translator credentials. Check your .env file.");
  process.exit(1);
}

// Translation endpoint
app.post("/translate", async (req, res) => {
  const { text, source, target } = req.body;

  try {
    const response = await axios.post(
      `${endpoint}/translate?api-version=3.0&from=${source}&to=${target}`,
      [{ Text: text }],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Ocp-Apim-Subscription-Region": region,
          "Content-type": "application/json",
        },
      }
    );

    const translation = response.data[0]?.translations?.[0]?.text || "";
    res.json({ translation });
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

// Configurable port (default 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
