const Donation = artifacts.require("Donation");

module.exports = function(deployer) {
  const receiverAddress = "0x11BF1de382540166edEc5d2e501bDfD0B68d7762";
  const charityAddress = "0x0876CEF7D19Ff0990F3f000D2438a5482182A5b5"; // charityAddress를 원하는 주소로 설정

  deployer.deploy(Donation, receiverAddress, { value: 0, gas: 3500000 })
    .then(async (donationContract) => {
      await donationContract.setCharityAddress(charityAddress);
    });
};