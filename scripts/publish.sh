#!/bin/bash
# Auto-commit and push any new/changed report files
set -e

cd /Users/carykwok/project/pdgogogo

if git diff --quiet && git diff --cached --quiet; then
  echo "No changes to publish."
  exit 0
fi

git add content/reports/
git commit -m "Auto-publish reports $(date +%Y-%m-%d)" || true
git push
echo "Published successfully."
