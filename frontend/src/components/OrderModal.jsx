import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const OrderModal = ({ 
  cart, 
  orderDetails, 
  handleOrderChange, 
  handleSubmitOrder, 
  closeModal, 
  removeFromCart, 
  updateCartQuantity, 
  getTotalPrice 
}) => {
  return (
    <AnimatePresence>
      <motion.div 
        style={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          style={styles.container}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
        >
          {/* Header Keranjang */}
          <motion.div style={styles.header}>
            <motion.h2 style={styles.title}>
              Keranjang Anda
            </motion.h2>
            <motion.button 
              style={styles.closeBtn}
              onClick={closeModal}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </motion.div>

          {/* Daftar Produk */}
          <motion.div style={styles.cartList}>
            {cart.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={styles.emptyCart}
              >
                Keranjang Anda kosong
              </motion.p>
            ) : (
              cart.map((item, index) => (
                <motion.div 
                  key={item._id}
                  style={styles.cartItem}
                  initial={{ 
                    opacity: 0, 
                    x: -50 
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0 
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.3 
                  }}
                >
                  <div style={styles.cartItemContent}>
                    <span style={styles.itemName}>{item.name}</span>
                    <span style={styles.itemPrice}>
                      Rp {item.price.toLocaleString()}
                    </span>
                  </div>
                  <div style={styles.cartItemActions}>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => 
                        updateCartQuantity(
                          item._id, 
                          parseInt(e.target.value)
                        )
                      }
                      style={styles.quantityInput}
                    />
                    <motion.button 
                      style={styles.removeBtn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeFromCart(item._id)}
                    >
                      Hapus
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Total Harga */}
          <motion.div style={styles.totalSection}>
            <span style={styles.totalLabel}>Total:</span>
            <span style={styles.totalValue}>
              Rp {getTotalPrice().toLocaleString()}
            </span>
          </motion.div>

          {/* Form Pesanan */}
          <motion.form 
            style={styles.orderForm}
            onSubmit={handleSubmitOrder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div style={styles.formGroup}>
              <label style={styles.formLabel}>Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={orderDetails.name}
                onChange={handleOrderChange}
                style={styles.formInput}
                required
                placeholder="Masukkan nama Anda"
              />
            </motion.div>
            
            <motion.div style={styles.formGroup}>
              <label style={styles.formLabel}>Alamat Pengiriman</label>
              <input
                type="text"
                name="address"
                value={orderDetails.address}
                onChange={handleOrderChange}
                style={styles.formInput}
                required
                placeholder="Alamat lengkap pengiriman"
              />
            </motion.div>

            <motion.button
              type="submit"
              style={styles.submitBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Konfirmasi Pesanan
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(10px)",
    padding: "20px",
  },
  container: {
    backgroundColor: "rgba(22, 33, 62, 0.9)", // Warna dasar gelap
    borderRadius: "20px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "30px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    backgroundImage: 'linear-gradient(45deg, #00f5a0, #00d9f5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  closeBtn: {
    background: "transparent",
    color: "white",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  cartList: {
    maxHeight: "250px",
    overflowY: "auto",
    marginBottom: "20px",
    paddingRight: "10px",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "10px",
  },
  cartItemContent: {
    display: "flex",
    flexDirection: "column",
  },
  itemName: {
    fontSize: "1rem",
    marginBottom: "5px",
  },
  itemPrice: {
    color: "#00f5a0",
    fontWeight: "bold",
  },
  cartItemActions: {
    display: "flex",
    alignItems: "center",
  },
  quantityInput: {
    width: "60px",
    marginRight: "10px", padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
  },
  removeBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    padding: "5px 10px",
  },
  totalSection: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    fontWeight: "bold",
  },
  totalLabel: {
    fontSize: "1.2rem",
  },
  totalValue: {
    fontSize: "1.2rem",
    color: "#00f5a0",
  },
  orderForm: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  formLabel: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  formInput: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
  },
  submitBtn: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    padding: "10px",
    fontSize: "1em",
    marginTop: "10px",
  },
};

export default OrderModal; 