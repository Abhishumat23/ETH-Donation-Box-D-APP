#!/bin/bash

echo "🚀 Donation Box dApp - Quick Start Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed"

# Check if npm packages are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Compile contracts
echo "🔨 Compiling smart contracts..."
npx hardhat compile

# Run tests
echo "🧪 Running tests..."
npx hardhat test

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Keep the terminal with 'npx hardhat node' running"
echo "2. In a new terminal, run: npm run deploy"
echo "3. Copy the contract address and update frontend/app.js"
echo "4. Open frontend/index.html in your browser"
echo "5. Configure MetaMask with Hardhat localhost network"
echo "6. Import a test account using one of the private keys"
echo ""
echo "For detailed instructions, see README.md"
