import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import DonationContract from './contracts/Donation.json';
import hug from './images/hug.jpg';


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2em',
    background: 'white', 
    overflow:'hidden',
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
  button: {
    backgroundColor: '#4BA664',
    color: '#fff',
    padding: '1em 2em',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1em',
    textDecoration: 'none',
    margin:'10px 10px',
    fontSize:'18px',
  },
  purchasebutton: {
    backgroundColor: '#4BA664',
    color: '#fff',
    padding: '1em 2em',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1em',
    textDecoration: 'none',
    margin:'10px 10px',
    fontSize:'15px',
    position:'absolute',
    top:'287px',
    right:'720px',

  },
  buttonContainer: {
    position:'absolute',
    bottom:'130px',
  },
  rewardAmount: {
    color: '#34495e',
    marginBottom: '0.5em',
  },
  heading: {
    color: '#2c3e50',
    marginBottom: '1em',
    fontSize:'40px',
    position:'absolute',
    top:'200px'
  },
  headingHistory: {
    color: 'black',
    // textAlign:'center',
    fontSize:'40px',
    position:'relative',
    top:'40px',
    borderBottom:'5px solid rgba(66, 146, 88, 0.9)'
  },
  
  select: {
    width:'250px',
    height:'40px',
    marginBottom: '1em',
    borderRadius:'10px',
    textAlign:'center',
    fontSize:'15px',
    position:'absolute',
    top:'300px',
    left:'780px',
  },
  table: {
    textAlign:'center',
    fontSize:'18px',
    width: '80%',
    borderCollapse: 'collapse',
    position:'absolute',
    top:'380px',
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

const PurchaseList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  // eslint-disable-next-line
  const [accounts, setAccounts] = useState([]);
  // eslint-disable-next-line
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // eslint-disable-next-line
  const [charityAddress, setCharityAddress] = useState('');


  useEffect(() => {
    // 웹3 인스턴스 생성
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' }); // 계정 권한 요청
          setWeb3(web3);
        } catch (error) {
          console.error('Error initializing web3:', error);
        }
      }
    };
    initWeb3();
  }, []);

  useEffect(() => {
    // 스마트 컨트랙트 인스턴스 생성
    const initContract = async () => {
      if (web3) {
        try {
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = DonationContract.networks[networkId];
          const contract = new web3.eth.Contract(
            DonationContract.abi,
            deployedNetwork.address
          );
          setContract(contract);
          const address = await contract.methods.getCharityAddress().call();
          setCharityAddress(address);

        // 구매 내역 가져오기
        const purchaseCount = await contract.methods.purchaseCount().call();
        const purchases = [];
        for (let i = 0; i < purchaseCount; i++) {
        const purchase = await contract.methods.purchases(i).call();
        purchases.push(purchase);
        }
        setPurchases(purchases);

        } catch (error) {
          console.error('Error initializing contract:', error);
        }
      }
    };
    initContract();
  }, [web3]);

  useEffect(() => {
    // 사용 가능한 계정 가져오기
    const getAccounts = async () => {
      if (web3) {
        try {
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      }
    };

    getAccounts();
  }, [web3]);

  useEffect(() => {
    // 물건 목록 가져오기
  const getProducts = async () => {
    if (contract) {
      try {
        const productCount = await contract.methods.projectCount().call();
        const products = [];

        for (let i = 0; i < productCount; i++) {
          const product = await contract.methods.products(i).call();
          products.push(product);
        }

        setProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };
    getProducts();
  }, [contract]);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // 구매목록 페이지 기능
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = purchases.slice(indexOfFirstItem, indexOfLastItem);

  const Pagination = () => {
    const pageNumbers = Math.ceil(purchases.length / itemsPerPage);

    return (
      <div style={{position:'absolute', bottom:'50px'}}>
        {Array.from({ length: pageNumbers }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              style={
                pageNumber === currentPage
                  ? { backgroundColor: 'black', margin: '0.5em', color:'white', fontSize:'15px' }
                  : { backgroundColor: 'white', margin: '0.5em', color:'black', fontSize:'15px' }
              }
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <div>
      <nav>
          <ul style={styles.navList}>
            <li style={styles.navListItem}>
              <h1 style={styles.title}><img src={hug} alt='error' style={{width:'50px', height:'50px', position:'relative', top:'5px'}}/>GivingHub</h1>
            </li>
            <li style={styles.navListItem}>
              <Link to={'/'} style={{ textDecoration: "none", position:'absolute', top:'0px', right:'125px'}}><button style={{...styles.navButton}}>Home</button></Link>
            </li>
            <li style={styles.navListItem}>
              <Link to={'/withdrawn'} style={styles.navButton}>Back</Link>
            </li>
          </ul>
        </nav>
        <div style={styles.container}>
          <h1 style={styles.headingHistory}>Purchase History</h1>
          <table style={styles.table}>
              <thead>
              <tr>
                  <th style={styles.tableHeader}>Buyer</th>
                  <th style={styles.tableHeader}>Product Name</th>
                  <th style={styles.tableHeader}>Product ID</th>
                  <th style={styles.tableHeader}>Price</th>
              </tr>
              </thead>
              <tbody>
              {currentItems.map((purchase, index) => (
                <tr key={index}>
                  <td style={styles.tableCell}>{purchase.buyer}</td>
                  <td style={styles.tableCell}>{purchase.productName}</td>
                  <td style={styles.tableCell}>{purchase.productId}</td>
                  <td style={styles.tableCell}>{purchase.purchaseAmount}</td>
                  </tr>
              ))}
              </tbody>
          </table>
          <Pagination />

        </div>
      

    </div>
  );
};

export default PurchaseList;
