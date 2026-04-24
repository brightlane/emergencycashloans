import os
import json
import csv
import boto3
import asyncio
import random
from botocore.exceptions import ClientError
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

# AWS S3 and SQS Configuration
S3_BUCKET_NAME = "your-s3-bucket-name"
AWS_ACCESS_KEY_ID = "your-access-key-id"
AWS_SECRET_ACCESS_KEY = "your-secret-access-key"
AWS_REGION = "your-region"
SQS_QUEUE_URL = "your-sqs-queue-url"
SQS_MAX_MESSAGES = 10  # Max number of messages to fetch from the queue at once

# Affiliate link structure
affiliate_link = "https://www.linkconnector.com/ta.php?lc=007949096598005765&atid=MaxlendT"

# Categories for keyword generation
keyword_categories = {
    'loans': ["cash loan", "payday loan", "personal loan", "quick loan", "same day loan", "loan approval"],
    'emergency_loans': ["emergency loan", "urgent cash", "fast emergency loan", "same day payday loan"],
    'cash_advance': ["cash advance", "instant cash", "emergency cash advance", "short term cash", "quick cash advance"],
    'bad_credit_loans': ["bad credit loans", "loans for bad credit", "no credit check loans", "loan approval bad credit"]
}

# Combine keywords into a list based on categories
keywords = []
for category, terms in keyword_categories.items():
    for term in terms:
        keywords.append(term)

# AWS Clients Setup
s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name=AWS_REGION)
sqs_client = boto3.client('sqs', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name=AWS_REGION)

# Function to generate content for each keyword
def generate_content_for_keyword(keyword, batch_number):
    meta_title = f"Get a Payday Loan for {keyword} | MaxLend"
    meta_description = f"Need a {keyword}? Apply for a payday loan to get fast and easy access to the money you need. Instant approval and no credit check!"
    
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
    
    # Structured Data (JSON-LD)
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
    
    return {
        'keyword': keyword,
        'meta_title': meta_title,
        'meta_description': meta_description,
        'content': content,
        'affiliate_link': affiliate_link,
        'structured_data_json': structured_data_json
    }

# Function to save generated content into a CSV file
def save_batch_to_csv(batch_number, batch_data):
    batch_filename = f'batch_{batch_number}.csv'
    
    with open(batch_filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Keyword', 'Meta Title', 'Meta Description', 'Content', 'Affiliate Link', 'Structured Data'])
        
        for data in batch_data:
            writer.writerow([data['keyword'], data['meta_title'], data['meta_description'], data['content'], data['affiliate_link'], data['structured_data_json']])

    return batch_filename

# Function to upload to S3 asynchronously using ThreadPoolExecutor
def upload_to_s3(file_path):
    try:
        with open(file_path, "rb") as file:
            s3_client.upload_fileobj(file, S3_BUCKET_NAME, file_path)
            print(f"File {file_path} uploaded successfully to S3.")
    except ClientError as e:
        print(f"Error uploading {file_path}: {e}")
        time.sleep(5)  # Retry logic after waiting for a few seconds
        upload_to_s3(file_path)

# Function to process a batch of keywords and upload to S3
async def process_batch(batch_number, start_index, end_index):
    batch_data = []
    
    for i in range(start_index, end_index):
        keyword = keywords[i]
        content_data = generate_content_for_keyword(keyword, batch_number)
        batch_data.append(content_data)
    
    batch_filename = save_batch_to_csv(batch_number, batch_data)
    
    # Upload the CSV file to S3 asynchronously
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, upload_to_s3, batch_filename)
    print(f"Batch {batch_number} processed and uploaded.")

# Function to retrieve and process tasks from the SQS queue
async def process_sqs_queue():
    while True:
        # Fetch messages from the SQS queue
        messages = sqs_client.receive_message(
            QueueUrl=SQS_QUEUE_URL,
            MaxNumberOfMessages=SQS_MAX_MESSAGES,
            WaitTimeSeconds=20  # Long polling to reduce cost
        )
        
        if 'Messages' in messages:
            for message in messages['Messages']:
                task_data = json.loads(message['Body'])
                
                batch_number = task_data['batch_number']
                start_index = task_data['start_index']
                end_index = task_data['end_index']
                
                try:
                    await process_batch(batch_number, start_index, end_index)
                    
                    # Delete the message from the queue after successful processing
                    sqs_client.delete_message(
                        QueueUrl=SQS_QUEUE_URL,
                        ReceiptHandle=message['ReceiptHandle']
                    )
                    print(f"Task {batch_number} completed and removed from queue.")
                except Exception as e:
                    print(f"Error processing task {batch_number}: {e}")
                    # Optional: Add retry mechanism or dead-letter queue logic here

# Function to send tasks to SQS queue
def send_task_to_queue(batch_number, start_index, end_index):
    task_data = {
        'batch_number': batch_number,
        'start_index': start_index,
        'end_index': end_index
    }
    
    sqs_client.send_message(
        QueueUrl=SQS_QUEUE_URL,
        MessageBody=json.dumps(task_data)
    )

# Function to split tasks into batches and send them to SQS
def distribute_tasks():
    total_keywords = len(keywords)
    batch_size = 100  # Number of keywords per batch
    total_batches = total_keywords // batch_size + (1 if total_keywords % batch_size > 0 else 0)
    
    for batch_number in range(1, total_batches + 1):
        start_index = (batch_number - 1) * batch_size
        end_index = min(start_index + batch_size, total_keywords)
        
        send_task_to_queue(batch_number, start_index, end_index)
        print(f"Task for batch {batch_number} added to queue.")

# Main function to start the process
async def main():
    distribute_tasks()  # Distribute tasks to SQS queue
    await process_sqs_queue()  # Start processing the queue

if __name__ == "__main__":
    asyncio.run(main())
