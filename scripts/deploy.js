const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of DonationBox contract...");
  
  // Get the contract factory
  const DonationBox = await ethers.getContractFactory("DonationBox");
  
  // Deploy the contract
  console.log("📝 Deploying contract...");
  const donationBox = await DonationBox.deploy();
  
  // Wait for deployment to be confirmed
  await donationBox.waitForDeployment();
  
  const contractAddress = await donationBox.getAddress();
  
  console.log("✅ DonationBox contract deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 Network:", (await ethers.provider.getNetwork()).name);
  
  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployed by:", deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  
  console.log("\n📋 Contract Information:");
  console.log("Contract Address:", contractAddress);
  console.log("Network: localhost (Hardhat)");
  console.log("\n🎉 Deployment completed! You can now use this address in your frontend.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
