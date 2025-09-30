const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Research Benchmark Tests - DonationBox Performance Analysis", function () {
  let DonationBox;
  let donationBox;
  let owner;
  let donors = [];
  let benchmarkResults = {};

  before(async function () {
    console.log("\n==========================================");
    console.log("RESEARCH PAPER TEST BENCH - DONATION DAPP");
    console.log("==========================================\n");
    
    // Get contract factory and signers
    DonationBox = await ethers.getContractFactory("DonationBox");
    const signers = await ethers.getSigners();
    owner = signers[0];
    donors = signers.slice(1, 21); // Use first 20 accounts as donors

    // Deploy contract and measure deployment metrics
    const deploymentStart = Date.now();
    donationBox = await DonationBox.deploy();
    await donationBox.waitForDeployment();
    const deploymentTime = Date.now() - deploymentStart;

    const deploymentTx = donationBox.deploymentTransaction();
    const deploymentReceipt = await deploymentTx.wait();

    benchmarkResults.deployment = {
      gasUsed: deploymentReceipt.gasUsed.toString(),
      gasPrice: deploymentTx.gasPrice.toString(),
      deploymentCost: (deploymentReceipt.gasUsed * deploymentTx.gasPrice).toString(),
      deploymentTime: deploymentTime,
      contractAddress: await donationBox.getAddress(),
      blockNumber: deploymentReceipt.blockNumber
    };

    console.log("CONTRACT DEPLOYMENT METRICS:");
    console.log(`├─ Contract Address: ${benchmarkResults.deployment.contractAddress}`);
    console.log(`├─ Gas Used: ${Number(benchmarkResults.deployment.gasUsed).toLocaleString()}`);
    console.log(`├─ Gas Price: ${ethers.formatUnits(benchmarkResults.deployment.gasPrice, 'gwei')} Gwei`);
    console.log(`├─ Deployment Cost: ${ethers.formatEther(benchmarkResults.deployment.deploymentCost)} ETH`);
    console.log(`├─ Deployment Time: ${benchmarkResults.deployment.deploymentTime}ms`);
    console.log(`└─ Block Number: ${benchmarkResults.deployment.blockNumber}\n`);
  });

  describe("1. Gas Consumption Analysis", function () {
    it("Should measure gas consumption for different donation amounts", async function () {
      const testAmounts = [
        ethers.parseEther("0.01"),  // Small donation
        ethers.parseEther("0.1"),   // Bronze threshold
        ethers.parseEther("0.5"),   // Silver threshold
        ethers.parseEther("1.0"),   // Gold threshold
        ethers.parseEther("5.0")    // Diamond threshold
      ];

      const gasResults = [];

      for (let i = 0; i < testAmounts.length; i++) {
        const tx = await donationBox.connect(donors[i]).donate({ value: testAmounts[i] });
        const receipt = await tx.wait();
        
        const gasUsed = receipt.gasUsed;
        const gasPrice = tx.gasPrice;
        const transactionCost = gasUsed * gasPrice;

        gasResults.push({
          amount: ethers.formatEther(testAmounts[i]),
          gasUsed: gasUsed.toString(),
          gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
          cost: ethers.formatEther(transactionCost),
          badge: await donationBox.getDonorBadgeString(donors[i].address)
        });
      }

      benchmarkResults.gasAnalysis = gasResults;

      console.log("GAS CONSUMPTION ANALYSIS:");
      console.log("┌─────────────────┬────────────┬──────────────┬─────────────────┬──────────┐");
      console.log("│ Donation Amount │ Gas Used   │ Gas Price    │ Transaction Cost│ Badge    │");
      console.log("├─────────────────┼────────────┼──────────────┼─────────────────┼──────────┤");
      gasResults.forEach(result => {
        console.log(`│ ${result.amount.padEnd(15)} │ ${Number(result.gasUsed).toLocaleString().padEnd(10)} │ ${result.gasPrice.padEnd(12)} │ ${result.cost.padEnd(15)} │ ${result.badge.padEnd(8)} │`);
      });
      console.log("└─────────────────┴────────────┴──────────────┴─────────────────┴──────────┘\n");
    });
  });

  describe("2. Scalability and Performance Testing", function () {
    it("Should test system performance under load", async function () {
      console.log("SCALABILITY TEST - PROCESSING MULTIPLE CONCURRENT DONATIONS:");
      
      const batchSizes = [5, 10, 15];
      const performanceResults = [];

      for (const batchSize of batchSizes) {
        const startTime = Date.now();
        const promises = [];
        
        // Create batch of concurrent donations
        for (let i = 0; i < batchSize; i++) {
          const donorIndex = 5 + i; // Use different donors
          const amount = ethers.parseEther((0.1 + Math.random() * 0.9).toFixed(3));
          promises.push(donationBox.connect(donors[donorIndex]).donate({ value: amount }));
        }

        // Execute all donations concurrently
        const transactions = await Promise.all(promises);
        const receipts = await Promise.all(transactions.map(tx => tx.wait()));
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        const totalGasUsed = receipts.reduce((sum, receipt) => sum + receipt.gasUsed, 0n);
        const avgGasPerTx = totalGasUsed / BigInt(batchSize);
        const throughput = (batchSize / totalTime) * 1000; // transactions per second

        performanceResults.push({
          batchSize,
          totalTime,
          totalGasUsed: totalGasUsed.toString(),
          avgGasPerTx: avgGasPerTx.toString(),
          throughput: throughput.toFixed(2)
        });

        console.log(`├─ Batch Size: ${batchSize} | Time: ${totalTime}ms | Avg Gas: ${Number(avgGasPerTx).toLocaleString()} | Throughput: ${throughput.toFixed(2)} TPS`);
      }

      benchmarkResults.scalability = performanceResults;
      console.log("└─ Scalability test completed\n");
    });
  });

  describe("3. Badge System Performance", function () {
    it("Should analyze badge upgrade efficiency", async function () {
      console.log("BADGE SYSTEM PERFORMANCE ANALYSIS:");
      
      const badgeUpgradeResults = [];
      const testDonor = donors[0];
      
      // Test progressive badge upgrades
      const upgradePaths = [
        { amount: "0.05", expectedBadge: "None" },
        { amount: "0.1", expectedBadge: "Bronze" },
        { amount: "0.5", expectedBadge: "Silver" },
        { amount: "1.0", expectedBadge: "Gold" },
        { amount: "5.0", expectedBadge: "Diamond" }
      ];

      for (const upgrade of upgradePaths) {
        const startTime = Date.now();
        const tx = await donationBox.connect(testDonor).donate({ 
          value: ethers.parseEther(upgrade.amount) 
        });
        const receipt = await tx.wait();
        const endTime = Date.now();

        const currentBadge = await donationBox.getDonorBadgeString(testDonor.address);
        const currentTotal = await donationBox.getDonation(testDonor.address);

        badgeUpgradeResults.push({
          donationAmount: upgrade.amount,
          expectedBadge: upgrade.expectedBadge,
          actualBadge: currentBadge,
          cumulativeTotal: ethers.formatEther(currentTotal),
          gasUsed: receipt.gasUsed.toString(),
          processingTime: endTime - startTime
        });

        console.log(`├─ Donated: ${upgrade.amount} ETH | Badge: ${currentBadge} | Total: ${ethers.formatEther(currentTotal)} ETH | Gas: ${Number(receipt.gasUsed).toLocaleString()}`);
      }

      benchmarkResults.badgeSystem = badgeUpgradeResults;
      console.log("└─ Badge system analysis completed\n");
    });
  });

  describe("4. Milestone System Efficiency", function () {
    it("Should test milestone progression and event emission", async function () {
      console.log("MILESTONE SYSTEM ANALYSIS:");
      
      const milestoneResults = [];
      let totalDonated = 0;

      // Get current state
      const [nextMilestone, currentTotal] = await donationBox.getNextMilestone();
      const currentMilestoneIndex = await donationBox.currentMilestone();
      
      console.log(`├─ Current Total: ${ethers.formatEther(currentTotal)} ETH`);
      console.log(`├─ Next Milestone: ${ethers.formatEther(nextMilestone)} ETH`);
      console.log(`├─ Current Milestone Index: ${currentMilestoneIndex}`);

      // Calculate amount needed to reach next milestone
      const amountNeeded = nextMilestone - currentTotal;
      
      if (amountNeeded > 0) {
        console.log(`├─ Amount needed for next milestone: ${ethers.formatEther(amountNeeded)} ETH`);
        
        // Make donation to trigger milestone
        const tx = await donationBox.connect(donors[19]).donate({ value: amountNeeded });
        const receipt = await tx.wait();
        
        // Check for MilestoneReached event
        const milestoneEvent = receipt.logs.find(log => {
          try {
            const parsed = donationBox.interface.parseLog(log);
            return parsed.name === 'MilestoneReached';
          } catch (e) {
            return false;
          }
        });

        if (milestoneEvent) {
          const parsed = donationBox.interface.parseLog(milestoneEvent);
          console.log(`├─ ✅ Milestone Reached: ${ethers.formatEther(parsed.args.milestone)} ETH`);
          console.log(`├─ Total at milestone: ${ethers.formatEther(parsed.args.totalAmount)} ETH`);
        }

        milestoneResults.push({
          milestone: ethers.formatEther(nextMilestone),
          gasUsed: receipt.gasUsed.toString(),
          eventEmitted: !!milestoneEvent
        });
      }

      benchmarkResults.milestones = milestoneResults;
      console.log("└─ Milestone system analysis completed\n");
    });
  });

  describe("5. Leaderboard Performance", function () {
    it("Should analyze leaderboard query performance", async function () {
      console.log("LEADERBOARD PERFORMANCE ANALYSIS:");
      
      const queryTimes = [];
      const iterations = 5;

      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        const [addresses, amounts, badges] = await donationBox.getTopDonors();
        const endTime = Date.now();
        
        queryTimes.push(endTime - startTime);
      }

      const avgQueryTime = queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length;
      const [addresses, amounts, badges] = await donationBox.getTopDonors();

      console.log(`├─ Average Query Time: ${avgQueryTime.toFixed(2)}ms`);
      console.log(`├─ Total Donors Retrieved: ${addresses.length}`);
      console.log("├─ Top 3 Donors:");
      
      for (let i = 0; i < Math.min(3, addresses.length); i++) {
        console.log(`│  ${i + 1}. ${addresses[i]}: ${ethers.formatEther(amounts[i])} ETH (${badges[i]})`);
      }

      benchmarkResults.leaderboard = {
        avgQueryTime,
        totalDonors: addresses.length,
        topDonors: addresses.slice(0, 3).map((addr, idx) => ({
          address: addr,
          amount: ethers.formatEther(amounts[idx]),
          badge: badges[idx]
        }))
      };

      console.log("└─ Leaderboard analysis completed\n");
    });
  });

  describe("6. Memory and State Storage Analysis", function () {
    it("Should analyze contract state storage efficiency", async function () {
      console.log("CONTRACT STATE STORAGE ANALYSIS:");
      
      const totalDonations = await donationBox.totalDonations();
      const donorCount = await donationBox.getDonorCount();
      const currentMilestone = await donationBox.currentMilestone();
      
      // Estimate storage costs (approximate)
      const storageSlots = {
        donations: donorCount, // mapping entries
        donors: donorCount,    // array entries
        totalDonations: 1,     // uint256
        owner: 1,              // address
        milestones: 5,         // array of 5 milestones
        currentMilestone: 1,   // uint256
        donorBadges: donorCount // mapping entries
      };

      const totalStorageSlots = Object.values(storageSlots).reduce((a, b) => Number(a) + Number(b), 0);
      const estimatedStorageCost = totalStorageSlots * 20000; // ~20k gas per storage slot

      console.log(`├─ Total Donations: ${ethers.formatEther(totalDonations)} ETH`);
      console.log(`├─ Active Donors: ${donorCount}`);
      console.log(`├─ Current Milestone: ${currentMilestone}`);
      console.log(`├─ Estimated Storage Slots: ${totalStorageSlots}`);
      console.log(`├─ Estimated Storage Cost: ${estimatedStorageCost.toLocaleString()} gas`);

      benchmarkResults.storage = {
        totalDonations: ethers.formatEther(totalDonations),
        donorCount: donorCount.toString(),
        storageSlots: totalStorageSlots,
        estimatedStorageCost
      };

      console.log("└─ Storage analysis completed\n");
    });
  });

  after(function () {
    console.log("==========================================");
    console.log("RESEARCH BENCHMARK SUMMARY");
    console.log("==========================================");
    console.log("\n📊 FINAL METRICS FOR RESEARCH PAPER:\n");
    
    console.log("1. DEPLOYMENT METRICS:");
    console.log(`   - Gas Cost: ${Number(benchmarkResults.deployment.gasUsed).toLocaleString()} units`);
    console.log(`   - Deployment Fee: ${ethers.formatEther(benchmarkResults.deployment.deploymentCost)} ETH`);
    console.log(`   - Deployment Time: ${benchmarkResults.deployment.deploymentTime}ms\n`);
    
    console.log("2. TRANSACTION EFFICIENCY:");
    if (benchmarkResults.gasAnalysis) {
      const avgGas = benchmarkResults.gasAnalysis.reduce((sum, result) => sum + Number(result.gasUsed), 0) / benchmarkResults.gasAnalysis.length;
      console.log(`   - Average Gas per Transaction: ${Math.round(avgGas).toLocaleString()} units`);
      console.log(`   - Gas Range: ${Math.min(...benchmarkResults.gasAnalysis.map(r => Number(r.gasUsed))).toLocaleString()} - ${Math.max(...benchmarkResults.gasAnalysis.map(r => Number(r.gasUsed))).toLocaleString()} units\n`);
    }
    
    console.log("3. SCALABILITY METRICS:");
    if (benchmarkResults.scalability) {
      const maxThroughput = Math.max(...benchmarkResults.scalability.map(r => Number(r.throughput)));
      console.log(`   - Peak Throughput: ${maxThroughput.toFixed(2)} TPS`);
      console.log(`   - Batch Processing: Up to ${Math.max(...benchmarkResults.scalability.map(r => r.batchSize))} concurrent transactions\n`);
    }
    
    console.log("4. FEATURE PERFORMANCE:");
    console.log(`   - Badge System: Real-time tier calculation`);
    console.log(`   - Milestone Tracking: Automated threshold detection`);
    console.log(`   - Leaderboard: ${benchmarkResults.leaderboard?.avgQueryTime || 'N/A'}ms average query time\n`);
    
    console.log("==========================================\n");
  });
});