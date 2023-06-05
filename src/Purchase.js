import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import DonationContract from './contracts/Donation.json';

const Purchase = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rewardAmount, setRewardAmount] = useState(() => {
    const savedRewardAmount = localStorage.getItem('rewardAmount');
    return savedRewardAmount ? parseFloat(savedRewardAmount) : 0;
  })
  
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
  useEffect(() => {

    getProducts();
  }, [contract]);

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handlePurchase = async () => {
    if (contract && selectedProduct) {
      try {
        await contract.methods.purchaseProduct(selectedProduct).send({
          from: accounts[0],
        });
        // 물건 구매 후에는 물건 목록을 업데이트
        getProducts();
        // Reward Amount 업데이트
        const updatedRewardAmount = await contract.methods.getRewardAmount().call();
        setRewardAmount(parseFloat(Web3.utils.fromWei(updatedRewardAmount.toString(), "ether")));
        // LocalStorage 업데이트
        window.localStorage.setItem('rewardAmount', parseFloat(Web3.utils.fromWei(updatedRewardAmount.toString(), "ether")).toString());
        // window.location.reload();
      } catch (error) {
        console.error('Error purchasing product:', error);
      }
    }
  };
  useEffect(() => {
    const savedRewardAmount = localStorage.getItem('rewardAmount');
    if (savedRewardAmount) {
      setRewardAmount(parseFloat(savedRewardAmount));
    }
  }, [localStorage.getItem('rewardAmount')]);

  useEffect(() => {
    localStorage.removeItem('rewardAmount', rewardAmount.toString());
    localStorage.setItem('rewardAmount', rewardAmount.toString());
  }, [rewardAmount]);


  return (
    <div>
        <button><Link to={'/donation'}>Donation</Link></button>
        <p>Reward Amount: {parseFloat(Web3.utils.fromWei(rewardAmount.toString(), "ether"))} ETH</p>
        <h2>Products</h2>
        <select onChange={handleProductChange}>
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.name} - {product.price} ETH
            </option>
          ))}
        </select>
        <button onClick={handlePurchase}>Purchase</button>

        <h1>Purchase History</h1>
        <table>
            <thead>
            <tr>
                <th>Buyer</th>
                <th>Product ID</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {purchases.map((purchase, index) => (
                <tr key={index}>
                <td>{purchase.buyer}</td>
                <td>{purchase.productId}</td>
                <td>{purchase.purchaseAmount}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  );
};

export default Purchase;