#!/bin/bash

# Exit on error
set -e

echo "🚀 Publishing @liaplus/voice-navigation to NPM..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Run this script from npm-package directory."
  exit 1
fi

# Copy latest CDN file
echo "📦 Copying CDN file to dist..."
mkdir -p dist
cp ../voice-navigation-dynamic.js dist/voice-navigation.js
cp ../voice-navigation-dynamic.js dist/voice-navigation.esm.js
echo "✅ Files copied"
echo ""

# Show what will be published
echo "📋 Preview package contents..."
npm pack --dry-run
echo ""

# Ask for confirmation
read -p "🤔 Do you want to publish this version? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Publishing cancelled"
  exit 1
fi

# Check if logged in to NPM
echo "🔐 Checking NPM authentication..."
npm whoami &> /dev/null || {
  echo "❌ Not logged in to NPM. Please run: npm login"
  exit 1
}
echo "✅ Logged in as: $(npm whoami)"
echo ""

# Ask for version type
echo "📌 Current version: $(node -p "require('./package.json').version")"
echo ""
echo "Select version bump type:"
echo "  1) patch (7.0.0 → 7.0.1) - Bug fixes"
echo "  2) minor (7.0.0 → 7.1.0) - New features"
echo "  3) major (7.0.0 → 8.0.0) - Breaking changes"
echo "  4) Skip version bump"
echo ""
read -p "Enter choice (1-4): " version_choice

case $version_choice in
  1)
    echo "⬆️  Bumping patch version..."
    npm version patch
    ;;
  2)
    echo "⬆️  Bumping minor version..."
    npm version minor
    ;;
  3)
    echo "⬆️  Bumping major version..."
    npm version major
    ;;
  4)
    echo "⏭️  Skipping version bump"
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

NEW_VERSION=$(node -p "require('./package.json').version")
echo "📦 Publishing version: $NEW_VERSION"
echo ""

# Publish to NPM
echo "📤 Publishing to NPM..."
npm publish --access public

echo ""
echo "🎉 Successfully published @liaplus/voice-navigation@$NEW_VERSION"
echo ""
echo "View at: https://www.npmjs.com/package/@liaplus/voice-navigation"
echo "Install: npm install @liaplus/voice-navigation"
echo "CDN: https://unpkg.com/@liaplus/voice-navigation@$NEW_VERSION/dist/voice-navigation.js"
echo ""
