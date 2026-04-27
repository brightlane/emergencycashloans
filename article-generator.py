import os
import random
import shutil
from datetime import datetime

# CONTENT POOL - MAXLEND FOCUS
INTROS = [
    "Need a financial bridge to get you to your next payday?",
    "When unexpected bills arrive, having access to flexible funding is a game-changer.",
    "MaxLend offers a way to manage your cash flow without the long-term commitment of traditional loans.",
    "Exploring short-term funding in 2026? Here is how to navigate your options safely."
]

STRATEGIES = [
    "Our approach focuses on rapid approval and radical transparency in the lending space.",
    "MaxLend provides a membership-based stress-free way to access the funds you need today.",
    "By verifying your status through our secure portal, you get immediate feedback on your funding eligibility."
]

# MAXLEND AFFILIATE CTA
# Using your LinkConnector base logic
MAXLEND_LINK = "https://www.linkconnector.com/ta.php?lc=007949054182005142&atid=MaxLendDirect"

CTA_BLOCKS = [
    f"<div class='cta-box'><h4>Need Cash Fast?</h4><p>Check your MaxLend eligibility in minutes. Funds can be available as soon as the same day.</p><a href='{MAXLEND_LINK}' class='btn'>Apply at MaxLend</a></div>",
    f"<div class='cta-box'><h4>MaxLend Cash Bridge</h4><p>Join the members who use MaxLend for flexible, short-term financial solutions.</p><a href='{MAXLEND_LINK}' class='btn'>Get Started with MaxLend</a></div>"
]

def clear_old_pages(target_dir):
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    os.makedirs(target_dir)

def generate_descrambled_content(keyword):
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    blocks = [
        f"<section><h2>How {keyword} Works</h2><p>{random.choice(INTROS)}</p></section>",
        f"<section><h3>The MaxLend Advantage</h3><p>{random.choice(STRATEGIES)}</p></section>",
        f"<section><div class='verify-tag'><strong>Last Sync:</strong> {date_str} | MaxLend Partner Verified</div></section>",
        random.choice(CTA_BLOCKS) # Shuffles the MaxLend link into the content
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
    <title>{keyword} | Fast Funding Solutions</title>
    <style>
        body{{font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;line-height:1.6;padding:40px;max-width:850px;margin:auto;color:#333;}}
        .cta-box{{background:#f0f7f0;padding:25px;border-radius:12px;border:2px solid #28a745;margin:25px 0;text-align:center;}}
        .btn{{background:#28a745;color:white;padding:12px 25px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;}}
        .verify-tag{{font-size:0.85em;color:#777;font-style:italic;}}
        h1{{color:#2c3e50;}}
    </style>
</head>
<body>
    <h1>{keyword}</h1>
    {content}
    <hr>
    <footer>© 2026 EmergencyCashLoans | {keyword} Resource</footer>
</body>
</html>
"""
    filename = os.path.join(target_dir, f"{keyword.lower().replace(' ', '-')}.html")
    with open(filename, 'w') as f:
        f.write(html)

def run_vulture_engine():
    target_dir = 'pages'
    keyword_file = 'keywords.txt'
    clear_old_pages(target_dir)
    
    if not os.path.exists(keyword_file): return

    with open(keyword_file, 'r') as f:
        keywords = [line.strip() for line in f if line.strip()]

    for kw in keywords:
        build_page(kw, target_dir)
    print(f"🏁 Generated {len(keywords)} MaxLend-optimized pages.")

if __name__ == "__main__":
    run_vulture_engine()
