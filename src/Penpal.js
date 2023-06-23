import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Web3 from "web3";
import DonationContract from "./contracts/Donation.json";
import hug from './images/hug.jpg';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, where, orderBy,  addDoc, serverTimestamp, getDocs } from "@firebase/firestore";

const styles = {
  header: {
    height:'40vh',
    paddingBottom:'0',
    position:'absolute',
    top:'200px',
    left:'310px'
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
    // textAlign:'center',
    fontSize:'40px',
    position:'relative',
    top:'75px',
    left:'250px',
    borderBottom:'5px solid rgba(66, 146, 88, 0.9)'
  },
  paragraph: {
    color: 'black',
    marginBottom: '0.5em',
    textAlign:'center',
    fontSize:'22px',
    position:'relative',
    left:'730px',
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
  section: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    position:'absolute',
    top:'320px',
    right:'270px',
    width:'70%',
    height:'500px',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'auto', // 스크롤 추가
    maxHeight: '500px', // 최대 높이 지정
  },
  chatHeader: {
    padding: '16px',
    borderBottom: '1px solid #ddd',
    textAlign: 'center',
  },
  messageContainer: {
    display: 'flex',
    flex: '1',
    overflowY: 'auto',
    padding: '16px',
  },
  sentMessages: {
    flex: '1',
    marginRight: '16px',
  },
  receivedMessages: {
    flex: '1',
    marginLeft: '16px',
  },
  message: {
    marginBottom: '50px',
    padding: '1px',
    borderRadius: '8px',
    backgroundColor: '#eee',
    width:'100%',
    height:'80px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #ddd',
    padding: '16px',
    height:'50px',
  },
  input: {
    flex: '1',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginRight: '8px',
  },
  sendButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: 'black',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDiWVU7ZwJKS0BvOi1v8wEfsauKWSSkcug",
  authDomain: "donationproject-ce9c2.firebaseapp.com",
  projectId: "donationproject-ce9c2",
  storageBucket: "donationproject-ce9c2.appspot.com",
  messagingSenderId: "411721034852",
  appId: "1:411721034852:web:4c6431ef7a4affa7680371",
  measurementId: "G-7LR2TK70CF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesCollection = collection(db, "messages");
// eslint-disable-next-line
const analytics = getAnalytics(app);


const Penpal = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [charityAddress, setCharityAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
   // eslint-disable-next-line
  const [metamaskAccount, setMetamaskAccount] = useState("");
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]); // 보낸 메시지 배열
  const [receivedMessages, setReceivedMessages] = useState([]); // 보낸 메시지 배열


  useEffect(() => {
      loadBlockchainData();
    }, []);

    if(account === receiverAddress) {
        const loadSentMessages = async () => {
            try {
                const q = query(messagesCollection, where("sender", "==", account), orderBy("timestamp"));
                const snapshot = await getDocs(q);
                const sentMessageList = snapshot.docs.map((doc) => doc.data());
                setSentMessages(sentMessageList);
                } catch (error) {
                    console.error("보낸 메시지를 불러오는 중 오류가 발생했습니다:", error);
                }
            };
    
        const loadReceivedMessages = async () => {
            try {
                const q = query(messagesCollection,where("receiver", "==", account), orderBy("timestamp"));
                const snapshot = await getDocs(q);
                const receivedMessageList = snapshot.docs.map((doc) => doc.data());
                 // 자신이 보낸 메시지를 제외하고 받은 메시지만 필터링합니다.
                const filteredReceivedMessages = receivedMessageList.filter((message) => message.sender !== account);

                setReceivedMessages(filteredReceivedMessages);
            } catch (error) {
                console.error("받은 메시지를 불러오는 중 오류가 발생했습니다:", error);
            }
        };
       loadSentMessages(); // 보낸 메시지 로드 함수 호출
       loadReceivedMessages(); // 받은 메시지 로드 함수 호출
    

    } else {
        const loadSentMessages = async () => {
            try {
                const q = query(messagesCollection, where("sender", "==", account), orderBy("timestamp"));
                const snapshot = await getDocs(q);
                const sentMessageList = snapshot.docs.map((doc) => doc.data());
                setSentMessages(sentMessageList);
                } catch (error) {
                    console.error("보낸 메시지를 불러오는 중 오류가 발생했습니다:", error);
                }
            };
    
        const loadReceivedMessages = async () => {
            try {
                const q = query(messagesCollection,where("receiver", "==", receiverAddress), orderBy("timestamp"));
                const snapshot = await getDocs(q);
                const receivedMessageList = snapshot.docs.map((doc) => doc.data());
                const filteredReceivedMessages = receivedMessageList.filter((message) => message.sender !== account);

                setReceivedMessages(filteredReceivedMessages);
            } catch (error) {
                console.error("받은 메시지를 불러오는 중 오류가 발생했습니다:", error);
            }
        };
        
          loadSentMessages(); // 보낸 메시지 로드 함수 호출
          loadReceivedMessages(); // 받은 메시지 로드 함수 호출
       
    }



    const sendMessage = async () => {
        try {
            const timestamp = serverTimestamp();
            const sender = account; // 현재 메타마스크에 연결된 주소
            const receiver = receiverAddress; // 받는 사람 주소
            
            
            const newMessageData = {
                message: newMessage,
                timestamp,
                sender,
                receiver,
            };
            
            await addDoc(messagesCollection, newMessageData);
            setNewMessage('');
            // window.location.reload();
        } catch (error) {
            console.error('메시지를 전송하는 중 오류가 발생했습니다:', error);
        }
    };
    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.toDate) { // 유효성 검사 추가
          const date = timestamp.toDate();
          const formattedTime = date.toLocaleString();
          return formattedTime;
        }
        return ""; // 유효하지 않은 경우 빈 문자열 반환 또는 다른 예외 처리 방법 사용
      };
    
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
  
  return (
    <div>
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
              <button onClick={handlePurchase} style={styles.navButton}>Market</button>
            </li>
          </ul>
        </nav>
      </div>
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
        <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>
            <h2>채팅 메시지</h2>
            </div>
            <div style={styles.messageContainer}>
            <div style={styles.sentMessages}>
            <h3>나</h3>
                <ul>
                {sentMessages.map((message, index) => (
                    <div key={index} style={styles.message}>
                    <p>{formatTimestamp(message.timestamp)}</p>
                    <p>{message.message}</p>
                    </div>
                ))}
                </ul>
            </div>
            <div style={styles.receivedMessages}>
                <ul>
                {account === receiverAddress ? (<h3>기부자</h3>) : (<h3>수혜자</h3>)}
                {receivedMessages.map((message, index) => (
                    <div key={index} style={styles.message}>
                    <p>{formatTimestamp(message.timestamp)}</p>
                    <p>{message.message}</p>
                    </div>
                ))}
                </ul>
            </div>
            </div>
            <div style={styles.inputContainer}>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendButton}>
                전송
            </button>
            </div>
        </div>
        </section>
      </div>
    </div>

  );
};

export default Penpal;