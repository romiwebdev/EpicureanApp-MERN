import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import MenuModal from "./MenuModal";
import OrderModal from "./OrderModal";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Jumlah item per halaman
  const [cart, setCart] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ name: "", address: "" });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          "https://epicurean-app-mern-server.vercel.app/api/menu"
        );
        setMenuItems(response.data);

        // Ekstrak kategori unik dari menu
        const uniqueCategories = [
          "All",
          ...new Set(response.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
        setFilteredMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  // Fungsi untuk memfilter menu berdasarkan kategori
  const filterMenuByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredMenuItems(menuItems);
    } else {
      const filtered = menuItems.filter((item) => item.category === category);
      setFilteredMenuItems(filtered);
    }
  };

  // Fungsi untuk mendapatkan menu yang di-filter dan dipaginasi
  const getPaginatedMenuItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMenuItems.slice(startIndex, endIndex);
  };

  // Hitung total halaman
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render pagination component
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <motion.button
          key={i}
          style={{
            margin: "0 5px",
            padding: "10px 15px",
            backgroundColor:
              currentPage === i
                ? "rgba(0,245,160,0.2)"
                : "rgba(255,255,255,0.1)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </motion.button>
      );
    }
    return pageNumbers;
  };
  // Menangani tampilan detail menu
  const handleViewDetails = (menu) => {
    setSelectedMenu(menu);
    setIsMenuModalOpen(true);
  };

  // Menutup modal menu
  const closeMenuModal = () => {
    setIsMenuModalOpen(false);
    setSelectedMenu(null);
  };

  // Menambahkan item menu ke keranjang
  const addToCart = (menu) => {
    const existingItem = cart.find((item) => item._id === menu._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === menu._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
  };

  // Memperbarui kuantitas item di keranjang
  const updateCartQuantity = (id, quantity) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Menghapus item dari keranjang
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // Menghitung total harga dari semua item di keranjang
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Menangani perubahan pada detail pesanan
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  // Mengirimkan pesanan ke server
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        ...orderDetails,
        items: cart,
        total: getTotalPrice(),
      };
      const response = await axios.post(
        "https://epicurean-app-mern-server.vercel.app/api/order",
        orderData
      );
      console.log("Order submitted:", response.data);
      setCart([]);
      setOrderDetails({ name: "", address: "" });
      alert("Order successfully placed!");
      setIsOrderModalOpen(false);
    } catch (err) {
      console.error("Error submitting order:", err);
    }
  };

  // Menangani perubahan pada form kontak
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  // Mengirimkan pesan kontak ke server
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://epicurean-app-mern-server.vercel.app/api/contact",
        contactForm
      );
      alert("Pesan berhasil dikirim!");
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error mengirim pesan:", error);
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    }
  };

  const isMobile = window.innerWidth <= 768;


