import React, {useState} from "react";


const RewardClaim = ({ account, contract, setRewardAmount }) => {
    const [loading, setLoading] = useState(false);
  
    const claimReward = async () => {
      setLoading(true);
      if (contract) {
        try {
          await contract.methods.claimReward().send({ from: account });
          const reward = await contract.methods.rewardAmount().call();
          setRewardAmount(reward);
          window.location.reload();
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
        <button onClick={claimReward}>Claim Reward</button>
      </div>
    );
  };




export default RewardClaim;