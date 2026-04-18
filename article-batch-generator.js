const fs = require("fs");

const baseUrl = "https://brightlane.github.io/emergencycashloans";

const topics = [
  {
    slug: "cash-advance-guide",
    title: "Complete Guide to Cash Advances",
    intent: "informational"
  },
  {
    slug: "payday-loans-explained",
    title: "How Payday Loans Work Explained",
    intent: "informational"
  },
  {
    slug: "installment-loans-guide",
    title: "Installment Loans Explained Step by Step",
    intent: "informational"
  },
  {
    slug: "emergency-cash-options",
    title: "Best Emergency Cash Options Available",
    intent: "comparison"
  },
  {
    slug: "fast-loan-approval-tips",
    title: "How to Improve Fast Loan Approval Chances",
    intent: "educational"
  }
];

// LIMIT DAILY OUTPUT (quality control)
const MAX_ARTICLES_PER_RUN = 5;

function buildArticle(topic, all) {
  const links = all
    .filter(t => t.slug !== topic.slug)
    .map(t => `<li><a href="${baseUrl}/pages/${t.slug}.html">${t.title}</a></li>`)
    .join("\n");

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${topic.title}</title>
  <meta name="description" content="${topic.title} and financial guidance">
  <link rel="canonical" href="${baseUrl}/pages/${topic.slug}.html">
</head>

<body>

<h1>${topic.title}</h1>

<p>
This article explains ${topic.title.toLowerCase()} in a structured, educational format.
It is part of a financial information hub covering short-term funding options.
</p>

<h2>Overview</h2>
<p>
Many users search for information about short-term financial solutions such as cash advances,
payday loans, and installment-based lending options when facing urgent expenses.
</p>

<h2>Key Considerations</h2>
<ul>
  <li>Approval depends on income and verification</li>
  <li>Terms vary by provider</li>
  <li>Interest rates differ significantly</li>
  <li>Always compare options before applying</li>
</ul>

<h2>Related Guides</h2>
<ul>
${links}
</ul>

<h2>Return to Hub</h2>
<p><a href="${baseUrl}/">Back to Emergency Cash Loans Hub</a></p>

</body>
</html>
`;
}

// ensure folder exists
if (!fs.existsSync("pages")) fs.mkdirSync("pages");

topics.slice(0, MAX_ARTICLES_PER_RUN).forEach(topic => {
  const html = buildArticle(topic, topics);
  fs.writeFileSync(`pages/${topic.slug}.html`, html.trim());
});

console.log(`Generated ${Math.min(MAX_ARTICLES_PER_RUN, topics.length)} articles`);
