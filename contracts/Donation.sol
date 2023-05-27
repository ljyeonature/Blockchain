// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    // 기부자 구조체
    struct Donor {
        address donorAddress; // 기부자 주소
        uint256 donationAmount; // 기부자 기부금액
    }

    mapping(address => Donor) public donors;
    address public charityAddress; // 기부금 받는 단체 주소
    uint256 public totalDonations; // 전체 기부
    uint256 public withdrawnAmount; // 인출된 기부금

    event DonationReceived(address indexed donor, uint256 amount);

    constructor() payable {
        charityAddress = msg.sender; // 스마트 컨트랙트 배포 주소가 기부금 받는 단체 주소
    }

    function donate() public payable {
        require(msg.value > 0, "Donation amount should be greater than zero.");
        
        Donor storage donor = donors[msg.sender];
        donor.donorAddress = msg.sender;
        donor.donationAmount += msg.value;
        
        totalDonations += msg.value;
        
        emit DonationReceived(msg.sender, msg.value);
    }

    function getDonorDonation(address donorAddress) public view returns (uint256) {
        return donors[donorAddress].donationAmount;
    }

    function withdrawDonations() public {
        require(msg.sender == charityAddress, "Only the charity can withdraw the donations.");
         require(totalDonations > 0, "There are no donations to withdraw");

        (bool success, ) = charityAddress.call{value: totalDonations}("");
        require(success, "Withdrawal failed.");
        
        withdrawnAmount += totalDonations;
        totalDonations = 0;
    }
}
