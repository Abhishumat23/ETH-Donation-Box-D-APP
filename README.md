# 🎁 Donation Box dApp - Complete Beginner Guide

A simple, beginner-friendly decentralized application (dApp) built on Ethereum that allows users to donate ETH and track their donations. This project uses Solidity smart contracts, Hardhat for development, and a plain HTML/CSS/JavaScript frontend.

## 📁 Project Structure

```
Blockchain-Project/
├── contracts/
│   └── DonationBox.sol          # Smart contract
├── scripts/
│   └── deploy.js                # Deployment script
├── test/
│   └── DonationBox.test.js      # Contract tests
├── frontend/
│   ├── index.html               # Main webpage
│   ├── styles.css               # Styling
│   └── app.js                   # JavaScript logic
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Node.js dependencies
└── README.md                    # This file
```

## 🚀 Complete Setup Guide

### Step 1: Install Prerequisites

1. **Install Node.js** (version 16 or higher)
   - Go to [nodejs.org](https://nodejs.org/)
   - Download and install the LTS version
   - Verify installation: Open terminal and run `node --version`

2. **Install MetaMask Browser Extension**
   - Go to [metamask.io](https://metamask.io/)
   - Install the browser extension for Chrome, Firefox, or Edge
   - Create a new wallet or import existing one
   - **Important**: Keep your seed phrase safe!

### Step 2: Project Setup

1. **Clone or Download the Project**
   ```bash
   # If you have the project folder, navigate to it
   cd Blockchain-Project
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

### Step 3: Start Local Blockchain

1. **Start Hardhat Local Network**
   ```bash
   npm run node
   ```
   
   This will:
   - Start a local Ethereum blockchain on `http://127.0.0.1:8545`
   - Create 20 test accounts with 10,000 ETH each
   - Display account addresses and private keys
   - **Keep this terminal window open!**

2. **Example Output:**
   ```
   Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
   
   Accounts
   ========
   **Account #1:**
```
Run `npm run node` to see all available test accounts and private keys
```

**Account #2:**
```
Use any of the 20 test accounts provided by Hardhat
```
   Private Key: [DISPLAYED_WHEN_YOU_RUN_HARDHAT_NODE]
   ...
   ```

### Step 4: Deploy Smart Contract

1. **Open a New Terminal Window** (keep the first one running)

2. **Compile and Deploy Contract**
   ```bash
   npm run compile
   npm run deploy
   ```

3. **Copy the Contract Address**
   - The deployment will show output like:
   ```
   ✅ DonationBox contract deployed successfully!
   📍 Contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```
   - **Copy this address - you'll need it in the next step!**

### Step 5: Configure Frontend

1. **Update Contract Address in Frontend**
   - Open `frontend/app.js`
   - Find the line: `const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";`
   - Replace `YOUR_CONTRACT_ADDRESS_HERE` with the contract address from Step 4
   - Example: `const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";`

### Step 6: Configure MetaMask

1. **Add Hardhat Network to MetaMask**
   - Open MetaMask extension
   - Click the network dropdown (usually shows "Ethereum Mainnet")
   - Click "Add Network" → "Add a network manually"
   - Fill in the details:
     ```
     Network Name: Hardhat Localhost
     New RPC URL: http://127.0.0.1:8545
     Chain ID: 31337
     Currency Symbol: ETH
     ```
   - Click "Save"

2. **Import a Test Account**
   - In MetaMask, click your account icon → "Import Account"
   - Use one of the private keys displayed when you run `npm run node`
   - **Important:** These are test keys only - never use on mainnet!
   - You should see 10,000 ETH in your balance

### Step 7: Launch the dApp

1. **Open the Frontend**
   - Navigate to the `frontend` folder
   - Open `index.html` in your web browser
   - Or use a simple HTTP server:
     ```bash
     cd frontend
     python3 -m http.server 8080
     # Then open http://localhost:8080 in your browser
     ```

2. **Connect MetaMask**
   - Click "Connect MetaMask" button
   - MetaMask will ask for permission - click "Connect"
   - Make sure you're on the "Hardhat Localhost" network

### Step 8: Test the dApp

1. **Make a Donation**
   - Enter an amount (e.g., 0.1) in the donation box
   - Click "Donate Now"
   - MetaMask will ask you to confirm the transaction
   - Click "Confirm"

2. **Check Your Stats**
   - Click "Refresh" to update the statistics
   - You should see your donation amount in "Your Donations"
   - The contract statistics should also update

## 🎯 How to Use

1. **Connect Wallet**: Click "Connect MetaMask" to link your wallet
2. **Donate**: Enter ETH amount and click "Donate Now"
3. **Track**: View your total donations and contract statistics
4. **Refresh**: Click "Refresh" to update the latest data

## 📝 Available Commands

```bash
# Install dependencies
npm install

# Start local blockchain (keep running)
npm run node

# Compile smart contracts
npm run compile

# Deploy contracts to localhost
npm run deploy

# Run tests
npm run test
```

## 🔧 Smart Contract Functions

- **`donate()`**: Send ETH to the contract
- **`getDonation(address)`**: Get total donations by an address
- **`getContractBalance()`**: Get total ETH in contract
- **`getDonorCount()`**: Get number of unique donors
- **`totalDonations`**: Total ETH donated overall

## 🐛 Common Issues & Solutions

### "MetaMask not detected"
- Make sure MetaMask extension is installed and enabled
- Refresh the webpage

### "Wrong network" error
- Switch MetaMask to "Hardhat Localhost" network
- Make sure the local blockchain is running (`npm run node`)

### "Contract not deployed" error
- Make sure you've run `npm run deploy`
- Update the contract address in `frontend/app.js`
- Check that the Hardhat network is running

### Transaction fails
- Make sure you have enough ETH (test accounts have 10,000 ETH)
- Try refreshing the page and reconnecting MetaMask
- Check that you're on the correct network (Chain ID: 31337)

### Cannot connect to localhost
- Make sure Hardhat network is running (`npm run node`)
- Check the RPC URL in MetaMask: `http://127.0.0.1:8545`
- Try restarting the Hardhat network

## 🎓 Learning Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [MetaMask Documentation](https://docs.metamask.io/)

## � Security Notes

**⚠️ IMPORTANT FOR PRODUCTION:**
- Never commit private keys to version control
- Use environment variables for sensitive data
- Test keys are for development only - never use on mainnet
- Always audit smart contracts before mainnet deployment

## �📄 License

MIT License - feel free to use this code for learning and experimentation!

## 🎉 Congratulations!

You've successfully built and deployed your first blockchain dApp! You can now:
- Make donations using MetaMask
- Track your donation history
- View contract statistics
- Understand how blockchain applications work

Happy coding! 🚀
