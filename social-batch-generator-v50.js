#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const OUTPUT = path.join(process.cwd(), "output/social");
fs.mkdirSync(OUTPUT, { recursive: true });

// 🔗 Affiliate links
const MAXLEND =
  "https://www.linkconnector.com/ta.php?lc=007949096598005765&atid=MaxlendeMergency";

const ROUNDSKY =
  "https://www.rnd3.com/ai/iframeRedirect.php?id=6AVVLZYHzfkHt4BOrsmmT2cyrXBjmNrJSlCWKYd1G4w.&subId=[SUB_ID_VALUE]&subId2=[SUB_ID2_VALUE]&subId3=[clickId]&firstName=[firstName]&lastName=[lastName]&email=[email]";

// 🔥 topic pool (expand anytime)
const topics = [
  "emergency cash loans",
  "fast approval loans",
  "bad credit funding options",
  "instant cash advance solutions",
  "alternative lending platforms",
  "how emergency loans work",
  "quick funding tips"
];

const POSTS_PER_DAY = 50;

// rotate style templates to avoid spam detection
const templates = {
  x: [
    (t, l) => `💡 ${t}: here’s what most people miss → ${l}`,
    (t, l) => `⚡ Quick insight on ${t} → ${l}`,
    (t, l) => `🚀 ${t} explained simply → ${l}`
  ],
  reddit: [
    (t, l) => `Sharing a breakdown of ${t} that might help someone: ${l}`,
    (t, l) => `I found this useful guide on ${t}: ${l}`,
    (t, l) => `If you're researching ${t}, this may help: ${l}`
  ],
  linkedin: [
    (t, l) => `Exploring ${t} and modern financial solutions: ${l}`,
    (t, l) => `A structured look at ${t} and how it works: ${l}`,
    (t, l) => `Understanding ${t} in today's lending environment: ${l}`
  ]
};

function pickTopic(i) {
  return topics[i % topics.length];
}

function pickLink(i) {
  // rotation strategy: 80% MaxLend, 20% fallback
  return i % 5 === 0 ? ROUNDSKY : MAXLEND;
}

function pickTemplate(platform, i, topic, link) {
  const arr = templates[platform];
  return arr[i % arr.length](topic, link);
}

let output = [];

for (let i = 0; i < POSTS_PER_DAY; i++) {
  const topic = pickTopic(i);
  const link = pickLink(i);

  output.push({
    id: i + 1,
    topic,
    x: pickTemplate("x", i, topic, link),
    reddit: pickTemplate("reddit", i, topic, link),
    linkedin: pickTemplate("linkedin", i, topic, link)
  });
}

// save JSON pack
fs.writeFileSync(
  path.join(OUTPUT, "social-pack-v50.json"),
  JSON.stringify(output, null, 2)
);

// dashboard
const html = `
<!DOCTYPE html>
<html>
<head>
<title>Social Batch V50</title>
</head>
<body style="font-family:Arial; max-width:900px; margin:auto;">

<h1>🚀 50 Social Posts / Day Engine</h1>

${output
  .map(
    p => `
<h3>#${p.id} — ${p.topic}</h3>

<b>X (Twitter)</b>
<pre>${p.x}</pre>

<b>Reddit</b>
<pre>${p.reddit}</pre>

<b>LinkedIn</b>
<pre>${p.linkedin}</pre>

<hr/>
`
  )
  .join("")}

</body>
</html>
`;

fs.writeFileSync(path.join(OUTPUT, "dashboard.html"), html);

console.log("✅ 50 social posts generated (V50)");
