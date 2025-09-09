// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DonationBox
 * @dev A simple donation contract where users can send ETH and track their donations
 * @notice This contract leverages Ethereum's Proof-of-Stake consensus mechanism to ensure
 *         all donation transactions are cryptographically secure and immutably recorded
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
    
    // Milestone tracking
    uint256[] public milestones = [1 ether, 5 ether, 10 ether, 25 ether, 50 ether];
    uint256 public currentMilestone = 0;
    
    // Badge system - enum for donor tiers
    enum DonorBadge { None, Bronze, Silver, Gold, Diamond }
    mapping(address => DonorBadge) public donorBadges;
    
    // Events to log donations and achievements
    event DonationMade(address indexed donor, uint256 amount, DonorBadge newBadge);
    event MilestoneReached(uint256 milestone, uint256 totalAmount);
    event BadgeAwarded(address indexed donor, DonorBadge badge);
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Function to donate ETH to the contract
     * This function is payable, meaning it can receive ETH
     * @notice Each donation is validated and finalized through Ethereum's PoS consensus
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
        
        // Check for milestone achievements
        _checkMilestones();
        
        // Update donor badge based on total donations
        DonorBadge newBadge = _updateDonorBadge(msg.sender);
        
        // Emit the donation event with badge info
        emit DonationMade(msg.sender, msg.value, newBadge);
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
    
    /**
     * @dev Internal function to check and update milestones
     */
    function _checkMilestones() private {
        while (currentMilestone < milestones.length && 
               totalDonations >= milestones[currentMilestone]) {
            emit MilestoneReached(milestones[currentMilestone], totalDonations);
            currentMilestone++;
        }
    }
    
    /**
     * @dev Internal function to update donor badge based on total donations
     */
    function _updateDonorBadge(address donor) private returns (DonorBadge) {
        uint256 donorTotal = donations[donor];
        DonorBadge oldBadge = donorBadges[donor];
        DonorBadge newBadge = oldBadge;
        
        if (donorTotal >= 5 ether) {
            newBadge = DonorBadge.Diamond;
        } else if (donorTotal >= 1 ether) {
            newBadge = DonorBadge.Gold;
        } else if (donorTotal >= 0.5 ether) {
            newBadge = DonorBadge.Silver;
        } else if (donorTotal >= 0.1 ether) {
            newBadge = DonorBadge.Bronze;
        }
        
        if (newBadge != oldBadge) {
            donorBadges[donor] = newBadge;
            emit BadgeAwarded(donor, newBadge);
        }
        
        return newBadge;
    }
    
    /**
     * @dev Get the next milestone target
     */
    function getNextMilestone() public view returns (uint256, uint256) {
        if (currentMilestone >= milestones.length) {
            return (0, totalDonations); // All milestones reached
        }
        return (milestones[currentMilestone], totalDonations);
    }
    
    /**
     * @dev Get donor badge as string for frontend
     */
    function getDonorBadgeString(address donor) public view returns (string memory) {
        DonorBadge badge = donorBadges[donor];
        if (badge == DonorBadge.Diamond) return "Diamond";
        if (badge == DonorBadge.Gold) return "Gold";
        if (badge == DonorBadge.Silver) return "Silver";
        if (badge == DonorBadge.Bronze) return "Bronze";
        return "None";
    }
    
    /**
     * @dev Get leaderboard - top 5 donors with their badges
     */
    function getTopDonors() public view returns (address[] memory, uint256[] memory, string[] memory) {
        uint256 length = donors.length > 5 ? 5 : donors.length;
        address[] memory topDonors = new address[](length);
        uint256[] memory topAmounts = new uint256[](length);
        string[] memory topBadges = new string[](length);
        
        // Simple bubble sort for top donors (inefficient but works for small arrays)
        for (uint256 i = 0; i < length; i++) {
            uint256 maxAmount = 0;
            uint256 maxIndex = 0;
            
            for (uint256 j = 0; j < donors.length; j++) {
                bool alreadySelected = false;
                for (uint256 k = 0; k < i; k++) {
                    if (topDonors[k] == donors[j]) {
                        alreadySelected = true;
                        break;
                    }
                }
                
                if (!alreadySelected && donations[donors[j]] > maxAmount) {
                    maxAmount = donations[donors[j]];
                    maxIndex = j;
                }
            }
            
            if (maxAmount > 0) {
                topDonors[i] = donors[maxIndex];
                topAmounts[i] = maxAmount;
                topBadges[i] = getDonorBadgeString(donors[maxIndex]);
            }
        }
        
        return (topDonors, topAmounts, topBadges);
    }
}
