import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaPaperPlane, FaUser, FaLinkedin } from "react-icons/fa";
const Footer = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Email tidak valid");
      return;
    }

    // Simulasi pengiriman email
    console.log("Email valid:", email);
    setIsSubscribed(true);
    setEmail("");
    setEmailError("");

    // Reset status berlangganan setelah 3 detik
    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  const socialLinks = [
    {
      icon: <FaInstagram />,
      link: "https://instagram.com/romynn10",
      color: "#E1306C",
    },
    {
      icon: <FaLinkedin />,
      link: "https://linkedin.com/in/romi-webdev",
      color: "#0077B5",
    },
    {
      icon: <FaUser />,
      link: "https://romifullstack.vercel.app",
      color: "#4CAF50",
    },
  ];

  return (
    <motion.footer
      style={styles.footer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div style={styles.footerContent}>
        {/* Bagian Brand */}
        <motion.div
          style={styles.brandSection}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div style={styles.logo}>
            Epicurean
            <span style={styles.logoHighlight}>Culinary</span>
          </div>
          <p style={styles.brandDescription}>
            Menjelajahi dunia citarasa melalui pengalaman kuliner yang tak
            terlupakan.
          </p>
        </motion.div>

        {/* Navigasi Cepat */}
        <motion.div
          style={styles.quickLinks}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h4 style={styles.sectionTitle}>Navigasi</h4>
          {[
            { label: "Beranda", path: "/" },
            { label: "Menu", path: "#menu" },
            { label: "Contact", path: "#contact" },
          ].map((link, index) => (
            <motion.a
              key={index}
              href={link.path}
              style={styles.footerLink}
              whileHover={{
                x: 10,
                color: "#00d9f5",
              }}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Newsletter */}
        <motion.div
          style={styles.newsletterSection}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h4 style={styles.sectionTitle}>Newsletter</h4>
          <form onSubmit={handleEmailSubmit} style={styles.newsletterForm}>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                style={{
                  ...styles.newsletterInput,
                  borderColor: emailError ? "red" : "transparent",
                }}
                required
              />
              {emailError && (
                <div style={styles.errorMessage}>{emailError}</div>
              )}
            </div>
            <motion.button
              type="submit"
              style={styles.newsletterButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaPaperPlane style={{ marginRight: "10px" }} />
              {isSubscribed ? "Terima Kasih!" : "Berlangganan"}
            </motion.button>
          </form>

          {/* Sosial Media */}
          <div style={styles.socialIcons}>
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.link}
                style={{ ...styles.socialIcon, color: social.color }}
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        style={styles.copyright}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span style={styles.copyrightText}>
          © 2024 dibuat oleh Romi, untuk memenuhi tugas final project Talenthub.
        </span>
      </motion.div>
    </motion.footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "rgba(22, 33, 62, 0.95)",
    padding: "60px 20px 30px",
    color: "white",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  footerContent: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "1400px",
    margin: "0 auto",
    flexWrap: "wrap",
    gap: "30px",
  },
  brandSection: {
    maxWidth: "300px",
  },
  logo: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  logoHighlight: {
    backgroundImage: "linear-gradient(45deg, #00f5a0, #00d9f5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginLeft: "10px",
  },
  brandDescription: {
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.6,
  },
  sectionTitle: {
    marginBottom: "20px",
    fontSize: "1.3rem",
    backgroundImage: "linear-gradient(45deg, #00f5a0, #00d9f5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
  },
  quickLinks: {
    display: "flex",
    flexDirection: "column",
  },
  footerLink: {
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    marginBottom: "10px",
    transition: "all 0.3s ease",
    position: "relative",
  },
  newsletterSection: {
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: "15px",
  },
  newsletterInput: {
    width: "200px",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid transparent",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  errorMessage: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "5px",
    position: "absolute",
    bottom: "-20px",
    left: "0",
  },
  newsletterButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 15px",
    borderRadius: "8px",
    background: "linear-gradient(45deg, #00f5a0, #00d9f5)",
    color: "rgba(22, 33, 62, 1)",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  socialIcon: {
    fontSize: "1.5rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.1)",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  copyright: {
    marginTop: "40px",
    paddingTop: "20px",
    textAlign: "center",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  copyrightText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "0.9rem",
    backgroundImage: "linear-gradient(45deg, #00f5a0, #00d9f5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundSize: "200% auto",
    animation: "gradient-move 3s ease infinite",
  },
};

// Komponen Tambahan untuk Efek Hover pada Link
const HoverLink = ({ children, style, ...props }) => {
  return (
    <motion.a
      {...props}
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
      }}
      whileHover="hover"
    >
      {children}
      <motion.span
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "2px",
          backgroundColor: "#00d9f5",
          transformOrigin: "left",
        }}
        variants={{
          hover: {
            scaleX: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          initial: {
            scaleX: 0,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
        }}
        initial="initial"
      />
    </motion.a>
  );
};

// Animasi Gradient Global
const GlobalStyles = () => (
  <style>{`
    @keyframes gradient-move {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @media (max-width: 768px) {
      footer {
        padding: 30px 10px;
      }

      .footer-content {
        flex-direction: column;
        align-items: center;
      }

      .footer-section {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
      }
    }
  `}</style>
);

// Komponen Footer Utama
const ModernFooter = () => {
  return (
    <>
      <GlobalStyles />
      <Footer />
    </>
  );
};

export default ModernFooter;
