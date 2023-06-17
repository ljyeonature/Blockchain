import React from 'react';
import { Link } from 'react-router-dom';
import hug from './images/hug.jpg';
const styles = {
    title: {
      color: 'black',
      textShadow: '2px 2px 4px rgba(255,255,255,0.7)',
      fontSize: '100px',
      position: 'relative',
      right: '530px',
      top:'150px',
    },
    nav : {
      // height:'500px',
    },
    navButton: {
      backgroundColor: 'rgb(66, 146, 88)',
      padding: '10px 15px',
      color: '#fff',
      border: '3px solid #429258',
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

const Nav = ({ isMetamaskConnected, logout, walletConnect }) => {
  const handleLogout = () => {
    logout();
  };

  const handleWalletConnect = () => {
    walletConnect();
  };

  return (
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navListItem}>
            <h1 
            style={styles.title}><img src={hug} alt='error' style={{width:'100px', height:'100px', position:'relative', top:'5px'}}/> 
            GivingHub
            </h1>
          </li>
          <li style={styles.navListItem}>
            <Link to={'/'} style={{ textDecoration: "none", position:'absolute', top:'0px', right:'140px'}}><button style={{...styles.navButton}}>Home</button></Link>
          </li>
          <li style={styles.navListItem}>
            {isMetamaskConnected ?
              (
                <div>
                  <p style={{display:'inline', position:'absolute', top:'15px', right:'58px'}}>welcome</p>
                  <button onClick={handleLogout} style={styles.navButton}>Logout</button>
                </div>
              ) :
              (
                <button onClick={handleWalletConnect} style={styles.navButton}>Connect</button>
              )
            }
          </li>
        </ul>
      </nav>

  );
};

export default Nav;
