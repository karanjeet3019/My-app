import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Analyze URL
  app.post("/api/analyze", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract basic structure markers
      const sections: string[] = [];
      
      // Look for Shopify common section patterns
      $('[id^="shopify-section-"], .shopify-section, section').each((_, el) => {
        const id = $(el).attr('id') || $(el).attr('class') || el.tagName;
        const text = $(el).text().trim().substring(0, 200).replace(/\s+/g, ' ');
        sections.push(`Section: ${id} | Content Preview: ${text}`);
      });

      const title = $('title').text();
      const metaDescription = $('meta[name="description"]').attr('content') || "";

      res.json({
        success: true,
        data: {
          title,
          metaDescription,
          sections: sections.filter(s => s.length > 20).slice(0, 15), // Limiting for AI context
          rawHtmlHead: $('head').html()?.substring(0, 1000)
        }
      });
    } catch (error: any) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: "Failed to fetch or parse URL" });
    }
  });

  // API Route: Remix Page
  app.post("/api/remix", async (req, res) => {
    const { analysis, rebrandData, mode } = req.body;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        You are an expert Shopify Merchant Strategist and Copywriter.
        A user wants to "remix" a product page or store based on an existing structure.
        
        GOAL: Rebuild the page/store with the SAME block sequence and conversion flow, but with COMPLETELY FRESH content.
        NO COPYRIGHT INFRINGEMENT: Do not copy the original brand name, copyrighted text, or specific trademarked claims.
        
        ORIGINAL ANALYSIS:
        - Title: ${analysis.title}
        - Description: ${analysis.metaDescription}
        - Sections Detected: ${analysis.sections.join('\n')}
        
        USER PREFERENCES (REBRANDING):
        ${JSON.stringify(rebrandData, null, 2)}
        
        REMIX MODE: ${mode} (product_page or full_store)
        
        OUTPUT REQUIREMENTS:
        Return a JSON object with:
        1. "remixedSections": An array of objects, one for each major section.
           Each object should have:
           - type: (e.g., hero, product_info, benefits, reviews, faq, comparison, trust_badges)
           - originalDescription: (from analysis)
           - newHeadline: (compelling, sales-focused)
           - newCopy: (the body text for that section)
           - cta: (button text)
           - aiImagePrompt: (A detailed, realistic prompt for an AI image generator to replace the original image. Same angle/style, new branding/models).
        2. "branding": { storeName, productTitle, colorPalette, tone }
        3. "policyPages": { shipping, refund, privacy, terms } (Brief summaries)
        4. "adCreative": { metaAdCopy, tiktokScript }
        5. "liquidCodeSnippet": (A sample Shopify Liquid snippet for the main structure)
        
        Be creative but follow the layout conversion strategy exactly bit-by-bit.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Attempt to parse JSON from Markdown block if necessary
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const remixData = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };

      res.json({ success: true, data: remixData });
    } catch (error: any) {
      console.error("AI error:", error);
      res.status(500).json({ error: "Failed to generate remix" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
