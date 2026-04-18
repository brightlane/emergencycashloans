#!/bin/bash

# Config Loader Module (High-Throughput Engine Core)

set -e

CONFIG_FILE="config/engine-config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Config file missing: $CONFIG_FILE"
  exit 1
fi

echo "Loading engine configuration..."

CONFIG=$(cat "$CONFIG_FILE")

# Extract key flags using simple parsing (no dependencies needed)
ENABLE_BATCH=$(echo "$CONFIG" | grep -o '"enabled": true' | head -1)
MAX_CONCURRENCY=$(echo "$CONFIG" | grep -o '"max_concurrency": [0-9]*' | head -1 | awk '{print $2}')

echo "Batch Enabled: $ENABLE_BATCH"
echo "Max Concurrency: $MAX_CONCURRENCY"

# Export for GitHub Actions steps
echo "BATCH_ENABLED=true" >> $GITHUB_ENV
echo "MAX_CONCURRENCY=$MAX_CONCURRENCY" >> $GITHUB_ENV

echo "Config loaded successfully"
