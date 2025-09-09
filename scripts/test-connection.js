const { ethers } = require("hardhat");

async function testConnection() {
    console.log("🔍 Testing contract connection...");
    
    try {
        const DonationBox = await ethers.getContractFactory("DonationBox");
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const donationBox = DonationBox.attach(contractAddress);
        
        // Test basic contract calls
        const totalDonations = await donationBox.totalDonations();
        const donorCount = await donationBox.getDonorCount();
        const [nextMilestone, currentTotal] = await donationBox.getNextMilestone();
        
        console.log("✅ Contract connection successful!");
        console.log("📊 Contract Stats:");
        console.log("   Total Donations:", ethers.formatEther(totalDonations), "ETH");
        console.log("   Donor Count:", donorCount.toString());
        console.log("   Current Progress:", ethers.formatEther(currentTotal), "ETH");
        console.log("   Next Milestone:", ethers.formatEther(nextMilestone), "ETH");
        
        console.log("\n🌐 Frontend URLs:");
        console.log("   Main Portal: http://localhost:8000/index.html");
        console.log("   Enhanced dApp: http://localhost:8000/index-enhanced.html");
        console.log("   Alternative: http://localhost:8001/index-enhanced.html");
        
        console.log("\n🎯 Status: Everything is working perfectly!");
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testConnection();
