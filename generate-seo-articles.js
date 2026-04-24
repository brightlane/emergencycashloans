// generate-seo-articles.js

const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

// Google API configuration
const KEY_PATH = 'path/to/your/service-account.json';
const SCOPES = ['https://www.googleapis.com/auth/indexing'];

// Initialize Google Indexing API client
async function authenticateGoogle() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: SCOPES,
  });

  const authClient = await auth.getClient();
  const indexing = google.indexing({ version: 'v3', auth: authClient });
  return indexing;
}

// SEO Meta Tags Injection Logic
function generateSEOArticleMetaTags(title, keyword) {
  const description = `Learn about ${keyword} and how it relates to your business. Discover essential tools like JungleScout and MaxLend for better decision-making.`;
  const metaTags = `
    <meta name="title" content="${title}">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keyword}, JungleScout, MaxLend, Loan, Affiliate, Amazon FBA">
  `;

  return metaTags;
}

// Create and Save Articles with SEO Meta Tags
async function saveSEOArticle(title, content, keyword) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filePath = `./generated_articles/${slug}.html`;

  const seoMetaTags = generateSEOArticleMetaTags(title, keyword);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>${title}</title>
      ${seoMetaTags}
    </head>
    <body>
      <article>
        <h1>${title}</h1>
        <div>${content.replace(/\n/g, "<br>")}</div>
      </article>
    </body>
    </html>
  `;

  fs.writeFileSync(filePath, htmlContent);
  console.log(`Article saved to: ${filePath}`);
  return filePath;
}

// Notify Google via Indexing API
async function notifyGoogleOfNewArticle(url) {
  const indexing = await authenticateGoogle();
  const request = {
    url: url,
    type: 'URL_UPDATED',
  };

  const response = await indexing.urlNotifications.publish(request);
  console.log(`Successfully notified Google for URL: ${url}`);
}

// Generate Articles and Notify Google
async function generateAndNotifyArticles() {
  const articles = [
    { title: 'How to Start Amazon FBA with JungleScout', keyword: 'Amazon FBA, JungleScout' },
    { title: 'Top Loan Options with MaxLend', keyword: 'Loans, MaxLend' },
    // Add more predefined article titles and keywords
  ];

  for (const article of articles) {
    const content = `Content for ${article.title} here...`;  // Generate your article content dynamically or use AI generation
    const filePath = await saveSEOArticle(article.title, content, article.keyword);
    const url = `https://www.example.com/articles/${path.basename(filePath)}`;
    await notifyGoogleOfNewArticle(url); // Notify Google about the new article
  }
}

// Run the article generation and submission
generateAndNotifyArticles();
