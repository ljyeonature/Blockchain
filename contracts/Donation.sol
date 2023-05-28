// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    struct Donor {
        address donorAddress;
        uint256 donationAmount;
        bool rewarded;
    }

    mapping(address => Donor) public donors;
    address public charityAddress;
    address public receiverAddress; // 기부금을 받을 주소
    uint256 public totalDonations;
    uint256 public withdrawnAmount;
    uint256 public rewardAmount = 0.01 ether; // 보상 금액

    event DonationReceived(address indexed donor, uint256 amount);
    event DonationWithdrawn(address indexed receiver, uint256 amount);
    event RewardClaimed(address indexed donor, uint256 amount);
    event RewardWithdrawn(address indexed donor, uint256 amount);
    
    constructor(address _receiverAddress) payable {
        charityAddress = msg.sender;
        receiverAddress = _receiverAddress;
    }

    function setReceiverAddress(address _receiverAddress) public {
        require(msg.sender == charityAddress, "Only the charity can set the receiver address.");
        receiverAddress = _receiverAddress;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation amount should be greater than zero.");

        Donor storage donor = donors[msg.sender];
        donor.donorAddress = msg.sender;
        donor.donationAmount += msg.value;
        donor.rewarded = false;

        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);

        // 기부할 때마다 보상금 추가
        rewardAmount += 0.01 ether;
    }

    function getDonorDonation(address donorAddress) public view returns (uint256) {
        return donors[donorAddress].donationAmount;
    }

    function claimReward() public {
        Donor storage donor = donors[msg.sender];
        require(donor.donationAmount > 0, "No donations made by the caller.");
        require(!donor.rewarded, "Reward has already been claimed by the caller.");

        require(address(this).balance >= rewardAmount, "Contract does not have enough balance to pay the reward.");

        donor.rewarded = true;

        emit RewardClaimed(msg.sender, rewardAmount);
    }

    function withdrawDonations() public {
        require(msg.sender == charityAddress, "Only the charity can withdraw the donations.");
        require(totalDonations > 0, "There are no donations to withdraw");

        (bool success, ) = receiverAddress.call{value: totalDonations}("");
        require(success, "Withdrawal failed.");

        withdrawnAmount += totalDonations;
        emit DonationWithdrawn(receiverAddress, totalDonations);

        totalDonations = 0;
    }

    function withdrawReward() public {
        Donor storage donor = donors[msg.sender];
        require(donor.rewarded, "Reward has not been claimed by the caller yet.");

        donor.rewarded = false;

        (bool success, ) = payable(msg.sender).call{value: rewardAmount, gas: gasleft()}("");
        require(success, "Reward claim failed.");

        emit RewardWithdrawn(msg.sender, rewardAmount);
    }
}
