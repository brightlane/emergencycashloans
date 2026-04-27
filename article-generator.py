import os
import random
import shutil
import re 
from datetime import datetime

# 1. MAXLEND CONFIG
MAXLEND_URL = "https://www.linkconnector.com/ta.php?lc=007949054182005142&atid=MaxLendDirect"

def generate_html(keyword):
    date_str = datetime.now().strftime("%B %d, 2026")
    sections = [
        f"<section><h2>{keyword} Insights</h2><p>Managing {keyword} in 2026 requires speed. MaxLend offers a membership-based bridge for your short-term needs.</p></section>",
        f"<div style='background:#f1f8f4;padding:25px;border:2px solid #28a745;border-radius:10px;text-align:center;'>"
        f"<h3>Official MaxLend Funding</h3><p>Secure, fast, and transparent.</p>"
        f"<a href='{MAXLEND_URL}' style='background:#28a745;color:white;padding:12px 25px;text-decoration:none;border-radius:5px;font-weight:bold;'>Check Eligibility</a></div>",
        f"<p style='font-size:0.8em;color:#999;text-align:center;'>Status: Active | Verified {date_str}</p>"
    ]
    random.shuffle(sections)
    return f"<html><body style='font-family:sans-serif;max-width:800px;margin:auto;padding:50px;'><h1>{keyword}</h1>{''.join(sections)}</body></html>"

def main():
    target_dir = 'pages'
    if os.path.exists(target_dir): shutil.rmtree(target_dir)
    os.makedirs(target_dir)

    keywords = ["Emergency Cash"]
    if os.path.exists('keywords.txt'):
        with open('keywords.txt', 'r', encoding='utf-8') as f:
            keywords = [line.strip() for line in f if line.strip()]

    for kw in keywords:
        html = generate_html(kw)
        # Fixes the '/' error: deletes any characters that aren't letters, numbers, or dashes
        safe_name = re.sub(r'[^a-zA-Z0-9\s-]', '', kw.lower()).strip().replace(' ', '-')
        with open(f"{target_dir}/{safe_name}.html", 'w', encoding='utf-8') as f:
            f.write(html)
    print(f"🏁 Built {len(keywords)} MaxLend pages.")

if __name__ == "__main__":
    main()
