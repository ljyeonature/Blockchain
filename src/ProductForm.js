import React, { useState } from "react";

const styles = {

  form : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position:'relative',
    bottom:'25px',
    left:'25px',
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
    fontSize:'15px',
    position:'absolute',
    left:'490px',
    top:'12px',
    width:'270px',
  },
  input: {
    width:'210px',
    height: '30px',
    marginLeft: '10px',
    borderRadius:'1em',
    textAlign : 'center',
    marginTop:'10px',
    fontSize:'18px',
  }, 
  heading: {
    color: 'black',
    // textAlign:'center',
    fontSize:'40px',
    position:'relative',
    top:'75px',
    right:'430px',
    borderBottom:'5px solid rgba(66, 146, 88, 0.9)'
  },
  label : {
    fontSize:'20px',
  },
};



// 판매자(charity)가 물건 등록 폼
const ProductForm = ({ account, contract, setProjectCount }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      await contract.methods.addProduct(productName, productPrice, account).send({ from: account });
      setProductName("");
      setProductPrice(0);
      // Refresh the project count to reflect the new product
      const count = await contract.methods.projectCount().call();
      setProjectCount(count);
      alert("Product registered successfully.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to register the product.");
    }
  };

  return (
    <div>
      <h1 style={styles.heading}>Register a Product</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Product Price</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            style={{...styles.input, position:'relative', left:'5px'}}
          />
        </div>
        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
};

export default ProductForm;
