import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DonationContract from "./contracts/Donation.json";
import DonateForm from "./DonateForm";
import WithdrawForm from "./WithdrawForm";
import RewardClaim from "./RewardClaim";

const Donation = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [charityAddress, setCharityAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [rewardCounts, setRewardCounts] = useState({});
  const [rewarded, setRewarded] = useState(false);
  const [metamaskAccount, setMetamaskAccount] = useState("");
  const [contractBalance, setContractBalance] = useState(0);


  const saveRewardCountsToLocalStorage = (counts) => {
    localStorage.setItem("rewardCounts", JSON.stringify(counts));
  };

  const loadRewardCountsFromLocalStorage = () => {
    const countsFromStorage = JSON.parse(localStorage.getItem("rewardCounts"));
    return countsFromStorage || {};
  };

  
  useEffect(() => {
    loadBlockchainData();
  }, []);

  useEffect(() => {
    const countsFromStorage = loadRewardCountsFromLocalStorage();
    setRewardCounts(countsFromStorage);
  }, []);

  useEffect(() => {
    saveRewardCountsToLocalStorage(rewardCounts);
  }, [rewardCounts]);

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      setMetamaskAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const networkData = DonationContract.networks[networkId];
      if (networkData) {
        const contractInstance = new web3.eth.Contract(
          DonationContract.abi,
          networkData.address
        );
        setContract(contractInstance);

        const reward = await contractInstance.methods.rewardAmount().call();
        setRewardAmount(reward);

        const donations = await contractInstance.methods.totalDonations().call();
        setTotalDonations(donations);

        const withdrawn = await contractInstance.methods.withdrawnAmount().call();
        setWithdrawnAmount(withdrawn);

        const charityAddr = await contractInstance.methods
          .getCharityAddress()
          .call();
        setCharityAddress(charityAddr);

        const receiverAddr = await contractInstance.methods
          .getReceiverAddress()
          .call();
        setReceiverAddress(receiverAddr);

        const balance = await contractInstance.methods.getContractBalance().call();
        setContractBalance(balance);
      }
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Donation App</h1>
      <p>Account: {account}</p>
      <p>Charity Address: {charityAddress}</p>
      <p>Receiver Address: {receiverAddress}</p>
      <p>
        Total Donations:{" "}
        {parseFloat(Web3.utils.fromWei(totalDonations.toString(), "ether")).toFixed(2)} ETH
      </p>
      <p>
        Withdrawn Amount:{" "}
        {parseFloat(Web3.utils.fromWei(withdrawnAmount.toString(), "ether")).toFixed(2)} ETH
      </p>
      {/* 스마트 컨트랙트 주소에 담긴 잔액 */}
      <p>
        Contract Balance:{" "}
        {parseFloat(Web3.utils.fromWei(contractBalance.toString(), "ether")).toFixed(2)} ETH
      </p>
      {/* 기부하기 - 기부자 */}
      {metamaskAccount !== charityAddress && metamaskAccount !== receiverAddress ? 
      (<DonateForm
        account={account}
        contract={contract}
        setTotalDonations={setTotalDonations}
        setRewardCounts={setRewardCounts}
        saveRewardCountsToLocalStorage={saveRewardCountsToLocalStorage}
      />) : <p></p>
      
    }
    {/* 인출하기 - 자선단체 */}
    {metamaskAccount === charityAddress ?
    (<WithdrawForm
      account={account}
      contract={contract}
      setWithdrawnAmount={setWithdrawnAmount}
      receiverAddress={receiverAddress}
    />) : <p></p>      
    }
    {/* 보상받기 - 기부자 : 기부할 때마다 0.01씩 */}
    {
      metamaskAccount !== charityAddress && metamaskAccount !== receiverAddress ? (
        <div>
          <p>Reward Amount : {rewardAmount} ETH</p>
          <p>
            Total Reward Amount (Account {account}): {rewardCounts[account] * 0.01 || 0} ETH
          </p>
          {!rewarded ? (
            <RewardClaim
              account={account}
              contract={contract}
              setRewardAmount={setRewardAmount}
              setRewarded={setRewarded}
            />
          ) : (
            <div>
              <p>Reward claimed.</p>
            </div>
          )}
        </div>
      ) : (
        <p></p>
      )
    }
    </div>
  );
};

export default Donation;