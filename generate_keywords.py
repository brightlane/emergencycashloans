import csv
import os
import random

# Define your affiliate link structure
affiliate_link = "https://www.linkconnector.com/ta.php?lc=007949096598005765&atid=MaxlendT"

# Sample list of terms to create 2-word phrases (expand as needed)
keywords_part_1 = ["cash", "payday", "emergency", "quick", "fast", "instant", "short term", "personal", "loan", "advance", "money", "urgent", "same day", "bad credit"]
keywords_part_2 = ["loan", "cash", "advances", "money", "payday", "lenders", "approval", "credit", "loans", "fast cash", "short-term loans", "quick approval", "same day loan", "cash advance"]

# Generate 10,000 2-word combinations
keywords = []
for _ in range(10000):  # You can adjust the number if you need more or fewer
    keyword = f"{random.choice(keywords_part_1)} {random.choice(keywords_part_2)}"
    keywords.append(keyword)

# Directory for storing files (you can change this to cloud storage if needed)
output_directory = 'generated_files/'

# Ensure the output directory exists
os.makedirs(output_directory, exist_ok=True)

# Function to generate content and meta tags for a batch of keywords
def generate_content_for_batch(start_index, end_index, batch_number):
    # Open a CSV file to write batch results
    batch_filename = os.path.join(output_directory, f'batch_{batch_number}.csv')
    with open(batch_filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Keyword', 'Meta Title', 'Meta Description', 'Content', 'Affiliate Link'])
        
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
            
            # Write the data to the CSV file
            writer.writerow([keyword, meta_title, meta_description, content, affiliate_link])
    
    print(f"Batch {batch_number} processed and saved to {batch_filename}")

# Function to handle the batching process
def process_keywords_in_batches():
    total_keywords = len(keywords)
    total_batches = total_keywords // 10000 + (1 if total_keywords % 10000 > 0 else 0)
    
    for batch_number in range(1, total_batches + 1):
        start_index = (batch_number - 1) * 10000
        end_index = min(start_index + 10000, total_keywords)
        
        # Process each batch and generate content and meta tags
        generate_content_for_batch(start_index, end_index, batch_number)

# Run the processing in batches
process_keywords_in_batches()
