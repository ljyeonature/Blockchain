import React, { useState } from "react";
import Web3 from "web3";

const DonateForm = ({ account, contract,rewardCounts, setTotalDonations, setRewardCounts, saveRewardCountsToLocalStorage }) => {
  const [donationAmount, setDonationAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const donate = async () => {
    setLoading(true);
    if (contract) {
      try {
        const donationWei = Web3.utils.toWei(donationAmount.toString(), "ether");
        await contract.methods.donate(account).send({
          from: account,
          value: donationWei,
        });
        const updatedDonations = await contract.methods.totalDonations().call();
        setTotalDonations(updatedDonations);
        setDonationAmount(0);
        setRewardCounts((prevCounts) => {
          const updatedCounts = { ...prevCounts };
          updatedCounts[account] = (updatedCounts[account] || 0) + 1;
          return updatedCounts;
        });
        saveRewardCountsToLocalStorage(rewardCounts);
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <input
        type="number"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
      />
      <button onClick={donate}>Donate</button>
    </div>
  );
};

export default DonateForm;
