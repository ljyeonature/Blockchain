import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import DonationContract from './contracts/Donation.json';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

function Home() {
  // eslint-disable-next-line
  const [userAccount, setUserAccount] = useState({
    isConncet: '',
    Account: '',
  });
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const navigate = useNavigate();
  const [charityAddress, setCharityAddress] = useState('');
  // eslint-disable-next-line
  const [contract, setContract] = useState(null);
  const [hover, setHover] = useState([false, false, false, false]);
  const styles = {

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
      backgroundColor: 'rgba( 255, 255, 255, 0.7 )',
    },

    contents : {
      display : 'flex',
      width:'100%',
      height:'460px',
    },
    content : {
      flex : '1',
      marginTop:'550px',
      padding:'0 10px',
      borderTop:'3px solid #333333',
    },
    button: {
      width:'13%',
      height:'60px',
      backgroundColor:'#fff',
      color:'#000',
      fontWeight:'bolder',
      padding: '1em 2em',
      // borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '20px',
      marginTop: '1em',
      marginLeft: '1em',
      border:'none',
    },
    donationButton: {
      position:'absolute',
      bottom:'120px',
      left:'180px',
      transition: 'background 0.5s',

    },
    withdrawButton : {
      position:'absolute',
      bottom:'120px',
      left:'660px',
      transition: 'background 0.5s',
    },
    purchaseButton: {
      position:'absolute',
      bottom:'120px',
      right:'510px',
      transition: 'background 0.5s',
    },
    penpalButton: {
      position:'absolute',
      bottom:'120px',
      right:'35px',
      transition: 'background 0.5s',
    },
    h1: {
      margin:'0', 
      paddingTop:'10px', 
      paddingLeft:'10px',
      position:'relative', 
      top:'70px',
    },
    h3: {
      position:'relative', 
      top:'100px',
      paddingBottom:'10px', 
      paddingLeft:'10px',
      borderBottom:'1rem solid rgb(66, 146, 88, 0.9)'
    },
  };
  
  const handleMouseEnter = (index) => {
    setHover((prevHover) => {
      const updatedHover = [...prevHover];
      updatedHover[index] = true;
      return updatedHover;
    });
  };

  const handleMouseLeave = (index) => {
    setHover((prevHover) => {
      const updatedHover = [...prevHover];
      updatedHover[index] = false;
      return updatedHover;
    });
  };

  useEffect(() => {
    const fetchContract = async () => {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await web3.eth.net.getId();
      const networkData = DonationContract.networks[networkId];
      if (networkData) {
        const contractInstance = new web3.eth.Contract(DonationContract.abi, networkData.address);
        setContract(contractInstance);

        try {
          const address = await contractInstance.methods.getCharityAddress().call();
          setCharityAddress(address);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchContract();
  }, []);

  let walletConnect = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    if (accounts.length > 0) {
      localStorage.setItem('isConnected', accounts);
      setUserAccount({ Account: accounts });
      setIsMetamaskConnected(true);
      console.log(localStorage.getItem('isConnected'));
      console.log(charityAddress.toLowerCase());
    }
    if (accounts.length === undefined) {
      localStorage.removeItem('isConnected');
      setUserAccount({ Account: '' });
    }
  };

  const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (addressArray.length > 0) {
          setIsMetamaskConnected(true);
          setUserAccount({ Account: addressArray[0] });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  function logout() {
    localStorage.removeItem('isConnected');
    setUserAccount({ Account: '' });
    setIsMetamaskConnected(false);
  }

  useEffect(() => {
    getCurrentWalletConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToDonationPage = () => {
    if (isMetamaskConnected) {
      navigate('/donation');
    } else {
      window.alert('Please Connect to MetaMask.');
    }
  };

  const goToPurchasePage = () => {
    if (isMetamaskConnected) {
      navigate('/purchase');
    } else {
      window.alert('Please Connect to MetaMask.');
    }
  };

  const goToWithdrawnPage = () => {
    if (isMetamaskConnected) {
      navigate('/withdrawn');
    } else {
      window.alert('Please Connect to MetaMask.');
    }
  };

  const goToPenpalPage = () => {
    if (isMetamaskConnected) {
      navigate('/penpal');
    } else {
      window.alert('Please Connect to MetaMask.');
    }
  };
  const alertMsg = () => {
    return window.alert("Only charities have access.")
  }

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <Nav isMetamaskConnected={isMetamaskConnected} logout={logout} walletConnect={walletConnect} />
      </div>

      <div style={styles.contents}>
        <div style={{...styles.content, borderRight:'3px solid #333333', 
        }}>
            <h1 style={styles.h1}>Donation</h1>
            <h3 style={styles.h3}>BlockChain & Smart Contract Donation</h3>
        </div>
        <div style={{...styles.content, borderRight:'3px solid #333333', 
        }}>
          <h1 style={styles.h1}>Charity</h1>
          <h3 style={styles.h3}>Guarantee of Confidence</h3>


        </div>
        <div style={{...styles.content}}>
          <h1 style={styles.h1}>Purchase</h1>
          <h3 style={styles.h3}>Another Donation Method</h3>
        </div>

        <div style={{...styles.content}}>
          <h1 style={styles.h1}>Penpal</h1>
          <h3 style={styles.h3}>Contacting the beneficiary</h3>
        </div>
      </div>
      <div>
        <button onClick={goToDonationPage} 
               style={{
                 ...styles.button, 
                 ...styles.donationButton,
                 backgroundColor: hover[0] ? 'rgba(0, 0, 0, 0.8)' : '#fff',
                 color: hover[0] ? '#fff' : 'rgba(0, 0, 0, 0.8)',
                 border: hover[0] ? '#fff' : '2px solid rgba(0, 0, 0, 0.8)',
                 }}
                 onMouseEnter={() => handleMouseEnter(0)}
                 onMouseLeave={() => handleMouseLeave(0)}
                 >
                Go to Donation
      </button>
      {localStorage.getItem('isConnected') === charityAddress.toLowerCase() ? (
        <button onClick={goToWithdrawnPage} 
        style={{...styles.button, 
        ...styles.withdrawButton,
        backgroundColor: hover[1] ? 'rgba(0, 0, 0, 0.8)' : '#fff',
        color: hover[1] ? '#fff' : 'rgba(0, 0, 0, 0.8)',
        border: hover[1] ? '#fff' : '2px solid rgba(0, 0, 0, 0.8)',
        }}
        onMouseEnter={() => handleMouseEnter(1)}
        onMouseLeave={() => handleMouseLeave(1)}
        >
      Go to Withdrawn
    </button>

      ) : (
        <button onClick={alertMsg} 
        style={{...styles.button, 
        ...styles.withdrawButton,
        backgroundColor: hover[1] ? 'rgba(0, 0, 0, 0.8)' : '#fff',
        color: hover[1] ? '#fff' : 'rgba(0, 0, 0, 0.8)',
        border: hover[1] ? '#fff' : '2px solid rgba(0, 0, 0, 0.8)',
        }}
        onMouseEnter={() => handleMouseEnter(1)}
        onMouseLeave={() => handleMouseLeave(1)}
        >
      Go to Withdrawn
    </button>
      )}
 <button onClick={goToPurchasePage} 
          style={{
          ...styles.button, 
          ...styles.purchaseButton,
          backgroundColor: hover[2] ? 'rgba(0, 0, 0, 0.8)' : '#fff',
          color: hover[2] ? '#fff' : 'rgba(0, 0, 0, 0.8)',
          border: hover[2] ? '#fff' : '2px solid rgba(0, 0, 0, 0.8)',
        }}
        onMouseEnter={() => handleMouseEnter(2)}
        onMouseLeave={() => handleMouseLeave(2)}
      >
        Go to Purchase
        </button>
        <button onClick={goToPenpalPage} 
          style={{
            ...styles.button, 
            ...styles.penpalButton,
            backgroundColor: hover[3] ? 'rgba(0, 0, 0, 0.8)' : '#fff',
            color: hover[3] ? '#fff' : 'rgba(0, 0, 0, 0.8)',
            border: hover[3] ? '#fff' : '2px solid rgba(0, 0, 0, 0.8)',
            }}
            onMouseEnter={() => handleMouseEnter(3)}
            onMouseLeave={() => handleMouseLeave(3)}
            >
          Go to Penpal
      </button>
      </div>
    </div>
  );
}

export default Home;
