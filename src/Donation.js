import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Web3 from "web3";
import DonationContract from "./contracts/Donation.json";
import DonateForm from "./DonateForm";
import WithdrawForm from "./WithdrawForm";
import RewardClaim from "./RewardClaim";
import ProductForm from "./ProductForm";

const Donation = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [charityAddress, setCharityAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [rewarded, setRewarded] = useState(false);
  const [metamaskAccount, setMetamaskAccount] = useState("");
  const [contractBalance, setContractBalance] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const navigate = useNavigate();
  const [rewardAmount, setRewardAmount] = useState(() => {
    const savedRewardAmount = localStorage.getItem('rewardAmount');
    return savedRewardAmount ? parseFloat(savedRewardAmount) : 0;
  })

  useEffect(() => {
    localStorage.setItem('rewardAmount', rewardAmount.toString());
  }, [rewardAmount]);

  
  
  useEffect(() => {
    loadBlockchainData();
  }, []);


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

        const reward = await contractInstance.methods.getRewardAmount().call();
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

  const handlePurchase = async () => {
    try {
      const productsCount = await contract.methods.getProductsCount().call();
      const products = [];

      for (let i = 0; i < productsCount; i++) {
        const product = await contract.methods.products(i).call();
        products.push(product);
      }

      navigate('/purchase', { state: { products } });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <button><Link to={'/'}>홈</Link></button>
      <button onClick={handlePurchase}>상점</button>
      <h1>Donation App</h1>
      <p>Account: {account}</p>
      <p>Charity Address: {charityAddress}</p>
      <p>Receiver Address: {receiverAddress}</p>
      <p>
        Total Donations:{" "}
        {parseFloat(Web3.utils.fromWei(totalDonations.toString(), "ether"))} ETH
      </p>
      <p>
        Withdrawn Amount:{" "}
        {parseFloat(Web3.utils.fromWei(withdrawnAmount.toString(), "ether"))} ETH
      </p>
      {/* 스마트 컨트랙트 주소에 담긴 잔액 */}
      <p>
        Contract Balance:{" "}
        {parseFloat(Web3.utils.fromWei(contractBalance.toString(), "ether"))} ETH
      </p>
      {/* 기부하기 - 기부자 */}
      {metamaskAccount !== charityAddress && metamaskAccount !== receiverAddress ? 
      (<DonateForm
        account={account}
        contract={contract}
        setTotalDonations={setTotalDonations}
      />) : null
      
    }
    {/* 인출하기 - 자선단체 */}
    {metamaskAccount === charityAddress ?
    (<WithdrawForm
      account={account}
      contract={contract}
      setWithdrawnAmount={setWithdrawnAmount}
      receiverAddress={receiverAddress}
    />) : null      
    }
    {/* 보상받기 - 기부자 : 기부할 때마다 0.01씩 */}
    {
      metamaskAccount !== charityAddress && metamaskAccount !== receiverAddress ? (
        <div>
         <p>Reward Amount: {parseFloat(Web3.utils.fromWei(rewardAmount.toString(), "ether"))} ETH</p>
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
        null
      )
    }
    {/* 물건 등록하기 - 판매자 */}
    {metamaskAccount === charityAddress ? (
        <ProductForm account={account} contract={contract} setProjectCount={setProjectCount} />
      ) : null
    }
    
    
    </div>
  );
};

export default Donation;