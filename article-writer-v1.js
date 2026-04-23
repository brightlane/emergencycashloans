#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(process.cwd(), "articles");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 🔗 Affiliate links (keep clean + rotated)
const MAXLEND =
  "https://www.linkconnector.com/ta.php?lc=007949096598005765&atid=MaxlendeMergency";

const ROUNDSKY =
  "https://www.rnd3.com/ai/iframeRedirect.php?id=6AVVLZYHzfkHt4BOrsmmT2cyrXBjmNrJSlCWKYd1G4w.&subId=[SUB_ID_VALUE]&subId2=[SUB_ID2_VALUE]&subId3=[clickId]&firstName=[firstName]&lastName=[lastName]&email=[email]";

// 🎯 SEO keyword clusters (high intent)
const clusters = [
  "emergency cash loans explained",
  "how fast personal loans work",
  "bad credit loan options",
  "instant cash advance guide",
  "online lending safety tips"
];

// 🧠 Article structure engine (NOT spam, structured SEO)
function generateArticle(keyword, link) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${keyword} - Complete Guide</title>
  <meta name="description" content="In-depth guide about ${keyword}">
</head>

<body style="font-family: Arial; max-width: 900px; margin: auto; line-height: 1.6;">

<h1>${keyword}</h1>

<p>
Understanding <b>${keyword}</b> is important if you're exploring financial flexibility and short-term funding options.
This guide breaks everything down in a clear, practical way.
</p>

<h2>What You Should Know</h2>
<p>
Many people search for ${keyword} when facing urgent financial needs.
The key is understanding terms, approval speed, and repayment structure.
</p>

<h2>How It Works</h2>
<p>
Most modern lending systems use automated approval models that evaluate income, credit behavior, and application details.
This makes access faster compared to traditional banks.
</p>

<h2>Choosing the Right Option</h2>
<p>
Before committing, always compare fees, repayment schedules, and approval speed.
Not all providers are the same.
</p>

<h2>Recommended Resource</h2>
<p>
If you want to explore options further, you can review trusted lending platforms here:
</p>

<p>
<a href="${link}" target="_blank">Check lending options</a>
</p>

<h2>Final Thoughts</h2>
<p>
The key to using <b>${keyword}</b> effectively is understanding your repayment ability and choosing transparent lenders.
Always make informed financial decisions.
</p>

</body>
</html>
`;
}

// 🚀 Generate multiple SEO pages
clusters.forEach((kw, i) => {
  const link = i % 2 === 0 ? MAXLEND : ROUNDSKY;
  const fileName = kw.replace(/\s+/g, "-").toLowerCase();

  const article = generateArticle(kw, link);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${fileName}.html`),
    article
  );

  console.log("Generated:", fileName);
});

console.log("✅ High-quality SEO articles created");