{/* Variabel Responsif */}
const getResponsiveSize = (baseSize) => {
  const screenWidth = window.innerWidth;
  const scaleFactor = screenWidth / 1200; // 1200 adalah ukuran layar "ideal"
  return `${Math.max(baseSize * scaleFactor, baseSize * 0.7)}rem`; // Membatasi skala minimum
};

  return (
    <div style={{ position: "relative" }}>
      {/* Navbar */}
      <Navbar
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1,
        }}
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        onCartClick={() => setIsOrderModalOpen(true)}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delayChildren: 0.3, staggerChildren: 0.1 },
          },
        }}
        style={styles.container}
      >
       {/* Hero Section */}
        <motion.section
      id="home"
      style={{
        position: "relative",
        marginTop: window.innerWidth <= 768 ? "-20%" : "-5%",
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        color: "white",
        overflow: "hidden",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effect */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05), transparent 50%)
          `,
          opacity: 0.5,
          zIndex: 1,
        }}
      >
        {/* Particle Effect */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        style={{
          maxWidth: "1000px",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          width: "90%",
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Title */}
<motion.h1
  style={{
    fontSize: window.innerWidth <= 768 ? "2.3rem" : "4.5rem",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-1px",
    marginBottom: "15px",
    backgroundImage: "linear-gradient(90deg, #00f5a0, #00d9f5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    position: "relative",
  }}
  animate={{
    textShadow: [
      '0 0 5px rgba(0,245,160,0.3)',
      '0 0 10px rgba(0,217,245,0.3)',
      '0 0 5px rgba(0,245,160,0.3)'
    ]
  }}
  transition={{
    repeat: Infinity,
    duration: 2,
    repeatType: 'reverse'
  }}
>
  Epicurean Experience

  {/* Animated Aesthetic Line */}
  <motion.div
    style={{
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      width: '250px', // Increased width
      height: '3px',
      background: 'linear-gradient(to right, #00f5a0, #00d9f5)',
      transform: 'translateX(-50%)',
      overflow: 'hidden',
    }}
  >
    <motion.div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to right, #00f5a0, #00d9f5)',
        position: 'absolute',
        top: 0,
        left: '-100%',
      }}
      animate={{
        left: ['0%', '100%'],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </motion.div>
</motion.h1>

        {/* Subtitle */}
        <motion.p
          style={{
            fontSize: window.innerWidth <= 768 ? "1rem" : "1.3rem",
            fontWeight: 300,
            marginBottom: "30px",
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.6,
          }}
        >
          Perjalanan Kuliner Yang Memukau - Setiap Hidangan Adalah Sebuah Seni
        </motion.p>

        {/* Buttons */}
        <motion.div
          style={{
            display: "flex",
            flexDirection: window.innerWidth <= 768 ? "column" : "row",
            gap: "15px",
            justifyContent: "center",
            alignItems: "center",
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.6,
                staggerChildren: 0.2
              }
            }
          }}
        >
          {/* Explore Menu Button */}
          <motion.button
            style={{
              padding: "12px 30px",
              fontSize: "1rem",
              borderRadius: "25px",
              background: "linear-gradient(135deg, #00f5a0, #00d9f5)",
              color: "#16213e",
              border: "none",
              fontWeight: 600,
              boxShadow: "0 10px 20px rgba(0,245,160,0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
              }
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 15px 30px rgba(0,245,160,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              document
                .getElementById("menu")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Jelajahi Menu
          </motion.button>

          {/* Contact Us Button */}
          <motion.button
            style={{
              padding: "12px 30px",
              fontSize: "1rem",
              borderRadius: "25px",
              background: "transparent",
              color: "white",
              border: "2px solid rgba(255,255,255,0.5)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
              }
            }}
            whileHover={{
              borderColor: "#00f5a0",
              color: "#00f5a0",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              document
                .getElementById("contact")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Hubungi Kami
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Floating Decorative Elements */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "-50px",
          right: "-50px",
          width: window.innerWidth <= 768 ? "120px" : "200px",
          height: window.innerWidth <= 768 ? "120px" : "200px",
          background:
            "linear-gradient(135deg, rgba(0,245,160,0.15), rgba(0,217,245,0.15))",
          borderRadius: "50%",
          zIndex: 1,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          rotate: [0, 360]
        }}
        transition={{ 
          delay: 0.6, 
          duration: 0.7,
          rotate: {
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />
    </motion.section>

        {/* Menu Section */}
        <motion.div
          style={{
            ...styles.content,
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            color: "white",
            padding: "60px 20px",
          }}
          id="menu"
        >
          <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              ...styles.header,
              color: "white",
              textAlign: "center",
            }}
          >
            <motion.h1
              style={{
                fontSize: "3.5rem",
                fontWeight: 700,
                backgroundImage: "linear-gradient(45deg, #00f5a0, #00d9f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Culinary Delights
            </motion.h1>
            <motion.p
              style={{
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.7)",
                marginTop: "10px",
              }}
            >
              Explore Extraordinary Flavors
            </motion.p>
          </motion.header>

          {/* Section Kategori */}
          <motion.div style={styles.categorySection}>
            {categories.map((category) => (
              <motion.button
                key={category}
                style={{
                  ...styles.categoryButton,
                  backgroundColor:
                    selectedCategory === category
                      ? "rgba(0,245,160,0.2)"
                      : "rgba(255,255,255,0.1)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => filterMenuByCategory(category)}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Menu Items */}
          <motion.section style={styles.menuSection}>
            <motion.div
              style={styles.menuList}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <AnimatePresence>
                {getPaginatedMenuItems().map((item) => (
                  // Existing menu item rendering code
                  <motion.div
                    key={item._id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8, y: 50 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 120,
                          damping: 10,
                        },
                      },
                      hover: {
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(0,245,160,0.2)",
                        transition: { duration: 0.3, type: "tween" },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    style={styles.menuItem}
                  >
                    <motion.div
                      style={styles.menuImageContainer}
                      whileHover={{ scale: 1.1 }}
                    >
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        style={styles.menuImage}
                        whileHover={{ scale: 1.2 }}
                      />
                    </motion.div>

                    <div style={styles.menuInfo}>
                      <motion.h3
                        style={styles.menuName}
                        whileHover={{ color: "#ff6b6b" }}
                      >
                        {item.name}
                      </motion.h3>

                      <p style={styles.menuDescription}>
                        {item.description?.substring(0, 80)}...
                      </p>

                      <div style={styles.menuFooter}>
                        <motion.span
                          style={styles.menuPrice}
                          whileHover={{ scale: 1.1 }}
                        >
                          Rp {item.price.toLocaleString()}
                        </motion.span>

                        <div style={styles.buttonGroup}>
                          <motion.button
                            style={styles.buttonDetails}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(item)}
                          >
                            Details
                          </motion.button>
                          <motion.button
                            style={styles.buttonAdd}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(item)}
                          >
                            + Cart
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {/* Pagination Section */}
            <motion.div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
                padding: "20px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "10px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Tombol Previous */}
                <motion.button
                  style={{
                    margin: "0 10px",
                    padding: "10px 15px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: currentPage > 1 ? "pointer" : "not-allowed",
                    opacity: currentPage > 1 ? 1 : 0.5,
                  }}
                  whileHover={{ scale: currentPage > 1 ? 1.1 : 1 }}
                  whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </motion.button>

                {/* Nomor Halaman */}
                {renderPagination()}

                {/* Tombol Next */}
                <motion.button
                  style={{
                    margin: "0 10px",
                    padding: "10px 15px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor:
                      currentPage < totalPages ? "pointer" : "not-allowed",
                    opacity: currentPage < totalPages ? 1 : 0.5,
                  }}
                  whileHover={{ scale: currentPage < totalPages ? 1.1 : 1 }}
                  whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.section>
        </motion.div>

        {/* Contact Section */}
        <motion.section
  id="contact"
  style={{
    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
    color: "white",
    padding: "80px 20px",
  }}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto",
      flexWrap: "wrap", // Flexibilitas untuk layar kecil
    }}
  >
    <motion.div
      style={{
        width: "45%",
        textAlign: "left",
        color: "white",
        marginBottom: "20px", // Jarak antar elemen
      }}
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Judul */}
      <motion.h2
        style={{
          fontSize: getResponsiveSize(2.6), // Responsif
          fontWeight: 700,
          backgroundImage: "linear-gradient(45deg, #00f5a0, #00d9f5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "20px",
        }}
      >
        Hubungi Kami
      </motion.h2>
      {/* Deskripsi */}
      <p
        style={{
          fontSize: getResponsiveSize(1.2),
          color: "rgba(255,255,255,0.7)",
        }}
      >
        Punya pertanyaan atau saran? Kami senang mendengar dari Anda!
      </p>
      {/* Detail Kontak */}
      <div
        style={{
          fontSize: getResponsiveSize(1),
          marginTop: "20px",
          lineHeight: "1.8",
        }}
      >
        <p>📞 +62 822-4462-3402</p>
        <p>✉️ rominmuh230@gmail.com</p>
        <p>📍 Jl. Raya Kuliner No. 123, Bojonegoro</p>
      </div>
    </motion.div>

    {/* Formulir */}
    <motion.form
      style={{
        width: "45%",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        marginTop: "40px",
      }}
      onSubmit={handleContactSubmit}
      initial={{ x: 50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Input */}
      <input
        type="text"
        name="name"
        placeholder="Nama Anda"
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "white",
          borderColor: "rgba(255,255,255,0.2)",
          padding: "12px 15px",
          borderRadius: "5px",
          fontSize: getResponsiveSize(1),
        }}
        value={contactForm.name}
        onChange={handleContactChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email Anda"
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "white",
          borderColor: "rgba(255,255,255,0.2)",
          padding: "12px 15px",
          borderRadius: "5px",
          fontSize: getResponsiveSize(1),
        }}
        value={contactForm.email}
        onChange={handleContactChange}
        required
      />
      <textarea
        name="message"
        placeholder="Pesan Anda"
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "white",
          borderColor: "rgba(255,255,255,0.2)",
          padding: "12px 15px",
          borderRadius: "5px",
          fontSize: getResponsiveSize(1),
          minHeight: "120px",
        }}
        value={contactForm.message}
        onChange={handleContactChange}
        required
      ></textarea>
      <motion.button
        type="submit"
        style={{
          backgroundColor: "#00f5a0",
          color: "#16213e",
          padding: "12px 20px",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          fontSize: getResponsiveSize(1),
          cursor: "pointer",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Kirim Pesan
      </motion.button>
    </motion.form>
  </div>
</motion.section>
        {/* untuk membuka modal */}
        {isMenuModalOpen && (
          <MenuModal menu={selectedMenu} closeModal={closeMenuModal} />
        )}
        {isOrderModalOpen && (
          <OrderModal
            cart={cart}
            orderDetails={orderDetails}
            handleOrderChange={handleOrderChange}
            handleSubmitOrder={handleSubmitOrder}
            closeModal={() => setIsOrderModalOpen(false)}
            removeFromCart={removeFromCart}
            updateCartQuantity={updateCartQuantity}
            getTotalPrice={getTotalPrice}
          />
        )}

        {/* Footer */}
        <Footer />
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
  },

  menuSection: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  menuList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  menuItem: {
    width: "100%",
    maxWidth: "300px",
    backgroundColor: "rgba(255,255,255,0.1)", // Ubah background menjadi transparan
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)", // Pertebal bayangan
    border: "1px solid rgba(255,255,255,0.1)", // Tambahkan border tipis
    transition: "transform 0.3s, box-shadow 0.3s",
    color: "white", // Ubah warna teks menjadi putih
  },
  menuImageContainer: {
    overflow: "hidden",
    borderRadius: "15px 15px 0 0",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)",
    },
  },
  menuImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    transition: "transform 0.3s ease-in-out",
    filter: "brightness(0.8)", // Kurangi kecerahan gambar
  },
  menuInfo: {
    padding: "15px",
    background: "rgba(0,0,0,0.1)", // Tambahkan background gelap transparan
  },
  menuName: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#00f5a0", // Gunakan warna gradient dari hero
    marginBottom: "10px",
  },
  menuDescription: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.7)", // Warna teks transparan
    margin: "10px 0",
  },
  menuFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255,255,255,0.1)", // Tambahkan border tipis
    paddingTop: "10px",
  },
  menuPrice: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#00d9f5", // Gunakan warna gradient dari hero
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  buttonDetails: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #00f5a0, #00d9f5)", // Gunakan gradient
    color: "#16213e",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonAdd: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)", // Background transparan
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)", // Border tipis
    borderRadius: "5px",
    cursor: "pointer",
  },
  categorySection: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  categoryButton: {
    padding: "10px 20px",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default MenuPage;
