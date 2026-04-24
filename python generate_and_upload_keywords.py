name: Generate and Upload Keywords to S3

on:
  push:
    branches:
      - main

jobs:
  generate_keywords:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.x'

      - name: Install boto3
        run: |
          pip install boto3

      - name: Run Python script to generate and upload keywords
        run: |
          python generate_and_upload_keywords.py
