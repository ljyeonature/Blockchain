import { Link, useNavigate  } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Web3 from "web3";
import DonationContract from "./contracts/Donation.json";

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  title: {
    color: '#000',
    textShadow: '2px 2px 4px rgba(255,255,255,0.7)',
    fontSize: '50px',
  },
  link: {
    textDecoration: 'none',
    color: '#000',
    backgroundColor: '#fff',
    border: '2px solid #000',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '1.2em',
    transition: '0.3s',
    ':hover': {
      backgroundColor: '#000',
      color: '#fff'
    },
  },
  connectButton: {
    padding: '15px 30px',
    fontSize: '1.2em',
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.3s',
    ':hover': {
      backgroundColor: '#fff',
      color: '#000',
      border: '2px solid #000',
    },
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  navListItem: {
    border: '2px solid #000',
    borderRadius: '10px',
    padding: '10px 20px',
    margin: '0 5px',
    fontSize: '1.2em', 
    fontWeight: 'bold', 
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },

  button: {
    backgroundColor: 'black',
    color: '#fff',
    padding: '1em 2em',
    fontSize: '1.2em',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'color 0.3s ease, background-color 0.3s ease',
    marginTop: '1em',
    marginLeft: '1em',
  },

};



function Home() {
  const [userAccount, setUserAccount] = useState({
    isConncet: "",
    Account: ""
  });
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const navigate = useNavigate();
  const [charityAddress, setCharityAddress] = useState("");
   // eslint-disable-next-line
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await web3.eth.net.getId();
      const networkData = DonationContract.networks[networkId];
      if (networkData) {
        const contractInstance = new web3.eth.Contract(
          DonationContract.abi,
          networkData.address
        );
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
      method: "eth_requestAccounts",
    });
    if (accounts.length > 0) {
      localStorage.setItem("isConnected", accounts);
      setUserAccount({ Account: accounts });
      setIsMetamaskConnected(true);
      console.log(localStorage.getItem("isConnected"));
      console.log(charityAddress.toLowerCase());
    }
    if (accounts.length === undefined) {
      localStorage.removeItem("isConnected");
      setUserAccount({ Account: "" });
    }
  };

  const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
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
    localStorage.removeItem("isConnected");
    setUserAccount({ Account: "" });
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
      window.alert("Please Connect to MetaMask.");
    }
  };
  const goToPurchasePage = () => {
    if(isMetamaskConnected) {
      navigate('/purchase');
    } else {
      window.alert("Please Connect to MetaMask.")
    }
  };
  const goToWithdrawnPage = () => {
    if (isMetamaskConnected) {
        navigate('/withdrawn');
    } else {
      window.alert('Please Connect to MetaMask.');
    }
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Donation</h1>
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navListItem}>
            <Link to={'/'} style={{ textDecoration: "none", color: "#000", fontSize:"20px" }}>Home</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <div>
        {isMetamaskConnected ? 
          (<div style={styles.buttonContainer}>
            <p style={{fontSize:"22px"}}>Metamask is connected.</p>
            <p style={{fontSize:"22px"}}>Connected Account: {userAccount.Account}</p>
            <p style={{fontSize:"22px"}}>1. Please disconnect <strong>manually</strong> from MetaMask.</p>
            <p style={{fontSize:"22px"}}>2. Please push the Logout button to return to Connect MetaMask.</p>
            <button onClick={logout} style={styles.button}>Logout</button>
            <div style={{ marginLeft: '1em', display: 'inline' }}>
              {localStorage.getItem("isConnected") === charityAddress.toLowerCase() ? 
              (<button onClick={goToWithdrawnPage} style={styles.button}>Go to Withdrawn Page</button>)
              :
              (<button onClick={goToDonationPage} style={styles.button}>Go to Donation Page</button>
            )}
              <button onClick={goToPurchasePage} style={styles.button}>Go to Purchase Page</button>
            </div>
          </div>) 
          : 
          (<button onClick={walletConnect} style={styles.connectButton}>Connect Metamask</button>) 
          }
        
        
      </div>
    </div>
  );
  
}


export default Home;

