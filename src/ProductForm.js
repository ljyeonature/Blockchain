import React, { useState } from "react";
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
      <h3>Register a Product</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          <label>Product Price:</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default ProductForm;
