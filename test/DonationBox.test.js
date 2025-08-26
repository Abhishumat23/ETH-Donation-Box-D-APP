const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationBox", function () {
  let DonationBox;
  let donationBox;
  let owner;
  let donor1;
  let donor2;

  beforeEach(async function () {
    // Get contract factory and signers
    DonationBox = await ethers.getContractFactory("DonationBox");
    [owner, donor1, donor2] = await ethers.getSigners();

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
});
