// Enhanced Contract configuration with new features
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update this after redeployment

// Enhanced Contract ABI with new functions
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "donor", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
            {"indexed": false, "internalType": "uint8", "name": "newBadge", "type": "uint8"}
        ],
        "name": "DonationMade",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "milestone", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256"}
        ],
        "name": "MilestoneReached",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "donor", "type": "address"},
            {"indexed": false, "internalType": "uint8", "name": "badge", "type": "uint8"}
        ],
        "name": "BadgeAwarded",
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
        "inputs": [{"internalType": "address", "name": "donor", "type": "address"}],
        "name": "getDonation",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDonorCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllDonors",
        "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNextMilestone",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "donor", "type": "address"}],
        "name": "getDonorBadgeString",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTopDonors",
        "outputs": [
            {"internalType": "address[]", "name": "", "type": "address[]"},
            {"internalType": "uint256[]", "name": "", "type": "uint256[]"},
            {"internalType": "string[]", "name": "", "type": "string[]"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalDonations",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentMilestone",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Global variables
let provider;
let signer;
let contract;
let userAccount;

// Initialize the app
document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
    setupEventListeners();
    await updateUI();
});

async function initializeApp() {
    try {
        console.log('Initializing app...');
        
        // Check if we're in a browser environment with Ethereum support
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            console.log('App initialized with MetaMask successfully');
            updateConnectionStatus('MetaMask detected - Click "Donate ETH" to connect');
        } else if (typeof window !== 'undefined') {
            // Fallback to read-only mode using JSON-RPC with multiple endpoints
            console.log('MetaMask not detected, trying read-only mode');
            
            // Try multiple RPC endpoints
            const rpcEndpoints = [
                'http://localhost:8545',
                'http://127.0.0.1:8545',
                'http://[::1]:8545'
            ];
            
            let connected = false;
            for (const endpoint of rpcEndpoints) {
                try {
                    console.log(`Trying to connect to ${endpoint}...`);
                    provider = new ethers.providers.JsonRpcProvider(endpoint);
                    
                    // Test the connection
                    await provider.getNetwork();
                    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
                    
                    // Test contract call
                    await contract.totalDonations();
                    
                    console.log(`Successfully connected to ${endpoint}`);
                    connected = true;
                    break;
                } catch (err) {
                    console.log(`Failed to connect to ${endpoint}:`, err.message);
                    continue;
                }
            }
            
            if (connected) {
                updateConnectionStatus('Read-only mode - Install MetaMask to interact');
                showInfo('Connected in read-only mode. Install MetaMask to make donations.');
            } else {
                throw new Error('Unable to connect to any Hardhat node endpoint');
            }
        } else {
            throw new Error('Browser environment not detected');
        }
    } catch (error) {
        console.error('Failed to initialize app:', error);
        updateConnectionStatus('Connection failed');
        showError('Failed to connect to blockchain. Make sure Hardhat node is running on localhost:8545');
        
        // Still try to show the UI with placeholder data
        showPlaceholderData();
    }
}

function setupEventListeners() {
    document.getElementById('donateBtn').addEventListener('click', handleDonate);
    
    // Setup contract event listeners
    if (contract) {
        // Listen for donation events
        contract.on('DonationMade', (donor, amount, badge, event) => {
            console.log('Donation made:', {donor, amount: ethers.utils.formatEther(amount), badge});
            updateUI();
            if (donor.toLowerCase() === userAccount?.toLowerCase()) {
                showAchievement(`Donation successful! Badge: ${getBadgeName(badge)}`);
            }
        });
        
        // Listen for milestone events
        contract.on('MilestoneReached', (milestone, totalAmount, event) => {
            console.log('Milestone reached:', {
                milestone: ethers.utils.formatEther(milestone),
                total: ethers.utils.formatEther(totalAmount)
            });
            showAchievement(`🎯 Milestone reached! ${ethers.utils.formatEther(milestone)} ETH goal achieved!`);
            updateUI();
        });
        
        // Listen for badge events
        contract.on('BadgeAwarded', (donor, badge, event) => {
            console.log('Badge awarded:', {donor, badge});
            if (donor.toLowerCase() === userAccount?.toLowerCase()) {
                showAchievement(`🏅 New badge unlocked: ${getBadgeName(badge)}!`);
            }
        });
    }
}

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask not found');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        userAccount = accounts[0];
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        updateConnectionStatus('Connected: ' + userAccount.slice(0, 6) + '...' + userAccount.slice(-4));
        await updateUI();
        
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        showError('Failed to connect wallet: ' + error.message);
    }
}

