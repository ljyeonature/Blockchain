// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    struct Donor {
        address donorAddress;
        uint256 donationAmount;
        bool rewarded; // 보상 여부
    }

    mapping(address => Donor) public donors;
    address public charityAddress;
    address public receiverAddress; // 기부금을 받을 주소
    uint256 public totalDonations;
    uint256 public withdrawnAmount;
    uint256 public rewardAmount = 0 ether; // 보상 금액 - 기부할 때마다 0.01 ETH를 제공

    event DonationReceived(address indexed donor, uint256 amount);
    event DonationWithdrawn(address indexed receiver, uint256 amount);
    event RewardClaimed(address indexed donor, uint256 amount);
    
    constructor(address _receiverAddress) payable {
        charityAddress = msg.sender;
        receiverAddress = _receiverAddress;
    }

    function setReceiverAddress(address _receiverAddress) public {
        require(msg.sender == receiverAddress, "Only the charity can set the receiver address.");
        receiverAddress = _receiverAddress;
    }
    
    function setCharityAddress(address _charityAddress) public {
        require(msg.sender == charityAddress, "Only the charity can set the charity address.");
        charityAddress = _charityAddress;
    }

    function donate(address _donorAddress) public payable {
        require(msg.value > 0, "Donation amount should be greater than zero.");

        Donor storage donor = donors[_donorAddress];
        donor.donorAddress = _donorAddress;
        donor.donationAmount += msg.value;
        donor.rewarded = false;

        totalDonations += msg.value;

        emit DonationReceived(_donorAddress, msg.value);

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

        (bool success, ) = payable(msg.sender).call{value: rewardAmount, gas: gasleft()}("");
        require(success, "Reward claim failed.");

        emit RewardClaimed(msg.sender, rewardAmount);
        rewardAmount = 0;
        totalDonations -= 0.01 ether;
    }

    function withdrawDonations(address _receiverAddress) public {
        require(msg.sender == charityAddress, "Only the charity can withdraw the donations.");
        require(totalDonations > 0, "There are no donations to withdraw");

         (bool success, ) = receiverAddress.call{value: totalDonations}("");
        require(success, "Withdrawal failed.");

        withdrawnAmount += totalDonations;
        emit DonationWithdrawn(_receiverAddress, totalDonations);

        totalDonations = 0;
    }


    function getCharityAddress() public view returns (address) {
        return charityAddress;
    }

    function getReceiverAddress() public view returns (address) {
        return receiverAddress;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
