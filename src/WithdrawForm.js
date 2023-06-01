import React, {useState} from "react";

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
        <button onClick={withdrawDonations}>Withdraw Donations</button>
      </div>
    );
  };

  export default WithdrawForm;