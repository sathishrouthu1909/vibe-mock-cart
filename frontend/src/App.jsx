import CheckoutModal from "./CheckoutModal";
import React, { useEffect, useState } from "react";
import "./style.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState("");



  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
    loadCart();
  }, []);

  const loadCart = () => {
    fetch("http://localhost:4000/api/cart")
      .then((r) => r.json())
      .then((d) => {
        setCart(d.cart);
        setTotal(d.total);
      });
  };

  const addToCart = (id) => {
    fetch("http://localhost:4000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, qty: 1 }),
    }).then(() => loadCart());
  };

  const removeFromCart = (id) => {
    fetch(`http://localhost:4000/api/cart/${id}`, { method: "DELETE" }).then(() =>
      loadCart()
    );
  };
  const updateQty = (id, change) => {
  fetch("http://localhost:4000/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: id, qty: change }),
  })
    .then(loadCart)
    .catch((err) => setError("Failed to update quantity: " + err.message));
};

 
  return (
    <div className="container">
      <h1>🛍️ Vibe Commerce</h1>

      <h2>Products</h2>
      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <img
            src={p.image}
            alt={p.name}
            onError={(e) => {
            e.currentTarget.src = `https://dummyimage.com/600x400/1e293b/e2e8f0&text=${encodeURIComponent(p.name)}`;
            }}
            />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items added yet.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((c) => (
              <tr key={c.productId}>
                <td>{c.name}</td>
                <td>
                  <button onClick={() => updateQty(c.productId, -1)}>-</button>
                  <span style={{ margin: "0 8px" }}>{c.qty}</span>
                  <button onClick={() => updateQty(c.productId, 1)}>+</button>
                </td>

                <td>₹{(c.price * c.qty).toFixed(2)}</td>
                <td>
                  <button className="remove" onClick={() => removeFromCart(c.productId)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="total">
  <strong>Total: ₹{total.toFixed(2)}</strong>

  {total > 0 && (
    <button className="checkout" onClick={() => setShowCheckout(true)}>
      Checkout
    </button>
  )}

  {showCheckout && (
    <CheckoutModal
      onClose={() => setShowCheckout(false)}
      cart={cart}
      onSuccess={() => loadCart()}
    />
  )}
</div>

    </div>
  );
}

export default App;
