const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google Indexing API setup
const indexing = google.indexing('v3');

// Function to generate an article
async function generateArticle(keyword = 'emergency cash loan') {
  const prompt = `
  Write a high-quality blog article with the following specifications:
  - Topic: ${keyword}
  - 1500-2500 words
  - SEO optimized, human-readable, and without keyword stuffing
  - Structure:
    1. Introduction
    2. Problem explanation
    3. Step-by-step guide
    4. Tools section (mention JungleScout and MaxLend naturally)
    5. Mistakes to avoid
    6. Conclusion with actionable advice
  Affiliate requirement:
    - Mention the affiliate links:
      - JungleScout: https://get.junglescout.com/wloofjbvk5mp
      - MaxLend: https://www.lightningmoneyloans.com?id=6AVVLZYHzfkHt4BOrsmmT2cyrXBjmNrJSlCWKYd1G4w.&subId=SUB_ID_VALUE&subId2=SUB_ID2_VALUE&subId3=clickId
  `;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  return res.choices[0].message.content;
}

// Function to save the article as an HTML file with SEO metadata
async function saveArticle(title, content) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filePath = path.join(__dirname, 'posts', `${slug}.html`);

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${title}">
    <meta name="keywords" content="emergency loan, bad credit loan, JungleScout, MaxLend, fast cash loan">
    <meta name="author" content="Emergency Cash Loans">
    <meta name="robots" content="index, follow">
    <title>${title}</title>
  </head>
  <body>
    <article>
      <h1>${title}</h1>
      <div>${content.replace(/\n/g, '<br>')}</div>
    </article>
  </body>
  </html>
  `;

  // Write the article to the disk
  fs.writeFileSync(filePath, html);
  return filePath;
}

// Function to submit URL to Google Indexing API
async function submitToGoogle(url) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'path_to_your_service_account_key.json',
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const client = await auth.getClient();
  const res = await indexing.urlNotifications.publish({
    requestBody: {
      url: url,
      type: 'URL_UPDATED',
    },
    auth: client,
  });
  console.log('Submitted to Google:', res.data);
}

// Main function to generate and save articles
async function runGenerator() {
  const keywords = [
    'best emergency cash loans',
    'personal loan options for bad credit',
    'how to get fast loans online',
    'maxlend loan review',
    'roundtree lending services',
  ];

  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const article = await generateArticle(keyword);
  const articlePath = await saveArticle(keyword, article);

  console.log('Generated article:', articlePath);

  // Submit the article URL to Google for indexing
  const articleUrl = `https://yourdomain.com/posts/${path.basename(articlePath)}`;
  await submitToGoogle(articleUrl);
  console.log('Article submitted to Google for indexing:', articleUrl);
}

// Run the generator when the script is executed
runGenerator();

// Optional: Set up a cron job for continuous article generation
// For example, you can set a cron job in the server to run this script every hour
