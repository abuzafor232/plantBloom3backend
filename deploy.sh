#!/bin/bash

echo "🚀 Deploying Plant Bloom Monitor to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod

echo "🎉 Deployment complete!"
echo "📱 Your site is now live on Netlify!"
echo "🔗 Check the URL above for your live site."

