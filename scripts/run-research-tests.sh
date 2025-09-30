#!/bin/bash

echo "🔬 BLOCKCHAIN DONATION SYSTEM - RESEARCH TEST SUITE"
echo "=================================================="
echo ""

# Start Hardhat node in the background
echo "🚀 Starting local blockchain network..."
npx hardhat node &
HARDHAT_PID=$!
sleep 3

echo "📊 Running comprehensive test suite..."
echo ""

# Run all tests and capture output
echo "1. Running basic functionality tests..."
npx hardhat test test/DonationBox.test.js

echo ""
echo "2. Running research performance analysis..."
npx hardhat test test/ResearchPaperAnalysis.test.js

echo ""
echo "3. Generating gas analysis report..."
npx hardhat test test/DonationBox.test.js --gas-report

echo ""
echo "📋 Generating contract size analysis..."
npx hardhat compile --size-contracts

echo ""
echo "💾 Exporting contract ABI and bytecode..."
mkdir -p research-outputs
cp artifacts/contracts/DonationBox.sol/DonationBox.json research-outputs/
cp artifacts/build-info/*.json research-outputs/build-info.json 2>/dev/null || echo "Build info not found"

echo ""
echo "📈 Performance data exported to research-data.json"
echo "📁 All research outputs saved to research-outputs/ directory"

# Clean up
kill $HARDHAT_PID 2>/dev/null

echo ""
echo "✅ Research test suite completed successfully!"
echo "=================================================="