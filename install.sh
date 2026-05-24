#!/bin/bash

# Ego Bot Installation Script
# This script automates the setup process

echo "👑 Ego Bot Installation Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo "✅ NPM found: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "📝 Creating .env file..."

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Skipping..."
else
    cp .env.example .env
    echo "✅ .env file created from .env.example"
    echo ""
    echo "⚠️  IMPORTANT: Edit the .env file and add your Discord bot token:"
    echo "   - DISCORD_TOKEN=your_bot_token_here"
    echo "   - CLIENT_ID=your_client_id_here"
    echo "   - GUILD_ID=your_server_id_here"
    echo ""
fi

echo "================================"
echo "✅ Installation Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Open the .env file and add your Discord bot token"
echo "2. Run: npm start"
echo ""
echo "🔗 Get your bot token from: https://discord.com/developers/applications"
echo ""
