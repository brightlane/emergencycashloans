const fs = require("fs");

// =========================
// CORE SEEDS (kept clean)
// =========================
const seeds = [
  "emergency cash loans",
  "fast payday loans",
  "no credit check loans",
  "instant cash advance",
  "need money now",
  "quick cash loans",
  "urgent money help",
  "same day loans",
  "emergency loan online",
  "fast cash approval",
  "bad credit loans",
  "short term loans"
];

// =========================
// INTENTS (expanded logic layer)
// =========================
const intents = [
  "apply", "get", "check eligibility", "learn about",
  "compare", "request", "find", "secure", "access",
  "apply online", "get approved", "get cash",
  "receive funds", "start application", "borrow today"
];

// =========================
// MODIFIERS (expanded 10× scale driver)
// =========================
const modifiers = [
  "fast", "instant", "urgent", "same day", "online",
  "quick", "easy", "no credit check", "bad credit",
  "24/7", "direct deposit", "emergency", "instant decision",
  "hassle free", "no paperwork", "rapid", "express",
  "guaranteed", "simple", "immediate"
];

// =========================
// SITUATIONS (expanded real-world triggers)
// =========================
const situations = [
  "rent due", "medical bill", "car repair", "utility bill",
  "unexpected expense", "emergency situation", "overdue payment",
  "household bills", "transport issue", "low income period",
  "job loss", "unemployment", "broken appliance", "home repair",
  "food shortage", "eviction risk", "debt payment",
  "credit card bill", "gas shortage", "urgent travel"
];

// =========================
// GENERATION ENGINE (10× SCALE VIA MULTI-LAYER PERMUTATION)
// =========================
const output = new Set();

function score(keyword) {
  let s = 0;
  if (keyword.includes("urgent")) s += 3;
  if (keyword.includes("emergency")) s += 3;
  if (keyword.includes("apply")) s += 2;
  if (keyword.includes("get")) s += 2;
  if (keyword.includes("no credit")) s += 2;
  if (keyword.includes("same day")) s += 2;
  return s;
}

for (const seed of seeds) {
  for (const intent of intents) {
    for (const situation of situations) {
      for (const mod1 of modifiers) {
        for (const mod2 of modifiers) {

          // avoid duplicate modifier stacking like "fast fast"
          if (mod1 === mod2) continue;

          const keyword = `${mod1} ${mod2} ${intent} ${seed} for ${situation}`.trim();

          // filter low-value junk
          if (score(keyword) < 4) continue;

          output.add(keyword);
        }
      }
    }
  }
}

// =========================
// OUTPUT
// =========================
fs.writeFileSync("keywords.txt", Array.from(output).join("\n"));

console.log("Generated keywords:", output.size);
