import React, {useState} from "react";

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '2em',
    background: '#f5f5f5',
  },
  button: {
    display:'inline',
    backgroundColor: '#000',
    color: '#fff',
    padding: '1em 2em',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1em',
    textDecoration: 'none',
    position:'relative',
    left:'150px',
    top:'10px',
    fontSize:'18px',
  },
};


const RewardClaim = ({ account, contract, setRewardAmount, setRewarded }) => {
    const [loading, setLoading] = useState(false);
  
    const claimReward = async () => {
      setLoading(true);
      if (contract) {
        try {
          await contract.methods.claimReward().send({ from: account });
          const reward = await contract.methods.rewardAmount().call();
          setRewardAmount(reward);
          setRewarded(true);
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
        <button onClick={claimReward} style={styles.button}>Reward</button>
      </div>
    );
  };




export default RewardClaim;