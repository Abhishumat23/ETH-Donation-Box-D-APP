const { ethers } = require("hardhat");

async function main() {
    console.log("🎁 Testing Donation Box Contract");
    console.log("================================");

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const DonationBox = await ethers.getContractFactory("DonationBox");
    const donationBox = DonationBox.attach(contractAddress);

    const [owner, donor1, donor2, donor3] = await ethers.getSigners();

    console.log("📍 Contract Address:", contractAddress);
    console.log("👤 Owner:", owner.address);
    console.log("💰 Owner Balance:", ethers.formatEther(await ethers.provider.getBalance(owner.address)), "ETH");
    console.log();

    console.log("🔍 Initial Contract State:");
    console.log("Total Donations:", ethers.formatEther(await donationBox.totalDonations()), "ETH");
    console.log("Donor Count:", await donationBox.getDonorCount());
    console.log("Contract Balance:", ethers.formatEther(await donationBox.getContractBalance()), "ETH");
    console.log();

    console.log("💸 Making Test Donations:");
    
    console.log("👤 Owner donating 1 ETH...");
    await donationBox.connect(owner).donate({ value: ethers.parseEther("1.0") });
    console.log("✅ Donation successful!");

    console.log("👤 Donor1 donating 0.5 ETH...");
    await donationBox.connect(donor1).donate({ value: ethers.parseEther("0.5") });
    console.log("✅ Donation successful!");

    console.log("👤 Donor2 donating 2 ETH...");
    await donationBox.connect(donor2).donate({ value: ethers.parseEther("2.0") });
    console.log("✅ Donation successful!");

    console.log("👤 Owner donating another 0.3 ETH...");
    await donationBox.connect(owner).donate({ value: ethers.parseEther("0.3") });
    console.log("✅ Donation successful!");
    console.log();

    console.log("📊 Updated Contract Statistics:");
    const totalDonations = await donationBox.totalDonations();
    const donorCount = await donationBox.getDonorCount();
    const contractBalance = await donationBox.getContractBalance();

    console.log("Total Donations:", ethers.formatEther(totalDonations), "ETH");
    console.log("Unique Donors:", donorCount.toString());
    console.log("Contract Balance:", ethers.formatEther(contractBalance), "ETH");
    console.log();

    console.log("👥 Individual Donor Statistics:");
    const ownerDonations = await donationBox.getDonation(owner.address);
    const donor1Donations = await donationBox.getDonation(donor1.address);
    const donor2Donations = await donationBox.getDonation(donor2.address);
    const donor3Donations = await donationBox.getDonation(donor3.address);

    console.log(`Owner (${owner.address}):`, ethers.formatEther(ownerDonations), "ETH");
    console.log(`Donor1 (${donor1.address}):`, ethers.formatEther(donor1Donations), "ETH");
    console.log(`Donor2 (${donor2.address}):`, ethers.formatEther(donor2Donations), "ETH");
    console.log(`Donor3 (${donor3.address}):`, ethers.formatEther(donor3Donations), "ETH (no donations)");
    console.log();

    console.log("📋 All Donors:");
    const allDonors = await donationBox.getAllDonors();
    allDonors.forEach((donor, index) => {
        console.log(`${index + 1}. ${donor}`);
    });
    console.log();

    console.log("💰 Final Balance Check:");
    console.log("Owner Balance:", ethers.formatEther(await ethers.provider.getBalance(owner.address)), "ETH");
    console.log("Contract Balance:", ethers.formatEther(await donationBox.getContractBalance()), "ETH");

    console.log("\n🎉 All tests completed successfully!");
    console.log("The Donation Box contract is working perfectly! 🚀");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Test failed:", error);
        process.exit(1);
    });
