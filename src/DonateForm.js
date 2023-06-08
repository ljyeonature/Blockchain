import React, { useState } from "react";
import Web3 from "web3";

const styles = {
  donateform : {
    position:'relative',
    left:'70px',
  },
  button: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '1em 2em',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1em',
    textDecoration: 'none',
  },
  input: {
    height: '30px',
    marginRight: '10px',
    borderRadius:'1em',
    textAlign : 'center',
    marginTop:'10px',
  },  
};


const DonateForm = ({ account, contract, setTotalDonations  }) => {
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
    <div style={styles.donateform}>
      <input
        type="number"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        style={styles.input}
      />
      <button onClick={donate} style={styles.button}>Donate</button>
    </div>
  );
};

export default DonateForm;
