import os
import random
import shutil
from datetime import datetime

# CONTENT POOL - MAXLEND FOCUS
INTROS = [
    "Unexpected expenses don't have to disrupt your financial peace of mind.",
    "Looking for a flexible cash bridge in 2026? MaxLend offers a membership-based solution.",
    "Managing your short-term liquidity is simpler with a reliable, transparent partner.",
    "Accessing funds quickly is all about choosing a financial tool that fits your schedule."
]

STRATEGIES = [
    "MaxLend provides an alternative to traditional lending with a focus on speed.",
    "Our Radical Transparency protocol ensures you understand every step of the funding process.",
    "Get the cash you need today with a repayment plan designed for your next payday."
]

# MAXLEND AFFILIATE URL
MAXLEND_URL = "https://www.linkconnector.com/ta.php?lc=007949054182005142&atid=MaxLendDirect"

def generate_shuffled_html(keyword):
    date_now = datetime.now().strftime("%B %d, 2026")
    
    # These blocks are shuffled to ensure no two pages have the same DOM structure
    blocks = [
        f"<section><h2>{keyword} Insights</h2><p>{random.choice(INTROS)}</p></section>",
        f"<section><h3>The MaxLend Advantage</h3><p>{random.choice(STRATEGIES)}</p></section>",
        f"<div style='background:#f1f8f4;padding:25px;border-radius:10px;border:1px solid #28a745;margin:20px 0;'>"
        f"<h4>Official MaxLend Portal</h4><p>Check eligibility for same-day funding.</p>"
        f"<a href='{MAXLEND_URL}' style='background:#28a745;color:white;padding:12px 25px;text-decoration:none;border-radius:5px;font-weight:bold;'>Apply via MaxLend</a></div>",
        f"<p style='font-size:0.8em;color:#888;'>Content Verified: {date_now} | MaxLend Partner Network</p>"
    ]
    
    random.shuffle(blocks)
    return "\n".join(blocks)

def main():
    target_dir = 'pages'
    
    # 1. Clear old content
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    os.makedirs(target_dir)
    
    # 2. Load Keywords
    keywords = ["Emergency Cash", "MaxLend Loans", "Quick Funding"] # Fallback
    if os.path.exists('keywords.txt'):
        with open('keywords.txt', 'r') as f:
            keywords = [line.strip() for line in f if line.strip()]

    # 3. Generate Descrambled Pages
    for kw in keywords:
        content = generate_shuffled_html(kw)
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{kw} | 2026 Funding Guide</title>
    <style>
        body{{font-family:sans-serif;line-height:1.6;max-width:800px;margin:auto;padding:40px;color:#333;}}
        h1{{color:#1a5d1a;}}
        hr{{border:0;border-top:1px solid #eee;margin:30px 0;}}
    </style>
</head>
<body>
    <h1>{kw}</h1>
    <article>{content}</article>
    <hr>
    <footer>© 2026 EmergencyCashLoans | {kw} Info</footer>
</body>
</html>
"""
        safe_name = kw.lower().replace(' ', '-')
        with open(f"{target_dir}/{safe_name}.html", 'w') as f:
            f.write(html)
            
    print(f"🏁 Successfully generated {len(keywords)} descrambled MaxLend pages.")

if __name__ == "__main__":
    main()
