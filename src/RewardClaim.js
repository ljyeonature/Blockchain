import React from "react";

const styles = {
  container: {
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
    position:'absolute',
    top: '70px',
    left:'1190px',
    fontSize:'15px',
    width:'430px',
  },
};


const RewardClaim = ({ account, contract, setRewardAmount, setRewarded }) => {
    const claimReward = async () => {
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
    };
    return (
      <div>
        <button onClick={claimReward} style={styles.button}>Reward</button>
      </div>
    );
  };




export default RewardClaim;