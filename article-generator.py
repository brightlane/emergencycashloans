import os
import random
import shutil
import re
from datetime import datetime

# CONFIG
MAXLEND_URL = "https://www.linkconnector.com/ta.php?lc=007949054182005142&atid=MaxLendDirect"

def generate_html(keyword):
    date_str = datetime.now().strftime("%B %d, 2026")
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{keyword} | MaxLend 2026</title>
    <style>body{{font-family:sans-serif;max-width:800px;margin:auto;padding:50px;line-height:1.6;}}
    .cta{{background:#f1f8f4;padding:25px;border:2px solid #28a745;border-radius:10px;text-align:center;}}</style>
</head>
<body>
    <h1>{keyword}</h1>
    <p>Managing {keyword} in 2026 is about speed and transparency.</p>
    <div class="cta">
        <h3>Official MaxLend Portal</h3>
        <a href="{MAXLEND_URL}" style="color:#28a745;font-weight:bold;">Check Your Eligibility</a>
    </div>
    <p style="font-size:0.8em;color:#999;">Updated: {date_str}</p>
</body>
</html>"""

def main():
    target_dir = 'pages'
    if os.path.exists(target_dir): shutil.rmtree(target_dir)
    os.makedirs(target_dir)

    # Load Keywords
    keywords = ["Emergency Cash"]
    if os.path.exists('keywords.txt'):
        with open('keywords.txt', 'r', encoding='utf-8') as f:
            keywords = [line.strip() for line in f if line.strip()]

    # Limit to 10k for stability if needed, or remove [:10000] to do all 400k+
    for kw in keywords[:10000]: 
        html = generate_html(kw)
        # SANITIZE: Removes slashes and special characters
        safe_name = re.sub(r'[^a-zA-Z0-9\s-]', '', kw.lower()).strip().replace(' ', '-')
        with open(f"{target_dir}/{safe_name}.html", 'w', encoding='utf-8') as f:
            f.write(html)
    print(f"🏁 Built {len(keywords[:10000])} pages.")

if __name__ == "__main__":
    main()
