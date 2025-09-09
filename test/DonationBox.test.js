const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationBox", function () {
  let DonationBox;
  let donationBox;
  let owner;
  let donor1;
  let donor2;
  let donor3;

  beforeEach(async function () {
    // Get contract factory and signers
    DonationBox = await ethers.getContractFactory("DonationBox");
    [owner, donor1, donor2, donor3] = await ethers.getSigners();

    // Deploy contract
    donationBox = await DonationBox.deploy();
    await donationBox.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await donationBox.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero total donations", async function () {
      expect(await donationBox.totalDonations()).to.equal(0);
    });
  });

  describe("Donations", function () {
    it("Should allow users to donate", async function () {
      const donationAmount = ethers.parseEther("1.0");
      
      await donationBox.connect(donor1).donate({ value: donationAmount });
      
      expect(await donationBox.getDonation(donor1.address)).to.equal(donationAmount);
      expect(await donationBox.totalDonations()).to.equal(donationAmount);
    });

    it("Should track multiple donations from same user", async function () {
      const donation1 = ethers.parseEther("1.0");
      const donation2 = ethers.parseEther("2.0");
      
      await donationBox.connect(donor1).donate({ value: donation1 });
      await donationBox.connect(donor1).donate({ value: donation2 });
      
      expect(await donationBox.getDonation(donor1.address)).to.equal(donation1 + donation2);
    });

    it("Should track donations from multiple users", async function () {
      const donation1 = ethers.parseEther("1.0");
      const donation2 = ethers.parseEther("2.0");
      
      await donationBox.connect(donor1).donate({ value: donation1 });
      await donationBox.connect(donor2).donate({ value: donation2 });
      
      expect(await donationBox.getDonation(donor1.address)).to.equal(donation1);
      expect(await donationBox.getDonation(donor2.address)).to.equal(donation2);
      expect(await donationBox.getDonorCount()).to.equal(2);
    });

    it("Should reject donations of 0 ETH", async function () {
      await expect(
        donationBox.connect(donor1).donate({ value: 0 })
      ).to.be.revertedWith("Donation must be greater than 0");
    });
  });

  describe("Badge System", function () {
    it("Should award Bronze badge for 0.1 ETH donation", async function () {
      const donationAmount = ethers.parseEther("0.1");
      
      await donationBox.connect(donor1).donate({ value: donationAmount });
      
      expect(await donationBox.getDonorBadgeString(donor1.address)).to.equal("Bronze");
    });

    it("Should award Silver badge for 0.5 ETH donation", async function () {
      const donationAmount = ethers.parseEther("0.5");
      
      await donationBox.connect(donor1).donate({ value: donationAmount });
      
      expect(await donationBox.getDonorBadgeString(donor1.address)).to.equal("Silver");
    });

    it("Should award Gold badge for 1 ETH donation", async function () {
      const donationAmount = ethers.parseEther("1.0");
      
      await donationBox.connect(donor1).donate({ value: donationAmount });
      
      expect(await donationBox.getDonorBadgeString(donor1.address)).to.equal("Gold");
    });

    it("Should award Diamond badge for 5 ETH donation", async function () {
      const donationAmount = ethers.parseEther("5.0");
      
      await donationBox.connect(donor1).donate({ value: donationAmount });
      
      expect(await donationBox.getDonorBadgeString(donor1.address)).to.equal("Diamond");
    });

    it("Should upgrade badge with multiple donations", async function () {
      // Start with Bronze
      await donationBox.connect(donor1).donate({ value: ethers.parseEther("0.1") });
      expect(await donationBox.getDonorBadgeString(donor1.address)).to.equal("Bronze");
      
      // Upgrade to Gold
      await donationBox.connect(donor1).donate({ value: ethers.parseEther("0.9") });
      expect(await donationBox.getDonorBadgeString(donor1.address)).to.equal("Gold");
    });
  });

  describe("Milestone System", function () {
    it("Should track milestone progress correctly", async function () {
      // Initial state
      const [nextMilestone, currentTotal] = await donationBox.getNextMilestone();
      expect(nextMilestone).to.equal(ethers.parseEther("1.0"));
      expect(currentTotal).to.equal(0);
    });

    it("Should reach first milestone at 1 ETH", async function () {
      await expect(
        donationBox.connect(donor1).donate({ value: ethers.parseEther("1.0") })
      ).to.emit(donationBox, "MilestoneReached")
       .withArgs(ethers.parseEther("1.0"), ethers.parseEther("1.0"));
      
      expect(await donationBox.currentMilestone()).to.equal(1);
    });
  });

  describe("Leaderboard System", function () {
    it("Should return top donors correctly", async function () {
      // Make donations from different users
      await donationBox.connect(donor1).donate({ value: ethers.parseEther("2.0") });
      await donationBox.connect(donor2).donate({ value: ethers.parseEther("1.5") });
      await donationBox.connect(donor3).donate({ value: ethers.parseEther("3.0") });
      
      const [addresses, amounts, badges] = await donationBox.getTopDonors();
      
      // Should be sorted by amount (highest first)
      expect(addresses[0]).to.equal(donor3.address); // 3.0 ETH
      expect(addresses[1]).to.equal(donor1.address); // 2.0 ETH
      expect(addresses[2]).to.equal(donor2.address); // 1.5 ETH
      
      expect(badges[0]).to.equal("Gold"); // 3.0 ETH = Gold
      expect(badges[1]).to.equal("Gold"); // 2.0 ETH = Gold
      expect(badges[2]).to.equal("Gold"); // 1.5 ETH = Gold
    });
  });

  describe("Events", function () {
    it("Should emit DonationMade event with badge info", async function () {
      await expect(
        donationBox.connect(donor1).donate({ value: ethers.parseEther("0.5") })
      ).to.emit(donationBox, "DonationMade")
       .withArgs(donor1.address, ethers.parseEther("0.5"), 2); // 2 = Silver badge
    });

    it("Should emit BadgeAwarded event when badge is upgraded", async function () {
      await expect(
        donationBox.connect(donor1).donate({ value: ethers.parseEther("1.0") })
      ).to.emit(donationBox, "BadgeAwarded")
       .withArgs(donor1.address, 3); // 3 = Gold badge
    });
  });
});
