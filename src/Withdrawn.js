import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Web3 from "web3";
import DonationContract from "./contracts/Donation.json";
import WithdrawForm from "./WithdrawForm";
import ProductForm from "./ProductForm";

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100vh',
    background: 'white',
  },
  header: {
    height:'40vh',
    paddingTop:'80px',
    paddingBottom:'0',
  },
  section: {
    margin: '20px 0',
    height:'60vh',
    width:'412px',
    marginBottom:'30px',

  },
  footer: {
    height:'20vh',
    position:'relative',
  },
  rowdiv: {
    alignItems:'center',
    justifyContent:'center',
  },
  heading: {
    color: '#2c3e50',
    textAlign:'center',
    fontSize:'30px',
  },
  paragraph: {
    color: '#34495e',
    marginBottom: '0.5em',
    textAlign:'center',
  },
  button: {
    backgroundColor: 'black',
    color: 'white',
    padding: '1em 3.5em',
    border: '1px solid black',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1em',
    textDecoration: 'none',
    margin:'10px',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: 'black',
    color: '#fff',
    padding: '0.5em 1em',
    border: '1px solid #000',
  },
  tableCell: {
    padding: '0.5em 1em',
    border: '1px solid #000',
  },
};

const Withdrawn = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [charityAddress, setCharityAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  
  const [metamaskAccount, setMetamaskAccount] = useState("");
  // eslint-disable-next-line
  const [projectCount, setProjectCount] = useState(0);
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [rewardAmount, setRewardAmount] = useState(0);
  
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
    <div style={styles.container}>
      <header style={styles.header}>
          <h1 style={styles.heading}>Address</h1>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Connected Account</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableCell}>{account}</td>
              </tr>
            </tbody>
          </table>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Charity Account</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableCell}>{charityAddress}</td>
              </tr>
            </tbody>
          </table>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Receiver Account</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableCell}>{receiverAddress}</td>
              </tr>
            </tbody>
          </table>
      </header>

      <section style={styles.section}> 
     
          <div style={styles.rowdiv}>
            <h1 style={styles.heading}>Widrawn Donations</h1>
            <p style={styles.paragraph}>
              Total Donations:{" "}
              {parseFloat(Web3.utils.fromWei(totalDonations.toString(), "ether"))} ETH
            </p>
            <p style={styles.paragraph}>
              Withdrawn Amount:{" "}
              {parseFloat(Web3.utils.fromWei(withdrawnAmount.toString(), "ether"))} ETH
              </p>
            {/* 인출하기 - 자선단체 */}
            {metamaskAccount === charityAddress ?
            (<WithdrawForm
              account={account}
              contract={contract}
              setWithdrawnAmount={setWithdrawnAmount}
              receiverAddress={receiverAddress}
            />) : null      
            }
          </div>
        <div>
          {/* 물건 등록하기 - 판매자 */}
          {metamaskAccount === charityAddress ? (
              <ProductForm account={account} contract={contract} setProjectCount={setProjectCount} />
            ) : null
          }
        </div>
      </section>
      <footer style={styles.footer}>
        <div style={styles.buttonContainer}>
          <Link to={'/'} style={{ textDecoration : "none", color:'#000' }}><button style={styles.button}>Home</button></Link>
          <button onClick={handlePurchase} style={styles.button}>Market</button>
        </div>
      </footer>
    </div>
  );
};

export default Withdrawn;