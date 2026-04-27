const fs = require('fs-extra');
const path = require('path');

// 1. DATA POOL: Varied intros and headers to avoid footprints
const intros = [
    "Navigating financial hurdles can be tough, especially when you need a quick boost.",
    "When unexpected expenses arise, finding a reliable local partner is the first step.",
    "Securing your financial future starts with understanding the tools available right now.",
    "Immediate funding solutions are evolving; here is what you need to know today."
];

const valueProps = [
    "Our protocol prioritizes speed and radical transparency for every user.",
    "We utilize the Vulture 10K sync to ensure data is updated in real-time.",
    "By focusing on verified providers, we cut through the noise of standard searches."
];

// 2. SCRAMBLE LOGIC: Shuffles an array so the order is never the same
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// 3. GENERATOR ENGINE
async function generateDescrambledPage(keyword) {
    const date = new Date().toISOString().split('T')[0];
    const randomIntro = intros[Math.floor(Math.random() * intros.length)];
    const randomProp = valueProps[Math.floor(Math.random() * valueProps.length)];
    
    // Shuffle content sections
    const sections = [
        `<section><h2>Why ${keyword} matters in 2026</h2><p>${randomIntro}</p></section>`,
        `<section><h3>Key Advantages</h3><ul><li>Fast processing</li><li>Secure data</li><li>${randomProp}</li></ul></section>`,
        `<section><div class="trust-box">Verified by Professor Owl on ${date}</div></section>`
    ];
    
    const scrambledContent = shuffle(sections).join('\n');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${keyword} | Emergency Solutions</title>
    <meta name="description" content="Dedicated guide to ${keyword} with real-time updates for 2026.">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header><h1>${keyword}</h1></header>
    <main>
        ${scrambledContent}
    </main>
    <footer>Updated: ${date} | BrightLane Empire</footer>
</body>
</html>`;

    const fileName = `${keyword.toLowerCase().replace(/ /g, '-')}.html`;
    await fs.outputFile(path.join(__dirname, 'pages', fileName), html);
    console.log(`✅ Descrambled & Generated: ${fileName}`);
}

// Example Run
generateDescrambledPage("Emergency Cash Loans");
