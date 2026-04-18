const fs = require("fs");

const baseUrl = "https://brightlane.github.io/emergencycashloans";

const topics = [
  {
    slug: "how-to-get-cash-advances",
    title: "How to Get Cash Advances",
    keywords: ["cash advance", "instant cash advance", "emergency cash"]
  },
  {
    slug: "how-to-get-payday-loans",
    title: "How to Get Payday Loans",
    keywords: ["payday loans", "fast payday loan", "short term loan"]
  },
  {
    slug: "how-to-get-installment-loans",
    title: "How to Get Installment Loans",
    keywords: ["installment loans", "monthly loan repayment", "personal loan"]
  },
  {
    slug: "how-to-get-cash-loans",
    title: "How to Get Cash Loans",
    keywords: ["cash loans", "quick loan approval", "online loans"]
  }
];

function articleBody(topic, allTopics) {
  const links = allTopics
    .filter(t => t.slug !== topic.slug)
    .map(t => `<li><a href="${baseUrl}/pages/${t.slug}.html">${t.title}</a></li>`)
    .join("\n");

  return `
<h1>${topic.title}</h1>

<p>
This guide explains everything you need to know about ${topic.title.toLowerCase()}.
It covers eligibility, application steps, approval factors, and alternatives.
</p>

<h2>Understanding the Process</h2>
<p>
Many users search for ${topic.keywords.join(", ")} when they need fast financial support.
Approval usually depends on income verification, employment status, and lender requirements.
</p>

<h2>Steps to Apply</h2>
<ul>
  <li>Check eligibility requirements</li>
  <li>Submit an online application</li>
  <li>Provide income or employment details</li>
  <li>Wait for approval decision</li>
</ul>

<h2>Important Considerations</h2>
<p>
Always compare multiple providers before choosing a loan option.
Interest rates, repayment terms, and fees can vary significantly.
</p>

<h2>Related Guides</h2>
<ul>
${links}
</ul>

<h2>Back to Hub</h2>
<p>
<a href="${baseUrl}/">Return to Emergency Cash Loans Hub</a>
</p>
`;
}

if (!fs.existsSync("pages")) fs.mkdirSync("pages");

topics.forEach(topic => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${topic.title}</title>
  <meta name="description" content="${topic.title} guide and information">
  <link rel="canonical" href="${baseUrl}/pages/${topic.slug}.html">
</head>
<body>
${articleBody(topic, topics)}
</body>
</html>
`;

  fs.writeFileSync(`pages/${topic.slug}.html`, html.trim());
});

console.log("Articles generated:", topics.length);
