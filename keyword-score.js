function scoreKeyword(k) {
  let score = 0;

  const highIntent = [
    "apply", "approval", "instant", "same day", "urgent",
    "emergency", "fast", "today", "now"
  ];

  const moneyIntent = [
    "loan", "cash", "advance", "money", "funds"
  ];

  highIntent.forEach(w => {
    if (k.includes(w)) score += 3;
  });

  moneyIntent.forEach(w => {
    if (k.includes(w)) score += 2;
  });

  if (k.includes("no credit check")) score += 3;
  if (k.includes("bad credit")) score += 2;

  return score;
}

module.exports = { scoreKeyword };
