import React from "react";
import html2canvas from 'html2canvas';

function Receipt({ order, closeModal }) {
  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const receiptContent = document.getElementById("receipt").innerHTML;
    
    document.body.innerHTML = receiptContent;
    window.print();
    
    document.body.innerHTML = originalContents;
  };

  const handleDownloadImage = () => {
    const receiptElement = document.getElementById("receipt");
    
    html2canvas(receiptElement, { 
      scale: 3,
      useCORS: true,
      backgroundColor: null 
    }).then(canvas => {
      const imageData = canvas.toDataURL("image/png");
      
      const link = document.createElement('a');
      link.download = `receipt_${order._id}.png`;
      link.href = imageData;
      link.click();
    });
  };

  return (
    <div style={styles.container}>
      <div 
        id="receipt" 
        style={styles.receiptWrapper}
      >
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.restaurantName}>Epicurean Culinary</h1>
          <p style={styles.subheader}>Elegant Dining Experience</p>
        </div>

        {/* Order Details */}
        <div style={styles.orderInfo}>
          <div style={styles.orderInfoRow}>
            <span style={styles.orderInfoLabel}>Order ID</span>
            <span style={styles.orderInfoValue}>{order._id}</span>
          </div>
          <div style={styles.orderInfoRow}>
            <span style={styles.orderInfoLabel}>Customer</span>
            <span style={styles.orderInfoValue}>{order.name}</span>
          </div>
          <div style={styles.orderInfoRow}>
            <span style={styles.orderInfoLabel}>Date</span>
            <span style={styles.orderInfoValue}>
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div style={styles.itemsSection}>
          <div style={styles.itemsHeader}>
            <span>Items</span>
          </div>
          {order.items.map((item, index) => (
            <div key={index} style={styles.itemRow}>
              <div style={styles.itemDetails}>
                <div style={styles.itemName}>{item.name}</div>
                <div style={styles.itemPriceBreakdown}>
                  <span>
                    Rp {item.price.toLocaleString()} × {item.quantity}
                  </span>
                </div>
              </div>
              <div style={styles.itemTotal}>
                Rp {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Total Section */}
        <div style={styles.totalSection}>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>
              Rp {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>Thank you for dining with us!</p>
          <p style={styles.footerSubtext}>
          Epicurean Culinary - Where Taste Meets Elegance
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button 
          onClick={handlePrint} 
          style={styles.printButton}
        >
          🖨️ Print Receipt
        </button>
        <button 
          onClick={handleDownloadImage} 
          style={styles.downloadButton}
        >
          📥 Download Image
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    width: "380px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
  },
  receiptWrapper: {
    padding: "25px",
    backgroundColor: "white",
    borderRadius: "12px"
  },
  header: {
    textAlign: "center",
    marginBottom: "20px"
  },
  restaurantName: {
    margin: 0,
    color: "#2c3e50",
    fontSize: "24px",
    fontWeight: "700"
  },
  subheader: {
    margin: 0,
    color: "#7f8c8d",
    fontSize: "14px"
  },
  orderInfo: {
    backgroundColor: "#f1f3f5",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px"
  },
  orderInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },
  orderInfoLabel: {
    color: "#495057",
    fontWeight: "600"
  },
  orderInfoValue: {
    color: "#2c3e50",
    fontWeight: "500"
  },
  itemsSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "15px"
  },
  itemsHeader: {
    fontWeight: "700",
    marginBottom: "15px",
    color: "#2c3e50"
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e9ecef",
    paddingBottom: "12px",
    marginBottom: "12px"
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "5px"
  },
  itemPriceBreakdown: {
    color: "#868e96",
    fontSize: "13px"
  },
  itemTotal: {
    fontWeight: "600",
    color: "#2c3e50"
  },
  totalSection: {
    marginTop: "15px",
    borderTop: "2px solid #e9ecef",
    paddingTop: "15px"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between"
  },
  totalLabel: {
    fontWeight: "700",
    color: "#2c3e50"
  },
  totalValue: {
    fontWeight: "700",
    color: "#e74c3c"
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid #e9ecef"
  },
  footerText: {
    margin: "5px 0",
    color: "#495057"
  },
  footerSubtext: {
    margin: "5px 0",
    color: "#868e96",
    fontSize: "12px"
  },
  actionButtons: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px"
  },
  printButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "background-color 0.3s"
  },
  downloadButton: {
    backgroundColor: "#2ecc71 ",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "background-color 0.3s"
  }
};

export default Receipt;