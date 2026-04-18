name: Safe SEO Build (No Loop)

permissions:
  contents: write

on:
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      # =========================
      # SAFETY: DO NOT RUN IF BOT COMMIT
      # =========================
      - name: Prevent infinite loop
        if: github.actor == 'github-actions[bot]'
        run: |
          echo "Bot triggered run - stopping to prevent loop"
          exit 0

      - name: Show repo
        run: |
          echo "FILES:"
          ls

      - name: Run keyword generator
        run: |
          if [ -f keyword-generator.js ]; then
            node keyword-generator.js
          else
            echo "No generator found, skipping"
          fi

      - name: Check output
        run: |
          if [ -f keywords.txt ]; then
            echo "Keywords generated:"
            head -20 keywords.txt
          else
            echo "No keywords generated"
          fi

      # =========================
      # SAFE COMMIT (ONLY IF REAL CHANGE)
      # =========================
      - name: Commit changes safely
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"

          git add keywords.txt pages/ || true

          git diff --cached --quiet && echo "No changes" && exit 0

          git commit -m "safe SEO update"
          git push
