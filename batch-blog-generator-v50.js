#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const OUTPUT = path.join(process.cwd(), "output/posts");
fs.mkdirSync(OUTPUT, { recursive: true });

const MAXLEND =
  "https://www.linkconnector.com/ta.php?lc=007949096598005765&atid=MaxlendeMergency";

const ROUND_SKY =
  "https://www.rnd3.com/ai/iframeRedirect.php?id=6AVVLZYHzfkHt4BOrsmmT2cyrXBjmNrJSlCWKYd1G4w.&subId=[SUB_ID_VALUE]&subId2=[SUB_ID2_VALUE]&subId3=[clickId]&firstName=[firstName]&lastName=[lastName]&email=[email]";

// SEO keyword pool
const topics = [
  "emergency cash loans explained",
  "fast approval personal loans",
  "bad credit loan options",
  "instant funding solutions",
  "alternative lending platforms",
  "how emergency loans work",
  "quick cash advance guide"
];

// 50 posts/day generator
const POSTS_PER_DAY = 50;

function pick(i) {
  return topics[i % topics.length];
}

function buildArticle(i) {
  const topic = pick(i);

  const slug = `${topic.replace(/\s+/g, "-")}-${i}.html`;

  const affiliate =
    i % 7 === 0 ? ROUND_SKY : MAXLEND; // fallback rotation logic

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${topic}</title>
  <meta name="description" content="Guide on ${topic}">
</head>

<body style="font-family:Arial; max-width:900px; margin:auto;">

<h1>${topic.toUpperCase()}</h1>

<p>
This article explains ${topic} in detail, including how approval works,
what lenders look for, and how to choose the right financial option.
</p>

<h2>Overview</h2>
<p>
Many users searching for ${topic} are looking for fast financial solutions.
Understanding the process helps avoid mistakes and delays.
</p>

<h2>Key Considerations</h2>
<ul>
<li>Loan approval requirements vary</li>
<li>State restrictions may apply</li>
<li>Repayment terms should always be reviewed</li>
</ul>

<h2>Recommended Option</h2>
<p>
<a href="${affiliate}" target="_blank">Click here to continue application</a>
</p>

<h2>Conclusion</h2>
<p>
Always compare options before committing to any financial agreement.
Responsible borrowing is important for long-term stability.
</p>

</body>
</html>
`;
}

console.log("🚀 Generating 50 blog posts...");

for (let i = 0; i < POSTS_PER_DAY; i++) {
  const file = buildArticle(i);
  const topic = pick(i);
  const filename = `${topic.replace(/\s+/g, "-")}-${i}.html`;

  fs.writeFileSync(path.join(OUTPUT, filename), file);
}

console.log("✅ DONE: 50 blog posts generated");
