const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Set up OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add your OpenAI API key here
});

/**
 * Function to generate high-quality, real SEO articles based on keywords
 * @param {string} keyword - Topic to generate content for
 */
async function generateArticle(keyword) {
  const prompt = `
You are an expert SEO content writer specializing in Amazon FBA and product research. Write a high-quality, SEO-optimized blog article.

Topic: ${keyword}

Requirements:
1. Natural, human-readable tone.
2. Use real and updated data for the content.
3. 1500–2500 words.
4. Include affiliate links for JungleScout and LightningMoneyLoans naturally.

Affiliate links:
- JungleScout: https://get.junglescout.com/wloofjbvk5mp
- LightningMoneyLoans: https://www.lightningmoneyloans.com?id=6AVVLZYHzfkHt4BOrsmmT2cyrXBjmNrJSlCWKYd1G4w.&subId=SUB_ID_VALUE&subId2=SUB_ID2_VALUE&subId3=clickId

Avoid keyword stuffing.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4", // Use GPT-4 model for high-quality content generation
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

/**
 * Function to save article as an HTML file with SEO metadata
 * @param {string} title - Title of the article
 * @param {string} content - Content of the article
 */
function saveArticle(title, content) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const metaDescription = content.substring(0, 160); // Extract description from first 160 characters
  const metaKeywords = "JungleScout, LightningMoneyLoans, Amazon FBA, product research, personal loans"; // Dynamic keywords or predefined

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${metaKeywords}">
  <title>${title}</title>
</head>
<body>
  <article>
    <h1>${title}</h1>
    <div>${content.replace(/\n/g, "<br>")}</div>
  </article>
</body>
</html>
`;

  const filePath = path.join(__dirname, "posts", `${slug}.html`);
  fs.writeFileSync(filePath, htmlContent);

  return filePath;
}

/**
 * Submit article URL to Google Indexing API
 * @param {string} url - The URL to submit to Google for indexing
 */
async function submitToGoogle(url) {
  const googleIndexingUrl = "https://indexing.googleapis.com/v3/urlNotifications:publish";
  const apiKey = process.env.GOOGLE_API_KEY; // Your Google API key here
  const requestPayload = {
    url: url,
    type: "URL_UPDATED", // Can be "URL_ADDED" or "URL_UPDATED"
  };

  try {
    const response = await axios.post(googleIndexingUrl, requestPayload, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });
    console.log("Successfully submitted URL to Google:", response.data);
  } catch (error) {
    console.error("Error submitting to Google:", error);
  }
}

/**
 * Main function to generate and save the article, then submit to Google Index
 */
async function generateAndSaveArticle(keyword) {
  try {
    const articleContent = await generateArticle(keyword);
    const filePath = await saveArticle(keyword, articleContent);

    // Submit the article URL to Google for indexing
    await submitToGoogle(filePath);

    console.log("Article saved and submitted for indexing:", filePath);
  } catch (error) {
    console.error("Error generating or saving article:", error);
  }
}

// Generate and save articles based on predefined keywords
const keywords = [
  "best Amazon FBA products for 2026",
  "how to find winning products on Amazon",
  "JungleScout product research guide",
  "Amazon FBA beginner strategies",
  "low competition Amazon niches"
];

keywords.forEach(keyword => generateAndSaveArticle(keyword));

// Optional: Cron job integration for periodic article generation
// You can set up a cron job to call this function every hour or day to generate new content