async function handleDonate() {
    // Check if MetaMask is available
    if (typeof window.ethereum === 'undefined') {
        showError('MetaMask is required to make donations. Please install MetaMask browser extension and refresh the page.');
        return;
    }

    if (!userAccount) {
        await connectWallet();
        if (!userAccount) return;
    }

    const amountInput = document.getElementById('donationAmount');
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }

    try {
        const btn = document.getElementById('donateBtn');
        btn.disabled = true;
        btn.textContent = 'Processing...';
        
        const tx = await contract.donate({
            value: ethers.utils.parseEther(amount.toString())
        });
        
        console.log('Transaction sent:', tx.hash);
        showInfo(`Transaction sent! Hash: ${tx.hash.slice(0, 10)}...`);
        await tx.wait();
        
        amountInput.value = '';
        await updateUI();
        
    } catch (error) {
        console.error('Donation failed:', error);
        if (error.code === 4001) {
            showError('Transaction cancelled by user');
        } else if (error.code === -32603) {
            showError('Transaction failed. Make sure you have enough ETH for gas fees.');
        } else {
            showError('Donation failed: ' + error.message);
        }
    } finally {
        const btn = document.getElementById('donateBtn');
        btn.disabled = false;
        btn.textContent = 'Donate ETH';
    }
}

async function updateUI() {
    try {
        await Promise.all([
            updateStats(),
            updateMilestoneProgress(),
            updateUserBadge(),
            updateLeaderboard()
        ]);
    } catch (error) {
        console.error('Failed to update UI:', error);
    }
}

async function updateStats() {
    try {
        if (!contract) {
            console.log('No contract available, skipping stats update');
            return;
        }
        
        const [totalDonations, donorCount, contractBalance, currentMilestone] = await Promise.all([
            contract.totalDonations(),
            contract.getDonorCount(),
            contract.getContractBalance(),
            contract.currentMilestone()
        ]);
        
        document.getElementById('totalDonations').textContent = 
            parseFloat(ethers.utils.formatEther(totalDonations)).toFixed(3) + ' ETH';
        document.getElementById('donorCount').textContent = donorCount.toString();
        document.getElementById('contractBalance').textContent = 
            parseFloat(ethers.utils.formatEther(contractBalance)).toFixed(3) + ' ETH';
        document.getElementById('milestonesReached').textContent = 
            currentMilestone.toString() + '/5';
            
    } catch (error) {
        console.error('Failed to update stats:', error);
        showPlaceholderData();
    }
}

async function updateMilestoneProgress() {
    try {
        if (!contract) {
            console.log('No contract available, skipping milestone update');
            return;
        }
        
        const [nextMilestone, currentTotal] = await contract.getNextMilestone();
        const milestoneText = document.getElementById('milestone-text');
        const progressBar = document.getElementById('milestone-bar');
        const currentProgress = document.getElementById('current-progress');
        const nextTarget = document.getElementById('next-target');
        
        if (nextMilestone.eq(0)) {
            // All milestones reached
            milestoneText.textContent = 'All milestones completed! 🎉';
            progressBar.style.width = '100%';
            currentProgress.textContent = ethers.utils.formatEther(currentTotal) + ' ETH';
            nextTarget.textContent = 'Complete!';
        } else {
            const progress = (currentTotal.mul(100)).div(nextMilestone);
            const progressPercent = Math.min(progress.toNumber(), 100);
            
            milestoneText.textContent = `Next: ${ethers.utils.formatEther(nextMilestone)} ETH`;
            progressBar.style.width = progressPercent + '%';
            currentProgress.textContent = parseFloat(ethers.utils.formatEther(currentTotal)).toFixed(3) + ' ETH';
            nextTarget.textContent = ethers.utils.formatEther(nextMilestone) + ' ETH';
        }
    } catch (error) {
        console.error('Failed to update milestone progress:', error);
    }
}

async function updateUserBadge() {
    if (!userAccount) {
        document.getElementById('user-badge').textContent = 'Connect Wallet';
        document.getElementById('user-badge').className = 'badge-display badge-none';
        document.getElementById('user-donations').textContent = '0 ETH';
        return;
    }
    
    try {
        const [userDonations, badgeString] = await Promise.all([
            contract.getDonation(userAccount),
            contract.getDonorBadgeString(userAccount)
        ]);
        
        document.getElementById('user-donations').textContent = 
            parseFloat(ethers.utils.formatEther(userDonations)).toFixed(3) + ' ETH';
        
        const badgeElement = document.getElementById('user-badge');
        badgeElement.textContent = badgeString;
        badgeElement.className = 'badge-display badge-' + badgeString.toLowerCase();
        
    } catch (error) {
        console.error('Failed to update user badge:', error);
    }
}

