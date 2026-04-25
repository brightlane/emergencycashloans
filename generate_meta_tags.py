import os
import json
import csv
import boto3
from datetime import datetime
from botocore.exceptions import ClientError

# Load config from environment (GitHub Secrets)
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
AWS_REGION = os.environ.get("AWS_REGION")

if not S3_BUCKET_NAME or not AWS_REGION:
    raise ValueError("Missing AWS configuration. Set S3_BUCKET_NAME and AWS_REGION.")

# Create S3 client (credentials auto-loaded from env)
s3_client = boto3.client("s3", region_name=AWS_REGION)

# Keywords (more natural intent-based phrases)
keywords = [
    "emergency cash options",
    "short term personal loans",
    "how to borrow money quickly",
    "loans for unexpected expenses",
    "cash advance alternatives",
    "small personal loans online",
    "fast funding options",
    "bad credit borrowing options"
]

affiliate_link = "https://www.linkconnector.com/ta.php?lc=007949096598005765&atid=MaxlendT"

# Generate realistic, safer meta content
def generate_meta_tags(keyword):
    meta_title = f"{keyword.title()} – Options, Costs & What to Know"
    
    meta_description = (
        f"Explore {keyword}, including typical costs, requirements, and alternatives. "
        f"Learn how these options work before applying."
    )

    structured_data = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": keyword.title(),
        "description": f"Information about {keyword}, including terms, costs, and eligibility.",
        "provider": {
            "@type": "Organization",
            "name": "MaxLend"
        },
        "url": affiliate_link,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        }
    }

    return {
        "keyword": keyword,
        "meta_title": meta_title,
        "meta_description": meta_description,
        "structured_data_json": json.dumps(structured_data)
    }

# Save CSV locally
def save_to_csv(meta_tags_data):
    file_name = f"meta_tags_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.csv"

    with open(file_name, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Keyword", "Meta Title", "Meta Description", "Structured Data"])

        for data in meta_tags_data:
            writer.writerow([
                data["keyword"],
                data["meta_title"],
                data["meta_description"],
                data["structured_data_json"]
            ])

    return file_name

# Upload to S3
def upload_to_s3(file_name):
    try:
        s3_client.upload_file(file_name, S3_BUCKET_NAME, file_name)
        print(f"Uploaded: {file_name} → s3://{S3_BUCKET_NAME}/{file_name}")
    except ClientError as e:
        raise RuntimeError(f"S3 upload failed: {e}")

# Main execution
def main():
    meta_tags_data = [generate_meta_tags(k) for k in keywords]

    file_name = save_to_csv(meta_tags_data)

    upload_to_s3(file_name)

    print(f"Generated and uploaded {len(meta_tags_data)} records.")

if __name__ == "__main__":
    main()
