// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DonationBox
 * @dev A simple donation contract where users can send ETH and track their donations
 */
contract DonationBox {
    // Mapping to store the total donations made by each address
    mapping(address => uint256) public donations;
    
    // Array to keep track of all donors
    address[] public donors;
    
    // Total amount donated to the contract
    uint256 public totalDonations;
    
    // Owner of the contract (who deployed it)
    address public owner;
    
    // Events to log donations
    event DonationMade(address indexed donor, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Function to donate ETH to the contract
     * This function is payable, meaning it can receive ETH
     */
    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        
        // If this is the first donation from this address, add them to donors array
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        
        // Update the donor's total donations
        donations[msg.sender] += msg.value;
        
        // Update total donations
        totalDonations += msg.value;
        
        // Emit the donation event
        emit DonationMade(msg.sender, msg.value);
    }
    
    /**
     * @dev Get the total donation amount for a specific address
     * @param donor The address to check donations for
     * @return The total amount donated by the address
     */
    function getDonation(address donor) public view returns (uint256) {
        return donations[donor];
    }
    
    /**
     * @dev Get the contract's total balance
     * @return The contract's ETH balance
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get the total number of unique donors
     * @return The number of unique donors
     */
    function getDonorCount() public view returns (uint256) {
        return donors.length;
    }
    
    /**
     * @dev Get all donors (useful for frontend display)
     * @return Array of donor addresses
     */
    function getAllDonors() public view returns (address[] memory) {
        return donors;
    }
    
    /**
     * @dev Allow the owner to withdraw funds (optional feature)
     * Only the contract owner can withdraw
     */
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance > 0, "No funds to withdraw");
        
        payable(owner).transfer(address(this).balance);
    }
}
