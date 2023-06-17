import React from "react";

const styles = {

  button: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '1em 2em',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1em',
    textDecoration: 'none',
    fontSize:'15px',
    position:'absolute',
    left:'525px',
    bottom:'385px',
    width:'270px',
  },

};

const WithdrawForm = ({ account, contract, setWithdrawnAmount, receiverAddress }) => {
  
    const withdrawDonations = async () => {
      if (contract) {
        try {
            await contract.methods.withdrawDonations(receiverAddress).send({ from: account });
            const withdrawn = await contract.methods.withdrawnAmount().call();
            setWithdrawnAmount(withdrawn);
            window.location.reload();
          
        } catch (error) {
          console.error(error);
        }
      }
    };
    return (
      <div>
        <button onClick={withdrawDonations} style={styles.button}>Withdraw Donations</button>
      </div>
    );
  };

  export default WithdrawForm;