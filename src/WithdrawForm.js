import React, {useState} from "react";

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
    position:'relative',
    left:'95px',
    top:'10px',
    fontSize:'18px',
  },


};

const WithdrawForm = ({ account, contract, setWithdrawnAmount, receiverAddress }) => {
    const [loading, setLoading] = useState(false);
  
    const withdrawDonations = async () => {
      setLoading(true);
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
      setLoading(false);
    };
    if (loading) {
        return <div>Loading...</div>;
      }
  
    return (
      <div>
        <button onClick={withdrawDonations} style={styles.button}>Withdraw Donations</button>
      </div>
    );
  };

  export default WithdrawForm;