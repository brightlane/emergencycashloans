import csv
import os
import json

# Define your affiliate link structure
affiliate_link = "https://www.linkconnector.com/ta.php?lc=007949096598005765&atid=MaxlendT"

# Categories for grouping keywords based on user intent (extend this list as needed)
keyword_categories = {
    'loans': ["cash loan", "payday loan", "personal loan", "quick loan", "same day loan", "loan approval"],
    'emergency_loans': ["emergency loan", "urgent cash", "fast emergency loan", "same day payday loan"],
    'cash_advance': ["cash advance", "instant cash", "emergency cash advance", "short term cash", "quick cash advance"],
    'bad_credit_loans': ["bad credit loans", "loans for bad credit", "no credit check loans", "loan approval bad credit"],
    # You can extend this with more categories or add more keywords.
}

# Generate keywords by combining categories
keywords = []
for category, terms in keyword_categories.items():
    for term in terms:
        keywords.append(term)

# Extend the list to reach 10 million (just an example, repeat the pattern for larger data)
# Ideally, you will load this from a file or external source for more efficiency in production.
additional_keywords = []
for _ in range(250):  # Repeat 250 times to reach 10 million (this creates 2.5 million in total for the example)
    additional_keywords.extend(keywords)
keywords = additional_keywords

# Directory for storing files (you can change this to cloud storage if needed)
output_directory = 'generated_files/'

# Ensure the output directory exists
os.makedirs(output_directory, exist_ok=True)

# Function to generate content, meta tags, and structured data for a batch of keywords
def generate_content_for_batch(start_index, end_index, batch_number):
    # Open a CSV file to write batch results
    batch_filename = os.path.join(output_directory, f'batch_{batch_number}.csv')
    with open(batch_filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Keyword', 'Meta Title', 'Meta Description', 'Content', 'Affiliate Link', 'Structured Data', 'Canonical Link'])
        
        for i in range(start_index, end_index):
            keyword = keywords[i]
            
            # Generate Meta Title
            meta_title = f"Get a Payday Loan for {keyword} | MaxLend"
            
            # Generate Meta Description
            meta_description = f"Need a {keyword}? Apply for a payday loan to get fast and easy access to the money you need. Instant approval and no credit check!"
            
            # Generate Content
            content = f"""
            <h1>{meta_title}</h1>
            <p>If you're facing a {keyword}, a payday loan could be the solution you need. In this guide, we explain how payday loans work, how you can apply for one, and what to expect in the process.</p>
            <h2>What is a Payday Loan?</h2>
            <p>A payday loan is a short-term loan that provides quick cash to help cover emergency expenses like {keyword}. These loans are often available with little paperwork and can be approved in minutes.</p>
            <h2>How to Apply for a Payday Loan for {keyword}</h2>
            <p>Applying for a payday loan is simple. Follow these steps:</p>
            <ol>
                <li>Fill out the application form online</li>
                <li>Submit proof of income and identification</li>
                <li>Get approval in minutes and receive funds the same day</li>
            </ol>
            <h2>Conclusion</h2>
            <p>If you need a payday loan for {keyword}, MaxLend can help. <a href="{affiliate_link}" target="_blank" rel="nofollow sponsored">Apply now for fast approval!</a></p>
            """
            
            # Generate Structured Data (JSON-LD)
            structured_data = {
                "@context": "https://schema.org",
                "@type": "FinancialProduct",
                "name": f"Payday Loan for {keyword}",
                "description": f"A payday loan for {keyword}, providing instant approval and easy access to cash.",
                "brand": "MaxLend",
                "url": affiliate_link,
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "price": "200",
                    "url": affiliate_link
                }
            }
            structured_data_json = json.dumps(structured_data)
            
            # Canonical Link (for SEO, to avoid duplicate content issues)
            canonical_link = f"https://www.yoursite.com/{keyword.replace(' ', '-')}-payday-loan"

            # Write the data to the CSV file
            writer.writerow([keyword, meta_title, meta_description, content, affiliate_link, structured_data_json, canonical_link])
    
    print(f"Batch {batch_number} processed and saved to {batch_filename}")

# Function to handle the batching process
def process_keywords_in_batches():
    total_keywords = len(keywords)
    batch_size = 100000  # 100,000 keywords per batch
    total_batches = total_keywords // batch_size + (1 if total_keywords % batch_size > 0 else 0)
    
    for batch_number in range(1, total_batches + 1):
        start_index = (batch_number - 1) * batch_size
        end_index = min(start_index + batch_size, total_keywords)
        
        # Process each batch and generate content and meta tags
        generate_content_for_batch(start_index, end_index, batch_number)

# Run the processing in batches
process_keywords_in_batches()
