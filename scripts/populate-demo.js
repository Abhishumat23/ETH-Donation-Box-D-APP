// Demo data population script for testing
const { ethers } = require("hardhat");

async function main() {
    console.log("🎯 Populating DonationBox with demo data...");

    // Get the contract factory and signers
    const DonationBox = await ethers.getContractFactory("DonationBox");
    const [owner, donor1, donor2, donor3, donor4, donor5] = await ethers.getSigners();

    // Contract address (update if needed)
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const donationBox = DonationBox.attach(contractAddress);

    console.log("📍 Contract address:", contractAddress);

    try {
        // Make various donations to test the badge and milestone system
        console.log("\n💰 Making demo donations...");

        // Donor 1: 2.5 ETH (Gold badge)
        console.log("Donor 1: Donating 2.5 ETH...");
        await donationBox.connect(donor1).donate({ value: ethers.parseEther("2.5") });

        // Donor 2: 1.8 ETH (Gold badge)
        console.log("Donor 2: Donating 1.8 ETH...");
        await donationBox.connect(donor2).donate({ value: ethers.parseEther("1.8") });

        // Donor 3: 0.8 ETH (Silver badge)
        console.log("Donor 3: Donating 0.8 ETH...");
        await donationBox.connect(donor3).donate({ value: ethers.parseEther("0.8") });

        // Donor 4: 0.3 ETH (Bronze badge)
        console.log("Donor 4: Donating 0.3 ETH...");
        await donationBox.connect(donor4).donate({ value: ethers.parseEther("0.3") });

        // Donor 5: 0.15 ETH (Bronze badge)
        console.log("Donor 5: Donating 0.15 ETH...");
        await donationBox.connect(donor5).donate({ value: ethers.parseEther("0.15") });

        // Check total donations
        const totalDonations = await donationBox.totalDonations();
        const donorCount = await donationBox.getDonorCount();
        const currentMilestone = await donationBox.currentMilestone();

        console.log("\n📊 Demo Data Summary:");
        console.log("Total Donations:", ethers.formatEther(totalDonations), "ETH");
        console.log("Number of Donors:", donorCount.toString());
        console.log("Milestones Reached:", currentMilestone.toString(), "/5");

        // Display leaderboard
        console.log("\n🏆 Leaderboard:");
        const [addresses, amounts, badges] = await donationBox.getTopDonors();
        
        for (let i = 0; i < addresses.length && i < 5; i++) {
            if (addresses[i] !== ethers.ZeroAddress) {
                const rank = i + 1;
                const emoji = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i];
                console.log(`${emoji} ${addresses[i].slice(0, 6)}...${addresses[i].slice(-4)} - ${ethers.formatEther(amounts[i])} ETH - ${badges[i]} Badge`);
            }
        }

        console.log("\n🎉 Demo data populated successfully!");
        console.log("You can now view the dApp with realistic data!");

    } catch (error) {
        console.error("❌ Error populating demo data:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
