import os
import random
import shutil
from datetime import datetime

# 1. CONTENT POOL: Varied text to break footprints
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

def clear_old_pages(target_dir):
    """Deletes the old pages folder to ensure no duplicate or stale content remains."""
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
        print(f"🗑️ Cleared old content in {target_dir}")
    os.makedirs(target_dir)

def generate_descrambled_content(keyword):
    """Creates a unique layout and text string for each keyword."""
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    intro = random.choice(INTROS)
    strategy = random.choice(STRATEGIES)
    closing = random.choice(CLOSINGS)
    
    # Content Blocks: Shuffling these makes the HTML structure unique
    blocks = [
        f"<section><h2>{keyword} Insights</h2><p>{intro}</p></section>",
        f"<section><h3>Strategic Outlook</h3><p>{strategy}</p></section>",
        f"<section><div style='background:#f4f4f4;padding:15px;'><strong>Verified:</strong> {date_str}</div></section>",
        f"<section><h4>Summary</h4><p>{closing}</p></section>"
    ]
    
    random.shuffle(blocks)
    return "\n".join(blocks)

def build_page(keyword, target_dir):
    content = generate_descrambled_content(keyword)
    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{keyword} | Emergency Guide</title>
    <meta name="description" content="Secure and fast insights on {keyword} for 2026.">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <h1>{keyword}</h1>
    {content}
    <footer>© 2026 BrightLane | {keyword} Portal</footer>
</body>
</html>
"""
    filename = os.path.join(target_dir, f"{keyword.lower().replace(' ', '-')}.html")
    with open(filename, 'w') as f:
        f.write(html)

def run_vulture_engine():
    target_dir = 'pages'
    keyword_file = 'keywords.txt'
    
    # Step 1: Wipe the old data
    clear_old_pages(target_dir)
    
    # Step 2: Read keywords
    if not os.path.exists(keyword_file):
        print(f"❌ Error: {keyword_file} not found!")
        return

    with open(keyword_file, 'r') as f:
        keywords = [line.strip() for line in f if line.strip()]

    # Step 3: Generate new unique pages
    print(f"🦅 Vulture Engine: Processing {len(keywords)} keywords...")
    for kw in keywords:
        build_page(kw, target_dir)
    
    print(f"🏁 Successfully generated {len(keywords)} descrambled pages.")

if __name__ == "__main__":
    run_vulture_engine()
