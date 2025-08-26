// Contract configuration - DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // DonationBox contract on Hardhat localhost

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "DonationMade",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "donor",
                "type": "address"
            }
        ],
        "name": "getDonation",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDonorCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllDonors",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalDonations",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Global variables
let web3;
let contract;
let userAccount;

// DOM elements
const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletStatus = document.getElementById('walletStatus');
const mainContent = document.getElementById('mainContent');
const donateBtn = document.getElementById('donateBtn');
const donationAmount = document.getElementById('donationAmount');
const refreshBtn = document.getElementById('refreshBtn');
const statusMessage = document.getElementById('statusMessage');

// Stats elements
const userDonations = document.getElementById('userDonations');
const totalDonations = document.getElementById('totalDonations');
const donorCount = document.getElementById('donorCount');
const contractBalance = document.getElementById('contractBalance');
const recentActivity = document.getElementById('recentActivity');
const contractAddressElement = document.getElementById('contractAddress');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    init();
});

async function init() {
    // Update contract address in UI
    contractAddressElement.textContent = CONTRACT_ADDRESS;
    
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connectWallet();
        }
    } else {
        showStatus('MetaMask is not installed. Please install MetaMask to use this dApp.', 'error');
        connectWalletBtn.disabled = true;
    }
    
    // Event listeners
    connectWalletBtn.addEventListener('click', connectWallet);
    donateBtn.addEventListener('click', makeDonation);
    refreshBtn.addEventListener('click', refreshData);
    
    // Listen for account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function(accounts) {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                connectWallet();
            }
        });
        
        window.ethereum.on('chainChanged', function(chainId) {
            window.location.reload();
        });
    }
}

async function connectWallet() {
    try {
        showStatus('Connecting to MetaMask...', 'info');
        
        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        userAccount = accounts[0];
        
        // Initialize Web3
        web3 = new Web3(window.ethereum);
        
        // Check if we're on the correct network (localhost)
        const chainId = await web3.eth.getChainId();
        if (chainId !== 31337n) {
            showStatus('Please switch to the Hardhat localhost network (Chain ID: 31337)', 'error');
            return;
        }
        
        // Initialize contract
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        
        // Update UI
        walletStatus.innerHTML = `
            <p class="connected">✅ Connected to MetaMask</p>
            <p><strong>Account:</strong> ${userAccount}</p>
        `;
        walletStatus.className = 'wallet-status connected';
        
        connectWalletBtn.style.display = 'none';
        mainContent.style.display = 'block';
        
        showStatus('Successfully connected to MetaMask!', 'success');
        
        // Load initial data
        await refreshData();
        
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        showStatus('Failed to connect to MetaMask. Please try again.', 'error');
    }
}

function disconnectWallet() {
    userAccount = null;
    web3 = null;
    contract = null;
    
    walletStatus.innerHTML = '<p>Please connect your MetaMask wallet to continue</p>';
    walletStatus.className = 'wallet-status';
    
    connectWalletBtn.style.display = 'inline-block';
    mainContent.style.display = 'none';
    
    showStatus('Wallet disconnected', 'info');
}

async function makeDonation() {
    if (!userAccount || !contract) {
        showStatus('Please connect your wallet first', 'error');
        return;
    }
    
    const amount = donationAmount.value;
    
    if (!amount || parseFloat(amount) <= 0) {
        showStatus('Please enter a valid donation amount', 'error');
        return;
    }
    
    try {
        showStatus('Processing donation...', 'info');
        donateBtn.disabled = true;
        donateBtn.innerHTML = 'Processing... <div class="loading"></div>';
        
        // Convert ETH to Wei
        const amountInWei = web3.utils.toWei(amount, 'ether');
        
        // Send transaction
        const transaction = await contract.methods.donate().send({
            from: userAccount,
            value: amountInWei,
            gas: 100000
        });
        
        showStatus(`Donation successful! Transaction hash: ${transaction.transactionHash}`, 'success');
        
        // Clear input
        donationAmount.value = '';
        
        // Refresh data
        await refreshData();
        
        // Add to recent activity
        addToRecentActivity(`Donated ${amount} ETH`);
        
    } catch (error) {
        console.error('Error making donation:', error);
        showStatus('Donation failed. Please try again.', 'error');
    } finally {
        donateBtn.disabled = false;
        donateBtn.innerHTML = 'Donate Now';
    }
}

async function refreshData() {
    if (!userAccount || !contract) {
        return;
    }
    
    try {
        // Get user's donations
        const userDonationAmount = await contract.methods.getDonation(userAccount).call();
        const userDonationEth = web3.utils.fromWei(userDonationAmount, 'ether');
        userDonations.textContent = `${parseFloat(userDonationEth).toFixed(4)} ETH`;
        
        // Get total donations
        const totalDonationAmount = await contract.methods.totalDonations().call();
        const totalDonationEth = web3.utils.fromWei(totalDonationAmount, 'ether');
        totalDonations.textContent = `${parseFloat(totalDonationEth).toFixed(4)} ETH`;
        
        // Get donor count
        const donorCountValue = await contract.methods.getDonorCount().call();
        donorCount.textContent = donorCountValue.toString();
        
        // Get contract balance
        const contractBalanceAmount = await contract.methods.getContractBalance().call();
        const contractBalanceEth = web3.utils.fromWei(contractBalanceAmount, 'ether');
        contractBalance.textContent = `${parseFloat(contractBalanceEth).toFixed(4)} ETH`;
        
    } catch (error) {
        console.error('Error refreshing data:', error);
        showStatus('Error loading contract data', 'error');
    }
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide success and info messages after 5 seconds
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
}

function addToRecentActivity(activity) {
    const timestamp = new Date().toLocaleTimeString();
    const activityHtml = `
        <div class="activity-item">
            <strong>${timestamp}:</strong> ${activity}
        </div>
    `;
    
    if (recentActivity.innerHTML === '<p>No recent activity</p>') {
        recentActivity.innerHTML = activityHtml;
    } else {
        recentActivity.innerHTML = activityHtml + recentActivity.innerHTML;
    }
    
    // Keep only last 5 activities
    const activities = recentActivity.querySelectorAll('.activity-item');
    if (activities.length > 5) {
        activities[activities.length - 1].remove();
    }
}

// Utility function to format addresses
function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