async function updateLeaderboard() {
    try {
        const [addresses, amounts, badges] = await contract.getTopDonors();
        const leaderboardContent = document.getElementById('leaderboard-content');
        
        if (addresses.length === 0) {
            leaderboardContent.innerHTML = '<p>No donors yet. Be the first!</p>';
            return;
        }
        
        let html = '';
        for (let i = 0; i < addresses.length && i < 5; i++) {
            if (addresses[i] === '0x0000000000000000000000000000000000000000') break;
            
            const rank = i + 1;
            const emoji = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i];
            
            html += `
                <div class="leaderboard-item">
                    <div class="rank">${emoji}</div>
                    <div class="donor-info">
                        <div class="donor-address">${addresses[i].slice(0, 6)}...${addresses[i].slice(-4)}</div>
                        <div class="badge-display badge-${badges[i].toLowerCase()}">${badges[i]}</div>
                    </div>
                    <div class="donation-amount">
                        <strong>${parseFloat(ethers.utils.formatEther(amounts[i])).toFixed(3)} ETH</strong>
                    </div>
                </div>
            `;
        }
        
        leaderboardContent.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to update leaderboard:', error);
        document.getElementById('leaderboard-content').innerHTML = '<p>Failed to load leaderboard</p>';
    }
}

// Helper functions
function setAmount(amount) {
    document.getElementById('donationAmount').value = amount;
}

function updateConnectionStatus(status) {
    document.getElementById('connection-status').textContent = status;
}

function showError(message) {
    console.error('Error:', message);
    alert('⚠️ Error: ' + message);
}

function showInfo(message) {
    console.log('Info:', message);
    // Create a temporary info notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #3b82f6, #1d4ed8);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 90%;
        text-align: center;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 5000);
}

function showAchievement(message) {
    const notification = document.getElementById('achievement-notification');
    const text = document.getElementById('achievement-text');
    
    text.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function getBadgeName(badgeNumber) {
    const badges = ['None', 'Bronze', 'Silver', 'Gold', 'Diamond'];
    return badges[badgeNumber] || 'Unknown';
}

function showPlaceholderData() {
    console.log('Showing placeholder data...');
    
    // Show demo data when blockchain is not available
    document.getElementById('totalDonations').textContent = '5.55 ETH';
    document.getElementById('donorCount').textContent = '5';
    document.getElementById('contractBalance').textContent = '5.55 ETH';
    document.getElementById('milestonesReached').textContent = '2/5';
    
    // Milestone progress
    document.getElementById('milestone-text').textContent = 'Next: 10.0 ETH';
    document.getElementById('milestone-bar').style.width = '55.5%';
    document.getElementById('current-progress').textContent = '5.55 ETH';
    document.getElementById('next-target').textContent = '10.0 ETH';
    
    // User badge (placeholder)
    document.getElementById('user-badge').textContent = 'Connect Wallet';
    document.getElementById('user-badge').className = 'badge-display badge-none';
    document.getElementById('user-donations').textContent = '0 ETH';
    
    // Placeholder leaderboard
    const leaderboardContent = document.getElementById('leaderboard-content');
    leaderboardContent.innerHTML = `
        <div class="leaderboard-item">
            <div class="rank">🥇</div>
            <div class="donor-info">
                <div class="donor-address">0x7099...79C8</div>
                <div class="badge-display badge-gold">Gold</div>
            </div>
            <div class="donation-amount"><strong>2.500 ETH</strong></div>
        </div>
        <div class="leaderboard-item">
            <div class="rank">🥈</div>
            <div class="donor-info">
                <div class="donor-address">0x3C44...93BC</div>
                <div class="badge-display badge-gold">Gold</div>
            </div>
            <div class="donation-amount"><strong>1.800 ETH</strong></div>
        </div>
        <div class="leaderboard-item">
            <div class="rank">🥉</div>
            <div class="donor-info">
                <div class="donor-address">0x90F7...b906</div>
                <div class="badge-display badge-silver">Silver</div>
            </div>
            <div class="donation-amount"><strong>0.800 ETH</strong></div>
        </div>
        <p style="text-align: center; color: #666; margin-top: 15px;">
            📡 Showing cached data - Connect to blockchain for live updates
        </p>
    `;
}

// Auto-connect if already connected
window.addEventListener('load', async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            
            if (accounts.length > 0) {
                userAccount = accounts[0];
                signer = provider.getSigner();
                contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                updateConnectionStatus('Connected: ' + userAccount.slice(0, 6) + '...' + userAccount.slice(-4));
                await updateUI();
            } else {
                updateConnectionStatus('MetaMask detected - Click "Donate ETH" to connect');
            }
        } catch (error) {
            console.error('Auto-connect failed:', error);
            updateConnectionStatus('MetaMask detected - Click "Donate ETH" to connect');
        }
    } else {
        updateConnectionStatus('Install MetaMask to interact with the dApp');
        // Still load in read-only mode
        await updateUI();
    }
});

// Handle account changes
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            userAccount = null;
            updateConnectionStatus('MetaMask disconnected');
        } else {
            userAccount = accounts[0];
            updateConnectionStatus('Connected: ' + userAccount.slice(0, 6) + '...' + userAccount.slice(-4));
            updateUI();
        }
    });
    
    window.ethereum.on('chainChanged', (chainId) => {
        // Reload the page when network changes
        window.location.reload();
    });
}
