// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    struct Donor {
        address donorAddress;
        uint256 donationAmount;
        bool rewarded; // 보상 여부
    }

    struct Product {
        uint256 productId;
        string name;
        uint256 price;
        address charityAddress;
    }

    struct Purchase {
        address buyer;
        string productName;
        uint256 productId;
        uint256 purchaseAmount;
    }

    mapping(address => Donor) public donors;
    mapping(uint256 => Product) public products; // 물건 정보를 관리하는 매핑
    mapping(uint256 => address) public productSellers; // 물건의 ID에 해당하는 판매자 주소를 관리하는 매핑
    mapping(uint256 => Purchase) public purchases;

    address public charityAddress;
    address public receiverAddress; // 기부금을 받을 주소
    uint256 public totalDonations;
    uint256 public withdrawnAmount;
    uint256 public rewardAmount; // 보상 금액
    uint256 public projectCount; // 물건 개수
    uint256 public purchaseCount;

    event DonationReceived(address indexed donor, uint256 amount);
    event DonationWithdrawn(address indexed receiver, uint256 amount);
    event RewardClaimed(address indexed donor, uint256 amount);
    event ProductPurchased(address indexed buyer, uint256 productId, uint256 price);
    
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
        require(msg.value > 2 ether, "Donation amount should be greater than zero.");

        Donor storage donor = donors[_donorAddress];
        donor.donorAddress = _donorAddress;
        donor.donationAmount += msg.value;
        donor.rewarded = false;
        totalDonations += msg.value;
        emit DonationReceived(_donorAddress, msg.value);
        // 기부할 때마다 보상금 추가
        rewardAmount += 1 ether;
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
        totalDonations = getContractBalance();
        rewardAmount = 0;
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

    // 판매자 등록 / 물건 구매
    function addProduct(string memory _name, uint256 _price, address _sellerAddress) public {
        require(msg.sender == charityAddress, "Only the charity can add products.");
        
        uint256 productId = projectCount;
        Product memory newProduct = Product(productId, _name, _price, _sellerAddress);
        products[productId] = newProduct;
        productSellers[productId] = charityAddress;
        projectCount++;
    }

    function getProductsCount() public view returns (uint) {
        return projectCount;
    }
    
    function getProduct(uint256 _productId) public view returns (string memory, uint256, address) {
        require(_productId < projectCount, "Invalid product ID.");
        return (products[_productId].name, products[_productId].price, products[_productId].charityAddress);
    }

    function purchaseProduct(uint256 _productId) public payable{
        require(products[_productId].price > 0, "Invalid product ID.");

        string memory productName = products[_productId].name;
        uint256 productPrice = products[_productId].price;
        require(address(this).balance >= productPrice, "Contract does not have enough balance to purchase the product.");

        (bool success, ) = products[_productId].charityAddress.call{value: productPrice, gas: gasleft()}("");
        require(success, "Product purchase failed.");


        // 구매 내역 저장
        Purchase memory newPurchase = Purchase(msg.sender, productName, _productId, productPrice);
        purchases[purchaseCount] = newPurchase;
        purchaseCount++;

        totalDonations = getContractBalance();

        emit ProductPurchased(msg.sender, _productId, productPrice);
    }

    function getRewardAmount() public view returns (uint256) {
        return rewardAmount;
    }


}
