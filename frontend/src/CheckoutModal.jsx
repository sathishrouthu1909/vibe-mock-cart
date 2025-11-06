import React, { useState } from "react";

export default function CheckoutModal({ onClose, cart, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch("http://localhost:4000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, cartItems: cart }),
    })
      .then((res) => res.json())
      .then((data) => {
        setReceipt(data.receipt);
        onSuccess();
      })
      .catch((err) => alert("Checkout failed: " + err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {!receipt ? (
          <>
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
            <button onClick={onClose}>Cancel</button>
          </>
        ) : (
          <>
            <h3>Receipt</h3>
            <p><strong>Order ID:</strong> {receipt.orderId}</p>
            <p><strong>Total:</strong> ₹{receipt.total}</p>
            <p><strong>Time:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
            <button onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#1e293b",
  color: "#e2e8f0",
  borderRadius: "12px",
  padding: "20px",
  width: "300px",
  textAlign: "center"
};
