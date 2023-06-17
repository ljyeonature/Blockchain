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
    backgroundColor: '#000',
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
    right:'480px',

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
    color: 'black',
    // textAlign:'center',
    fontSize:'40px',
    position:'relative',
    right:'660px',
    top:'35px',
    borderBottom:'5px solid rgba(66, 146, 88, 0.9)',
  },
  headingHistory: {
    color: 'black',
    // textAlign:'center',
    fontSize:'40px',
    position:'relative',
    right:'587px',
    top:'30px',
    borderBottom:'5px solid rgba(66, 146, 88, 0.9)',
  },
 
  select: {
    width:'500px',
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
    top:'550px',
  },
  tableHeader: {
    backgroundColor: '#333333',
    color: '#fff',
    padding: '0.5em 1em',
    border: '1px solid #000',
    
  },
  tableCell: {
    padding: '0.5em 1em',
    border: '1px solid #000',
  },
};

const Purchase = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [itemsPerPage, setItemsPerPage] = useState(5);
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
  

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };
  
  const handlePurchase = async () => {
      if (contract && selectedProduct) {
        try {
            const product = await contract.methods.products(selectedProduct).call();
            const productPrice = product.price;
            const priceInWei = Web3.utils.toWei(productPrice.toString(), "ether");
      
            // 물건 구매 함수 호출
            await contract.methods.purchaseProduct(selectedProduct).send({
              from: accounts[0],
              value: priceInWei,
            });
      
        window.location.reload();
      } catch (error) {
        console.error('Error purchasing product:', error);
      }
    }
  };
   // 현재 계정의 구매 내역 필터링
   const filteredPurchases = purchases.filter(
    (purchase) => purchase.buyer === accounts[0]
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // 구매목록 페이지 기능
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem);

  const Pagination = () => {
    // const pageNumbers = Math.ceil(purchases.length / itemsPerPage);

    return (
      <div style={{position:'absolute', bottom:'100px'}}>
        {Array.from({ length: Math.ceil(filteredPurchases.length / itemsPerPage) }, (_, index) => index + 1).map(
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
            {localStorage.getItem('isConnected') === charityAddress.toLowerCase() ?
            (
              <div>
              <li style={styles.navListItem}>
                <Link to={'/withdrawn'}><button onClick={handlePurchase} style={styles.navButton}>Back</button></Link>
              </li>
            </div>
            ) : (
              <div>
              <li style={styles.navListItem}>
                <Link to={'/donation'}><button onClick={handlePurchase} style={styles.navButton}>Back</button></Link>
              </li>
            </div>
            ) }
          </ul>
        </nav>
        
          <div style={styles.container}>
            <h1 style={styles.heading}>Products</h1>
            <select onChange={handleProductChange} style={styles.select}>
              <option value="" style={styles.option}>Select a product</option>
              {products.map((product) => (
                <option key={product.productId} value={product.productId}>
                  {product.name} - {product.price} ETH
                </option>
              ))}
            </select>
            <button onClick={handlePurchase} style={styles.purchasebutton}>Purchase</button>
          </div>
        
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

export default Purchase;
