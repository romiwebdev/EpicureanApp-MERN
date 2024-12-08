import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHome, faUtensils, faEnvelope, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const sections = [
  { id: 'home', name: 'Home', icon: faHome },
  { id: 'menu', name: 'Menu', icon: faUtensils },
  { id: 'contact', name: 'Contact', icon: faEnvelope },
];

const Navbar = ({ cartCount, onCartClick }) => {
  const [activeItem, setActiveItem] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      for (let section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const sectionTop = element.offsetTop - 100;
          const sectionHeight = element.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveItem(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavItemClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveItem(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  const renderNavItems = () => (
    sections.map((section) => (
      <motion.li
        key={section.id}
        style={{
          ...styles.navItem,
          backgroundColor: activeItem === section.id ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
        }}
        onClick={() => handleNavItemClick(section.id)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FontAwesomeIcon
          icon={section.icon}
          style={{
            ...styles.navIcon,
            color: activeItem === section.id ? '#00f5a0' : 'rgba(76, 175, 80, 0.7)',
          }}
        />
        <span style={styles.navItemText}>{section.name}</span>
      </motion.li>
    ))
  );

  return (
    <motion.nav
      style={styles.navbar}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.navContainer}>
        {/* Logo */}
        <motion.div
          style={styles.logoContainer}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={styles.logoWrapper}>
            <span style={styles.logo}>Epicurean</span>
            <span style={styles.logoSubtitle}>Culinary Experience</span>
          </div>
        </motion.div>

        {/* Navigation */}
        {!isMobile && (
          <motion.div
            style={styles.centeredNavWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ul style={styles.navList}>{renderNavItems()}</ul>
          </motion.div>
        )}

        {/* Cart */}
        <motion.div
          style={styles.cartContainer}
          onClick={onCartClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div style={styles.cartIconWrapper}>
            <FontAwesomeIcon icon={faShoppingCart} style={styles.cartIcon} />
            {cartCount > 0 && (
              <span style={styles.cartCount}>{cartCount}</span>
            )}
          </div>
        </motion.div>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <motion.div
            style={styles.hamburgerMenu}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ rotate: 90 }}
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faTimes : faBars}
              style={styles.hamburgerIcon}
            />
          </motion.div>
        )}

        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <motion.ul
            style={styles.mobileNavList}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {renderNavItems()}
          </motion.ul>
        )}
      </div>
    </motion.nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: 'rgba(22, 33, 62, 0.95)',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 15px rgba(0, 245, 160, 0.1)',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 15px',
    boxSizing: 'border-box',
  },
  logoWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    fontSize: '2.5rem',
    fontWeight: '700',
    backgroundImage: 'linear-gradient(45deg, #00f5a0, #00d9f5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  },
  navList: {
    display: 'flex',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    gap: '30px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white',
  },
  navIcon: {
    marginRight: '10px',
    fontSize: '1.2rem',
  },
  cartContainer: {
    position: 'relative',
    cursor: 'pointer',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  cartIcon: {
    color: '#00f5a0',
    fontSize: '1.5rem',
  },
  cartCount: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#00f5a0',
    color: '#16213e',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  hamburgerMenu: {
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  hamburgerIcon: {
    color: 'white',
  },
  mobileNavList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(22, 33, 62, 0.95)',
    display: 'flex',
    flexDirection: 'column',
    listStyleType: 'none',
    padding: 0,
    zIndex: 1000,
  },
};

export default Navbar;
