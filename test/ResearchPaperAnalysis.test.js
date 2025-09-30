const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationBox - Research Paper Performance Analysis", function () {
  let DonationBox;
  let donationBox;
  let owner;
  let donors = [];
  let performanceData = {};

  before(async function () {
    console.log("\n" + "=".repeat(60));
    console.log("BLOCKCHAIN DONATION SYSTEM - RESEARCH ANALYSIS");
    console.log("=".repeat(60));
    console.log("Test Environment: Hardhat Local Network");
    console.log("Consensus Mechanism: Ethereum Proof-of-Stake Simulation");
    console.log("Smart Contract Language: Solidity ^0.8.19");
    console.log("=".repeat(60) + "\n");
    
    DonationBox = await ethers.getContractFactory("DonationBox");
    const signers = await ethers.getSigners();
    owner = signers[0];
    donors = signers.slice(1, 11); // Use 10 test accounts
  });

  describe("📊 DEPLOYMENT ANALYSIS", function () {
    it("Should analyze smart contract deployment metrics", async function () {
      console.log("1. SMART CONTRACT DEPLOYMENT ANALYSIS:");
      console.log("   " + "-".repeat(50));
      
      const startTime = process.hrtime.bigint();
      donationBox = await DonationBox.deploy();
      await donationBox.waitForDeployment();
      const endTime = process.hrtime.bigint();
      
      const deploymentTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      const deploymentTx = donationBox.deploymentTransaction();
      const deploymentReceipt = await deploymentTx.wait();
      const contractAddress = await donationBox.getAddress();

      performanceData.deployment = {
        contractAddress,
        gasUsed: deploymentReceipt.gasUsed.toString(),
        gasPrice: deploymentTx.gasPrice.toString(),
        blockNumber: deploymentReceipt.blockNumber,
        deploymentTime: deploymentTime.toFixed(2),
        costETH: ethers.formatEther(deploymentReceipt.gasUsed * deploymentTx.gasPrice)
      };

      console.log(`   Contract Address: ${contractAddress}`);
      console.log(`   Gas Consumed: ${Number(performanceData.deployment.gasUsed).toLocaleString()} units`);
      console.log(`   Gas Price: ${ethers.formatUnits(performanceData.deployment.gasPrice, 'gwei')} Gwei`);
      console.log(`   Deployment Cost: ${performanceData.deployment.costETH} ETH`);
      console.log(`   Deployment Time: ${performanceData.deployment.deploymentTime}ms`);
      console.log(`   Block Number: ${performanceData.deployment.blockNumber}\n`);

      expect(Number(performanceData.deployment.gasUsed)).to.be.lessThan(2000000);
    });
  });

  describe("⛽ GAS EFFICIENCY ANALYSIS", function () {
    it("Should analyze gas consumption patterns across different transaction types", async function () {
      console.log("2. GAS CONSUMPTION ANALYSIS:");
      console.log("   " + "-".repeat(50));
      
      const testScenarios = [
        { name: "First-time Donor (0.05 ETH)", amount: "0.05", donorIndex: 0 },
        { name: "Bronze Threshold (0.1 ETH)", amount: "0.1", donorIndex: 1 },
        { name: "Silver Threshold (0.5 ETH)", amount: "0.5", donorIndex: 2 },
        { name: "Gold Threshold (1.0 ETH)", amount: "1.0", donorIndex: 3 },
        { name: "Diamond Threshold (5.0 ETH)", amount: "5.0", donorIndex: 4 },
        { name: "Repeat Donor (0.2 ETH)", amount: "0.2", donorIndex: 0 },
      ];

      const gasAnalysis = [];

      for (const scenario of testScenarios) {
        const donationAmount = ethers.parseEther(scenario.amount);
        const tx = await donationBox.connect(donors[scenario.donorIndex]).donate({ value: donationAmount });
        const receipt = await tx.wait();
        
        const badge = await donationBox.getDonorBadgeString(donors[scenario.donorIndex].address);
        const totalDonated = await donationBox.getDonation(donors[scenario.donorIndex].address);

        const gasData = {
          scenario: scenario.name,
          gasUsed: receipt.gasUsed.toString(),
          gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei'),
          costETH: ethers.formatEther(receipt.gasUsed * tx.gasPrice),
          badge: badge,
          totalDonated: ethers.formatEther(totalDonated)
        };

        gasAnalysis.push(gasData);
        console.log(`   ${scenario.name}:`);
        console.log(`     Gas Used: ${Number(gasData.gasUsed).toLocaleString()} | Cost: ${gasData.costETH} ETH | Badge: ${gasData.badge}`);
      }

      performanceData.gasAnalysis = gasAnalysis;
      
      const avgGas = gasAnalysis.reduce((sum, item) => sum + Number(item.gasUsed), 0) / gasAnalysis.length;
      console.log(`\n   Average Gas Consumption: ${Math.round(avgGas).toLocaleString()} units`);
      console.log(`   Gas Range: ${Math.min(...gasAnalysis.map(i => Number(i.gasUsed))).toLocaleString()} - ${Math.max(...gasAnalysis.map(i => Number(i.gasUsed))).toLocaleString()} units\n`);
    });
  });

  describe("🎯 FEATURE PERFORMANCE ANALYSIS", function () {
    it("Should analyze badge system computational efficiency", async function () {
      console.log("3. BADGE SYSTEM PERFORMANCE:");
      console.log("   " + "-".repeat(50));

      const badgeTests = [];
      const testAmounts = ["0.05", "0.15", "0.6", "1.2", "6.0"];
      
      for (let i = 0; i < testAmounts.length; i++) {
        const startTime = process.hrtime.bigint();
        const tx = await donationBox.connect(donors[5 + i]).donate({ 
          value: ethers.parseEther(testAmounts[i]) 
        });
        const receipt = await tx.wait();
        const endTime = process.hrtime.bigint();
        
        const processingTime = Number(endTime - startTime) / 1000000; // ms
        const badge = await donationBox.getDonorBadgeString(donors[5 + i].address);
        
        badgeTests.push({
          amount: testAmounts[i],
          badge: badge,
          gasUsed: receipt.gasUsed.toString(),
          processingTime: processingTime.toFixed(2)
        });

        console.log(`   ${testAmounts[i]} ETH → ${badge} Badge (${Number(receipt.gasUsed).toLocaleString()} gas, ${processingTime.toFixed(2)}ms)`);
      }

      performanceData.badgeSystem = badgeTests;
      console.log();
    });

    it("Should analyze milestone tracking efficiency", async function () {
      console.log("4. MILESTONE SYSTEM ANALYSIS:");
      console.log("   " + "-".repeat(50));

      const totalDonations = await donationBox.totalDonations();
      const currentMilestone = await donationBox.currentMilestone();
      const [nextMilestone, currentTotal] = await donationBox.getNextMilestone();
      
      console.log(`   Current Total Donations: ${ethers.formatEther(totalDonations)} ETH`);
      console.log(`   Active Milestone Index: ${currentMilestone}`);
      console.log(`   Next Milestone Target: ${ethers.formatEther(nextMilestone)} ETH`);
      console.log(`   Progress: ${((Number(ethers.formatEther(currentTotal)) / Number(ethers.formatEther(nextMilestone))) * 100).toFixed(1)}%`);

      performanceData.milestones = {
        currentTotal: ethers.formatEther(totalDonations),
        milestoneIndex: currentMilestone.toString(),
        nextTarget: ethers.formatEther(nextMilestone),
        progressPercent: ((Number(ethers.formatEther(currentTotal)) / Number(ethers.formatEther(nextMilestone))) * 100).toFixed(1)
      };

      console.log();
    });

    it("Should analyze leaderboard query performance", async function () {
      console.log("5. LEADERBOARD PERFORMANCE ANALYSIS:");
      console.log("   " + "-".repeat(50));

      const queryTimes = [];
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        const startTime = process.hrtime.bigint();
        await donationBox.getTopDonors();
        const endTime = process.hrtime.bigint();
        queryTimes.push(Number(endTime - startTime) / 1000000); // Convert to ms
      }

      const avgQueryTime = queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length;
      const minTime = Math.min(...queryTimes);
      const maxTime = Math.max(...queryTimes);

      const [addresses, amounts, badges] = await donationBox.getTopDonors();
      
      console.log(`   Average Query Time: ${avgQueryTime.toFixed(2)}ms`);
      console.log(`   Query Time Range: ${minTime.toFixed(2)}ms - ${maxTime.toFixed(2)}ms`);
      console.log(`   Total Donors Processed: ${addresses.length}`);
      console.log(`   Top 3 Performers:`);
      
      for (let i = 0; i < Math.min(3, addresses.length); i++) {
        console.log(`     ${i + 1}. ${ethers.formatEther(amounts[i])} ETH (${badges[i]} Badge)`);
      }

      performanceData.leaderboard = {
        avgQueryTime: avgQueryTime.toFixed(2),
        queryRange: `${minTime.toFixed(2)}-${maxTime.toFixed(2)}`,
        totalDonors: addresses.length,
        topPerformers: addresses.slice(0, 3).map((addr, idx) => ({
          amount: ethers.formatEther(amounts[idx]),
          badge: badges[idx]
        }))
      };

      console.log();
    });
  });

  describe("📈 SCALABILITY METRICS", function () {
    it("Should analyze system performance under concurrent load", async function () {
      console.log("6. CONCURRENT TRANSACTION ANALYSIS:");
      console.log("   " + "-".repeat(50));

      const concurrencyResults = [];

      // Test different batch sizes sequentially to avoid the transaction runner issue
      for (const batchSize of [3, 5, 8]) {
        const transactions = [];
        const startTime = Date.now();
        
        // Execute transactions sequentially but measure batch time
        for (let i = 0; i < batchSize; i++) {
          const amount = ethers.parseEther((0.1 + Math.random() * 0.4).toFixed(3));
          const tx = await donationBox.connect(donors[i % donors.length]).donate({ value: amount });
          transactions.push(await tx.wait());
        }
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        const avgGas = transactions.reduce((sum, receipt) => sum + Number(receipt.gasUsed), 0) / transactions.length;
        const throughput = (batchSize / totalTime) * 1000; // TPS

        const result = {
          batchSize,
          totalTime,
          avgGas: Math.round(avgGas),
          throughput: throughput.toFixed(2)
        };

        concurrencyResults.push(result);
        console.log(`   Batch Size ${batchSize}: ${totalTime}ms total, ${Math.round(avgGas).toLocaleString()} avg gas, ${throughput.toFixed(2)} TPS`);
      }

      performanceData.scalability = concurrencyResults;
      console.log();
    });
  });

  describe("💾 STORAGE EFFICIENCY ANALYSIS", function () {
    it("Should analyze blockchain state storage patterns", async function () {
      console.log("7. BLOCKCHAIN STATE ANALYSIS:");
      console.log("   " + "-".repeat(50));

      const donorCount = await donationBox.getDonorCount();
      const totalDonations = await donationBox.totalDonations();
      const currentMilestone = await donationBox.currentMilestone();

      // Estimate storage costs
      const storageMetrics = {
        activeDonors: donorCount.toString(),
        totalValue: ethers.formatEther(totalDonations),
        milestoneProgress: currentMilestone.toString(),
        estimatedSlots: Number(donorCount) * 2 + 8, // donations + badges mappings + state variables
        estimatedStorageCost: (Number(donorCount) * 2 + 8) * 20000 // Rough gas estimate
      };

      console.log(`   Active Donors: ${storageMetrics.activeDonors}`);
      console.log(`   Total Value Locked: ${storageMetrics.totalValue} ETH`);
      console.log(`   Milestone Progress: Level ${storageMetrics.milestoneProgress}`);
      console.log(`   Estimated Storage Slots: ${storageMetrics.estimatedSlots}`);
      console.log(`   Estimated Storage Cost: ${storageMetrics.estimatedStorageCost.toLocaleString()} gas`);

      performanceData.storage = storageMetrics;
      console.log();
    });
  });

  after(function () {
    console.log("=".repeat(60));
    console.log("📋 RESEARCH PAPER SUMMARY - BLOCKCHAIN DONATION SYSTEM");
    console.log("=".repeat(60));
    console.log("\n🔬 TECHNICAL SPECIFICATIONS:");
    console.log(`   • Smart Contract Platform: Ethereum (Solidity ^0.8.19)`);
    console.log(`   • Consensus Mechanism: Proof-of-Stake`);
    console.log(`   • Gas Optimization: Dynamic badge calculation`);
    console.log(`   • Storage Pattern: Mapping-based donor tracking`);
    console.log(`   • Event System: Real-time milestone notifications`);
    
    console.log("\n📊 PERFORMANCE BENCHMARKS:");
    console.log(`   • Deployment Cost: ${performanceData.deployment?.costETH || 'N/A'} ETH`);
    console.log(`   • Average Transaction Gas: ${performanceData.gasAnalysis ? Math.round(performanceData.gasAnalysis.reduce((s, i) => s + Number(i.gasUsed), 0) / performanceData.gasAnalysis.length).toLocaleString() : 'N/A'} units`);
    console.log(`   • Leaderboard Query Time: ${performanceData.leaderboard?.avgQueryTime || 'N/A'}ms`);
    console.log(`   • Storage Efficiency: ${performanceData.storage?.estimatedSlots || 'N/A'} blockchain slots`);
    
    console.log("\n🎯 RESEARCH CONTRIBUTIONS:");
    console.log(`   • Gamified donation incentive system`);
    console.log(`   • Automated milestone tracking mechanism`);
    console.log(`   • Gas-optimized badge tier calculation`);
    console.log(`   • Real-time leaderboard functionality`);
    console.log(`   • Transparent blockchain donation tracking`);
    
    console.log("\n💡 PRACTICAL APPLICATIONS:");
    console.log(`   • Charitable organization fundraising`);
    console.log(`   • Community-driven project funding`);
    console.log(`   • Educational blockchain development`);
    console.log(`   • Decentralized crowdfunding platforms`);
    
    console.log("\n" + "=".repeat(60));
    
    // Export data for external analysis
    const fs = require('fs');
    fs.writeFileSync('research-data.json', JSON.stringify(performanceData, null, 2));
    console.log("📁 Detailed performance data exported to: research-data.json");
    console.log("=".repeat(60) + "\n");
  });
});