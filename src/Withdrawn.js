import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Web3 from "web3";
import DonationContract from "./contracts/Donation.json";
import WithdrawForm from "./WithdrawForm";
import ProductForm from "./ProductForm";
import hug from './images/hug.jpg';


const styles = {
  header: {
    height:'40vh',
    paddingBottom:'0',
    position:'absolute',
    top:'200px',
    left:'310px'
  },
  section: {
    margin: '20px 0',
    height:'60vh',
    width:'412px',
    position:'absolute',
    top:"280px",
    left:"750px"
  },
  footer: {
    height:'20vh',
    position:'relative',
    bottom:"50px",
    left:'15px',
  },
  rowdiv: {
   width:'100%',
   height:'30vh',
   display:'inline',
  },
  rewarddiv: {
    position:'relative',
    top:'20px',
  },
  heading: {
    color: 'black',
    fontSize:'40px',
    position:'relative',
    top:'75px',
    right:'430px',
    borderBottom:'5px solid rgba(66, 146, 88, 0.9)'
  },
  paragraph: {
    color: 'black',
    marginBottom: '0.5em',
    textAlign:'center',
    fontSize:'22px',
    position:'relative',
    left:'10px',
    bottom:'50px',
  },
  button: {
    backgroundColor: '#000',
    color: 'white',
    padding: '1em 3.5em',
    border:'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1em',
    textDecoration: 'none',
    margin:'10px',
    fontSize:'18px',
  },

  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing:'5px 0'
  },
  tableHeader: {
    backgroundColor: 'black',
    color: '#fff',
    padding: '0.5em 1em',
    border: '1px solid #000',
    fontSize:'15px',

  },
  tableCell: {
    padding: '0.5em 1em',
    border: '1px solid #000',
    fontSize:'15px',
  },
  container: {
    color: 'black',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    justifyContent: 'flex-end',
  },
  title: {
    color: 'black',
    textShadow: '2px 2px 4px rgba(255,255,255,0.7)',
    fontSize: '50px',
    position: 'relative',
    right: '700px',
  },
  link: {
    textDecoration: 'none',
    color: '#000',
    backgroundColor: '#fff',
    border: '2px solid #000',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '20px',
    transition: '0.3s',
    ':hover': {
      backgroundColor: '#000',
      color: '#fff',
    },
  },
  navButton: {
    backgroundColor: '#429258',
    padding: '10px 15px',
    color: '#fff',
    border: '5px solid #429258',
    borderRadius: '5px',
    fontSize: '20px',
    fontWeight: 'bolder',
    cursor: 'pointer',
    textDecoration: 'none',
    position: 'absolute',
    right: '50px',
    top: '68px',
    transition: '0.3s',
    ':hover': {
      border: 'none',
    },
  },

  navList: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  navListItem: {
    padding: '10px 20px',
    margin: '0 5px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },


};

const Withdrawn = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [charityAddress, setCharityAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  
  const [metamaskAccount, setMetamaskAccount] = useState("");
  // eslint-disable-next-line
  const [projectCount, setProjectCount] = useState(0);
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
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div style={styles.container}>
      <nav>
          <ul style={styles.navList}>
            <li style={styles.navListItem}>
              <h1 style={styles.title}><img src={hug} alt='error' style={{width:'50px', height:'50px', position:'relative', top:'5px'}}/>GivingHub</h1>
            </li>
            <li style={styles.navListItem}>
              <Link to={'/'} style={{ textDecoration: "none", position:'absolute', top:'0px', right:'140px'}}><button style={{...styles.navButton}}>Home</button></Link>
            </li>
            <li style={styles.navListItem}>
            <Link to={'/purchaseList'}><button style={styles.navButton}>SellLIst</button></Link>
            </li>
          </ul>
        </nav>
    <div style={styles.container}>
      <header style={styles.header}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Connected Account</th>
                <th style={styles.tableHeader}>Charity Account</th>
                <th style={styles.tableHeader}>Receiver Account</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableCell}>{account}</td>
                <td style={styles.tableCell}>{charityAddress}</td>
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
    </div>
    </div>

  );
};

export default Withdrawn;