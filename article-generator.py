import os
import random
from datetime import datetime

# 1. CONTENT POOL: Add as many variations as you want here
INTROS = [
    "Navigating emergency expenses in 2026 requires a clear strategy.",
    "When you need funding fast, understanding your local options is critical.",
    "Financial hurdles happen; finding a reliable path forward shouldn't be the hard part.",
    "Immediate liquidity is essential for modern financial flexibility."
]

STRATEGIES = [
    "Our Radical Transparency protocol ensures you see the full picture.",
    "By utilizing automated sync, we verify data points in real-time.",
    "We cut through the noise to deliver specific, actionable financial insights."
]

CLOSINGS = [
    "Stay informed and stay ahead of your financial needs.",
    "Your path to stability starts with a single, informed decision.",
    "Explore our other guides for more 2026 financial planning tips."
]

def generate_descrambled_content(keyword):
    """Creates a unique layout and text string for each keyword."""
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    # Randomly pick components
    intro = random.choice(INTROS)
    strategy = random.choice(STRATEGIES)
    closing = random.choice(CLOSINGS)
    
    # Define Content Blocks
    blocks = [
        f"<section class='info'><h2>Understanding {keyword}</h2><p>{intro}</p></section>",
        f"<section class='strategy'><h3>The 2026 Approach</h3><p>{strategy}</p></section>",
        f"<section class='verification'><div class='box'>Verified by Professor Owl: {date_str}</div></section>",
        f"<section class='cta'><h4>Next Steps for {keyword}</h4><p>{closing}</p></section>"
    ]
    
    # SHUFFLE: This is the 'descramble' magic. The HTML order changes every time.
    random.shuffle(blocks)
    return "\n".join(blocks)

def build_page(keyword):
    content = generate_descrambled_content(keyword)
    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{keyword} | Emergency Cash Guide</title>
    <meta name="description" content="Fresh insights on {keyword}. Updated {datetime.now().year}.">
    <style>body{{font-family:sans-serif;line-height:1.6;max-width:800px;margin:auto;padding:20px;}} .box{{border:1px solid #ddd;padding:10px;background:#f9f9f9;}}</style>
</head>
<body>
    <h1>{keyword}</h1>
    <article>
        {content}
    </article>
    <footer>© 2026 BrightLane | {keyword} Portal</footer>
</body>
</html>
"""
    # Create the pages directory if it doesn't exist
    if not os.path.exists('pages'):
        os.makedirs('pages')
        
    filename = f"pages/{keyword.lower().replace(' ', '-')}.html"
    with open(filename, 'w') as f:
        f.write(html)
    print(f"✅ Generated Descrambled Page: {filename}")

# Run for a test keyword
if __name__ == "__main__":
    # You can loop through your keywords.txt here
    test_keywords = ["Emergency Loans", "Fast Cash", "Quick Credit"]
    for kw in test_keywords:
        build_page(kw)
