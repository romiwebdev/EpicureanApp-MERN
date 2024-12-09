import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaLock, 
  FaSignInAlt, 
  FaEye, 
  FaEyeSlash ,
  FaArrowLeft
} from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      if (response.data.isAuthenticated) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={styles.container}>
      <motion.div 
        style={styles.backButton}
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaArrowLeft />
      </motion.div>
      <motion.div 
        style={styles.loginWrapper}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          type: "spring" 
        }}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>Login</h2>
          <p style={styles.subtitle}>Welcome back to Epicurean</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          {error && (
            <motion.div 
              style={styles.errorBox}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div style={styles.inputWrapper}>
            <div style={styles.inputContainer}>
              <FaUser style={styles.icon} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputWrapper}>
            <div style={styles.inputContainer}>
              <FaLock style={styles.icon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <div 
                style={styles.passwordToggle} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <motion.button 
            type="submit" 
            style={styles.loginButton}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignInAlt style={styles.buttonIcon} />
            Login
          </motion.button>
        </form>

        <div style={styles.footer}>
  <p style={styles.footerText}>
    Don't have access? 
    <span 
      style={styles.signupLink}
      onClick={() => navigate('/')}
    >
      Back
    </span>
  </p>
</div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#16213E',
    background: 'linear-gradient(135deg, #16213E 0%, #0F1828 100%)',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: '#00F5A0',
    fontSize: '1.5rem',
    cursor: 'pointer',
    zIndex: 10,
    padding: '10px',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 245, 160, 0.1)',
  },
  loginWrapper: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 15px 35px rgba(0, 245, 160, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 245, 160, 0.2)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    color: '#00F5A0',
    fontSize: '2rem',
    marginBottom: '10px',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWrapper: {
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#00F5A0',
    fontSize: '1rem',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '15px 15px 15px 45px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(0, 245, 160, 0.2)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  passwordToggle: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#00F5A0',
    cursor: 'pointer',
    zIndex: 1,
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#00F5A0',
    color: '#16213E',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
  errorBox: {
    backgroundColor: 'rgba(255,0,0,0.1)',
    color: '#FF6B6B',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.9rem',
  },
  signupLink: {
    color: '#00F5A0',
    marginLeft: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Login;