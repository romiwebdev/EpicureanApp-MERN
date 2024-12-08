import React from "react";

function Receipt({ order, closeModal }) {
  const handlePrint = () => {
    // Simpan konten asli dari body
    const originalContents = document.body.innerHTML;
    
    // Ambil hanya konten struk dari id receipt
    const receiptContent = document.getElementById("receipt").innerHTML;
    
    // Ganti konten body dengan struk saja
    document.body.innerHTML = receiptContent;
    
    // Panggil window.print() untuk membuka dialog cetak
    window.print();
    
    // Kembalikan body ke konten asli setelah mencetak
    document.body.innerHTML = originalContents;
  };

  return (
    <div style={{ width: "300px", margin: "0 auto", fontFamily: "monospace" }}>
      <h2 style={{ textAlign: "center" }}>Restaurant Name</h2>
      <p style={{ textAlign: "center" }}>Address: Example Street, City</p>
      <hr />
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Customer:</strong> {order.name}</p>
      <p><strong>Address:</strong> {order.address}</p>
      <hr />
      <h3>Items:</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} - Rp {item.price} x {item.quantity} = Rp{" "}
            {item.price * item.quantity}
          </li>
        ))}
      </ul>
      <hr />
      <p><strong>Total:</strong> Rp {order.total}</p>
      <p style={{ textAlign: "center" }}>Thank you for your order!</p>

      {/* Tombol untuk mencetak struk */}
      <button onClick={handlePrint} style={styles.printButton}>Print Receipt</button>

      {/* Div dengan ID receipt yang hanya berisi struk */}
      <div id="receipt" style={{ display: "none" }}>
        <h2 style={{ textAlign: "center" }}>Restaurant Name</h2>
        <p style={{ textAlign: "center" }}>Address: Example Street, City</p>
        <hr />
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Customer:</strong> {order.name}</p>
        <p><strong>Address:</strong> {order.address}</p>
        <hr />
        <h3>Items:</h3>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} - Rp {item.price} x {item.quantity} = Rp{" "}
              {item.price * item.quantity}
            </li>
          ))}
        </ul>
        <hr />
        <p><strong>Total:</strong> Rp {order.total}</p>
        <p style={{ textAlign: "center" }}>Thank you for your order!</p>
      </div>

      {/* Tombol Close Modal */}
      <button onClick={closeModal} style={styles.closeButton}>Close</button>
    </div>
  );
}

const styles = {
  printButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  closeButton: {
    display: "none",
  },
};

export default Receipt;
