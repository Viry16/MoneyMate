const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/parse-receipt', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API Key is missing in backend configuration' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the reliable gemini-2.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert OCR receipt parsing AI. 
      Analyze the provided receipt image and extract the following details. 
      Respond ONLY with a valid, clean JSON object (no markdown formatting, no backticks, no comments) that strictly follows this structure:
      {
        "merchant": "Name of the store or merchant",
        "total_amount": 100000, // Total amount as a number, ignoring currency symbols
        "date": "2024-05-24", // Date if found in YYYY-MM-DD format, else null
        "items": [
          {
            "name": "Item name",
            "price": 20000 // Price as a number
          }
        ]
      }
      If you cannot find some details, use null for strings and 0 for numbers.
    `;

    const image = {
      inlineData: {
        // Assume base64 string doesn't include the data URL prefix "data:image/jpeg;base64,"
        data: imageBase64,
        mimeType: "image/jpeg" 
      },
    };

    const result = await model.generateContent([prompt, image]);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting in case Gemini includes ```json
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.slice(0, -3);
      }
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.substring(3);
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.slice(0, -3);
      }
    }
    
    const parsedData = JSON.parse(cleanJson);
    
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error parsing receipt:', error);
    res.status(500).json({ error: 'Failed to parse receipt. Please try again or check API Key.' });
  }
});

router.post('/parse-text', async (req, res) => {
  try {
    const { text, multiple } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API Key is missing in backend configuration' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a smart financial assistant. Analyze the following user input and convert it into structured transaction data.
      The input might be a single transaction or multiple lines of transactions.
      
      User input: "${text}"
      
      Extract the following details for EACH transaction found:
      - title: The name of the item, merchant, or description (e.g. "laundry bebas", "kopi kenangan", "gaji").
      - amount: The monetary amount as a pure number. Understand abbreviations like "rb" (thousands) and "jt" (millions). E.g. "50rb" -> 50000, "3jt" -> 3000000, "37000" -> 37000.
      - type: "expense" if it sounds like spending, "income" if it sounds like receiving money (e.g. "gaji", "bonus", "diberi").
      - category: A short 1-2 word category (e.g. "Food", "Shopping", "Salary", "Transport", "Bills").
      
      Respond ONLY with a valid, clean JSON object (no markdown formatting, no backticks) that strictly follows this structure:
      {
        "transactions": [
          {
            "title": "laundry bebas",
            "amount": 37000,
            "type": "expense",
            "category": "Laundry"
          }
        ]
      }
    `;

    const result = await model.generateContent([prompt]);
    const responseText = result.response.text();
    
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.slice(0, -3);
      }
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.substring(3);
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.slice(0, -3);
      }
    }
    
    const parsedData = JSON.parse(cleanJson);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error parsing text:', error);
    res.status(500).json({ error: 'Failed to parse text.' });
  }
});

module.exports = router;
