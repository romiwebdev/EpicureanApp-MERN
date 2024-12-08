import React from "react";
import { motion } from "framer-motion";

function MenuModal({ menu, closeModal }) {
  if (!menu) return null;

  return (
    <motion.div 
      style={styles.modalBackground}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        style={styles.modalContent}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div style={styles.modalHeader}>
          <motion.h2 style={styles.modalTitle}>
            {menu.name}
          </motion.h2>
          <motion.button 
            style={styles.closeButton} 
            onClick={closeModal}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </motion.div>

        <motion.div 
          style={styles.modalImageContainer}
          whileHover={{ scale: 1.05 }}
        >
          <motion.img
            src={menu.image}
            alt={menu.name}
            style={styles.modalImage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <motion.div style={styles.modalInfo}>
          <motion.div style={styles.modalInfoRow}>
            <span style={styles.modalInfoLabel}>Harga</span>
            <span style={styles.modalPrice}>
              Rp {menu.price.toLocaleString()}
            </span>
          </motion.div>
          
          <motion.div style={styles.modalInfoRow}>
            <span style={styles.modalInfoLabel}>Kategori</span>
            <span>{menu.category}</span>
          </motion.div>
          
          <motion.p style={styles.modalDescription}>
            {menu.description || "Deskripsi tidak tersedia."}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  modalBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "350px",
    width: "90%",
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    backgroundImage: 'linear-gradient(45deg, #00f5a0, #00d9f5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  closeButton: {
    background: "transparent",
    color: "white",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0 5px",
  },
  modalImageContainer: {
    marginBottom: "15px",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },
  modalImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    filter: "brightness(0.9)",
  },
  modalInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  modalInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "8px",
  },
  modalInfoLabel: {
    color: "#00d9f5",
    fontWeight: "bold",
  },
  modalPrice: {
    color: "#00f5a0",
    fontWeight: "bold",
  },
  modalDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.9rem",
    lineHeight: 1.5,
    marginTop: "10px",
  },
};

export default MenuModal;