import os
import random
import shutil
from datetime import datetime

# 1. MAXLEND CONFIG
MAXLEND_URL = "https://www.linkconnector.com/ta.php?lc=007949054182005142&atid=MaxLendDirect"

def generate_html(keyword):
    date_str = datetime.now().strftime("%B %d, 2026")
    
    # Randomly shuffle the order of these sections to avoid duplicate detection
    sections = [
        f"<section><h2>{keyword} Insights</h2><p>In 2026, managing {keyword} requires a flexible partner. MaxLend provides membership-based funding to help you bridge the gap.</p></section>",
        f"<div style='background:#f1f8f4;padding:25px;border:2px solid #28a745;border-radius:10px;'>"
        f"<h3>Official MaxLend Funding</h3><p>Check your eligibility today for a secure cash bridge.</p>"
        f"<a href='{MAXLEND_URL}' style='color:#28a745;font-weight:bold;font-size:1.2em;'>Apply Now</a></div>",
        f"<p style='font-size:0.8em;color:#999;'>Verified Status: Active | Last Updated {date_str}</p>"
    ]
    random.shuffle(sections)
    
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{keyword} | MaxLend Guide</title>
    <style>body{{font-family:sans-serif;max-width:800px;margin:auto;padding:50px;line-height:1.6;}}</style>
</head>
<body>
    <h1>{keyword}</h1>
    {" ".join(sections)}
    <hr>
    <footer>© 2026 EmergencyCashLoans</footer>
</body>
</html>"""

def main():
    # Clean the pages directory
    if os.path.exists('pages'): shutil.rmtree('pages')
    os.makedirs('pages')

    # Load keywords from your keywords.txt
    if os.path.exists('keywords.txt'):
        with open('keywords.txt', 'r') as f:
            keywords = [line.strip() for line in f if line.strip()]
    else:
        keywords = ["Emergency Loans", "MaxLend Cash", "Short Term Funding"]

    for kw in keywords:
        html = generate_html(kw)
        with open(f"pages/{kw.lower().replace(' ', '-')}.html", 'w') as f:
            f.write(html)
    print(f"🏁 Vulture complete: {len(keywords)} MaxLend pages built.")

if __name__ == "__main__":
    main()
