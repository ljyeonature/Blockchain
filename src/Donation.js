import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DonationContract from "./contracts/Donation.json";
import "./App.css";

function Donation() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  useEffect(() => {
    initializeWeb3();
    // eslint-disable-next-line
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = DonationContract.networks[networkId];
        const instance = new web3.eth.Contract(
          DonationContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        fetchTotalDonations(instance);
        fetchWithdrawnAmount(instance);
        fetchRewardClaimed(instance);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Metamask not detected.");
    }
  };

  const fetchTotalDonations = async (instance) => {
    if (web3) {
      const totalDonations = await instance.methods.totalDonations().call();
      setTotalDonations(web3.utils.fromWei(totalDonations, "ether"));
    }
  };

  const fetchWithdrawnAmount = async (instance) => {
    if (web3) {
      const withdrawn = await instance.methods.withdrawnAmount().call();
      setWithdrawnAmount(web3.utils.fromWei(withdrawn, "ether"));
    }
  };

  const fetchRewardClaimed = async (instance) => {
    if (web3) {
      const rewarded = await instance.methods.donors(account).call();
      const rewardAmount = web3.utils.fromWei(rewarded.donationAmount, "ether");
      setRewardClaimed(rewarded.rewarded);
      setRewardAmount(rewardAmount);
    }
  };

  const donate = async () => {
    if (contract) {
      try {
        const amountInWei = web3.utils.toWei(donationAmount.toString(), "ether");
        await contract.methods.donate().send({ from: account, value: amountInWei });
        setDonationAmount(0);
        fetchTotalDonations(contract);
        fetchRewardClaimed(contract);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const claimReward = async () => {
    if (contract) {
      try {
        await contract.methods.claimReward().send({ from: account });
        fetchRewardClaimed(contract);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const withdrawReward = async () => {
    if (contract) {
      try {
        await contract.methods.withdrawReward().send({ from: account });
        fetchRewardClaimed(contract);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const withdrawDonations = async () => {
    if (contract) {
      try {
        await contract.methods.withdrawDonations().send({ from: account });
        fetchWithdrawnAmount(contract);
        fetchTotalDonations(contract);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div id="App">
      <div className="container">
        <h1>Donation Demo</h1>
        {account && <p>Connected Account: {account}</p>}
        <p>Total Donations: {totalDonations} ETH</p>
        <p>Withdrawn Amount: {withdrawnAmount} ETH</p>
        <label>
          Donation Amount:
          <input
            type="number"
            min="0"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
          />
        </label>
        <button onClick={donate}>Donate</button>
        <p>
          <button onClick={withdrawDonations}>Withdraw Donations</button>
        </p>
        {rewardClaimed ? (
          <p>Reward Claimed {rewardAmount} ETH</p>
        ) : (
          <div>
            <button onClick={claimReward}>Claim Reward</button>
            <button onClick={withdrawReward}>Withdraw Reward</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Donation;
