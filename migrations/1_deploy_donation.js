const Donation = artifacts.require("Donation");

module.exports = function(deployer) {
  const receiverAddress = "0x98bEb30af64134b352198e03Bb23Add5aC55821e";
  const charityAddress = "0x80d8ca90fA37545710581Eab91770832EE185990"; // charityAddress를 원하는 주소로 설정

  deployer.deploy(Donation, receiverAddress, { value: 0, gas: 3500000 })
    .then(async (donationContract) => {
      await donationContract.setCharityAddress(charityAddress);
    });
};