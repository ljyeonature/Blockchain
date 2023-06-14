import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import DonationContract from './contracts/Donation.json';

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', 
    padding: '2em',
    background: 'white', 
    position:'relative',
    bottom:'50px',
  },
  button: {
    backgroundColor: '#000',
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
    position:'relative',
    bottom:'70px',
    left:'200px',
    fontSize:'15px',

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
  },
  select: {
    width:'250px',
    height:'40px',
    marginBottom: '1em',
    borderRadius:'10px',
    textAlign:'center',
    fontSize:'15px',
  },
  table: {
    textAlign:'center',
    fontSize:'18px',
    width: '80%',
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
      <div>
        {Array.from({ length: pageNumbers }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              style={
                pageNumber === currentPage
                  ? { backgroundColor: 'black', margin: '0.5em', color:'white' }
                  : { backgroundColor: 'white', margin: '0.5em' }
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

        <h1 style={styles.heading}>Purchase History</h1>
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
        <Pagination/>
        <div style={styles.buttonContainer}>
          <Link to={'/'} style={{textDecoration : "none"}}><button style={styles.button}>Home</button></Link>
        </div>
    </div>
  );
};

export default Purchase;
