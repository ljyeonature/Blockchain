import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';


function Home() {
  const [userAccount, setUserAccount] = useState({
    isConncet: "",
    Account: ""
  });
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

  let walletConnect = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length > 0) {
      localStorage.setItem("isConnected", accounts);
      setUserAccount({ Account: accounts[0] });
      setIsMetamaskConnected(true);
      console.log(accounts);
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
    if (userAccount.Account !== null) {
      getCurrentWalletConnected();
    }
    // eslint-disable-next-line
  }, []);


  return (
    <div>
        <h1>메타마스크 기부 애플리케이션</h1>
        <nav>
          <ul>
            <li>
              <Link to={'/'}>홈</Link>
            </li>
            <li>
              <Link to={'/donation'}>기부</Link>
            </li>
          </ul>
        </nav>
        <hr />
        <div>
        {isMetamaskConnected ? (
          <div>
          <p>Metamask is connected.</p>
          <p>1. Please disconnect <strong>manually</strong> from MetaMask.</p>
          <p>2. Please push Button Logout to return Connect MetaMask.</p>
          <button onClick={logout}>Logout</button>
        </div>
        ) : (
          <button onClick={walletConnect}>Connect Metamask</button>
         
        )}
      </div>

     </div>
  );
}

export default Home;

