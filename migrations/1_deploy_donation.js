const Donation = artifacts.require("Donation");

module.exports = function(deployer) {
  deployer.deploy(Donation, "0x4988F1B64FcAB8633b7009b4aF4dc7960925BFFF");
};