import random
import os

# Sample seed keywords related to Maxlend and RoundSky
seed_keywords = [
    "personal loans", "emergency loans", "payday loans", "quick cash loans",
    "bad credit loans", "fast approval loans", "online loans", "instant loans",
    "low-interest loans", "cash advance", "short-term loans", "no credit check loans",
    "loan consolidation", "loan repayment", "personal loan options"
]

# Affiliate URLs
maxlend_url = "https://www.maxlend.com/affiliate?tracking=webtraffic"
roundsky_url = "https://www.roundsky.com/affiliate?tracking=webtraffic"

# Locations to localize the keywords
locations = [
    "New York", "California", "Florida", "Texas", "Los Angeles", "Chicago", "Miami", 
    "London", "Paris", "Berlin", "Dubai", "Sydney", "Toronto", "Vancouver"
]

# Related terms for expanding the keywords
related_terms = [
    "fast", "instant", "quick", "affordable", "best", "secure", "easy", "no credit check",
    "emergency", "same day", "cash", "personalized", "unsecured", "low rate", "bad credit"
]

# Output directory for saving generated files
output_dir = "generated_articles"

# Function to generate SEO meta tags and content for each keyword
def generate_meta_tags(keyword, location):
    title = f"{keyword} in {location} | Apply for Fast Loans"
    description = f"Looking for {keyword} in {location}? Find the best {keyword} offers with fast approval. Apply for a loan today with {location} options."
    keywords = f"{keyword}, {location} loans, {related_terms}, emergency loans, personal loans"
    
    # Include affiliate URLs
    content = f"Get {keyword} in {location} now. Apply with {maxlend_url} or {roundsky_url}. Fast approval with low rates!"

    return {
        "title": title,
        "description": description,
        "keywords": keywords,
        "content": content,
    }

# Function to generate HTML file for each keyword
def generate_html(keyword, location):
    meta_tags = generate_meta_tags(keyword, location)

    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{meta_tags['description']}">
    <meta name="keywords" content="{meta_tags['keywords']}">
    <meta property="og:title" content="{meta_tags['title']}">
    <meta property="og:description" content="{meta_tags['description']}">
    <meta property="og:url" content="https://www.example.com/{keyword.replace(' ', '-')}-in-{location.lower()}">
    <title>{meta_tags['title']}</title>
</head>
<body>
    <header>
        <h1>{meta_tags['title']}</h1>
    </header>
    <section>
        <p>{meta_tags['content']}</p>
    </section>
    <footer>
        <p>&copy; 2026 Emergency Loan Guide</p>
    </footer>
</body>
</html>
"""
    return html_content

# Function to generate and save articles (simulation with smaller number)
def generate_articles():
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    num_articles = 100  # Total articles (you can increase this for testing)
    article_counter = 0

    # Loop to generate articles
    for _ in range(num_articles):
        keyword = random.choice(seed_keywords)
        location = random.choice(locations)

        # Generate HTML content for the keyword and location
        article_html = generate_html(keyword, location)

        # Define file path for the article
        file_name = f"{keyword.replace(' ', '-')}-in-{location.lower()}.html"
        file_path = os.path.join(output_dir, file_name)

        # Save the generated article to a file
        with open(file_path, 'w') as file:
            file.write(article_html)

        article_counter += 1
        print(f"Generated {article_counter}/{num_articles} articles")

    print(f"Finished generating {num_articles} articles")

# Run the article generation process
generate_articles()
