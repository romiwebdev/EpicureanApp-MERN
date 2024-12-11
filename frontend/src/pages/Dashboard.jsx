import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import Receipt from "./Receipt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUtensils,
  faTimes,
  faChartLine,
  faFilter,
  faTrash,
  faEdit,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
// Komponen Dashboard untuk mengelola menu dan pesanan
function Dashboard() {
  // State untuk menyimpan item menu
  const [menuItems, setMenuItems] = useState([]);
  // State untuk menyimpan item menu yang difilter
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  // State untuk menyimpan pesanan
  const [orders, setOrders] = useState([]);
  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  // State untuk menentukan apakah sedang dalam mode edit
  const [isEditing, setIsEditing] = useState(false);
  // State untuk menyimpan ID menu yang sedang diedit
  const [currentMenuId, setCurrentMenuId] = useState(null);
  // State untuk menyimpan total penjualan
  const [totalSales, setTotalSales] = useState(0);
  // State untuk menyimpan pesanan yang dipilih
  const [selectedOrder, setSelectedOrder] = useState(null);
  // State untuk mengatur visibilitas modal
  const [modalVisible, setModalVisible] = useState(false);
  // State untuk menyimpan kategori yang dipilih
  const [selectedCategory, setSelectedCategory] = useState("");
  // State untuk menyimpan halaman saat ini
  const [currentPage, setCurrentPage] = useState(1);
  // State untuk mengatur menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Jumlah item per halaman
  const itemsPerPage = 6;
  // Hook untuk navigasi
  const navigate = useNavigate();


  // Fetch data on component mount
  // Proteksi Dashboard: Redirect ke login jika belum login
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      alert("You are not authorized to access this page. Please login first.");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuResponse, orderResponse, salesResponse] = await Promise.all([
          axios.get("https://epicurean-app-mern-server.vercel.app/api/menu"),
          axios.get("https://epicurean-app-mern-server.vercel.app/api/order"),
          axios.get("https://epicurean-app-mern-server.vercel.app/api/order/sales-report"),
        ]);

        setMenuItems(menuResponse.data);
        setFilteredMenuItems(menuResponse.data);
        setOrders(orderResponse.data);
        setTotalSales(salesResponse.data.totalSales);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  //untuk menangani logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update menu
  const handleAddOrUpdateMenu = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isEditing
      ? "https://epicurean-app-mern-server.vercel.app/api/menu/${currentMenuId}"
      : "https://epicurean-app-mern-server.vercel.app/api/menu";

      const method = isEditing ? axios.put : axios.post;
      const response = await method(endpoint, formData);

      const updatedMenuItems = isEditing
        ? menuItems.map((item) =>
            item._id === currentMenuId ? response.data : item
          )
        : [...menuItems, response.data];

      setMenuItems(updatedMenuItems);
      setFilteredMenuItems(updatedMenuItems);

      // Reset form and modal
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
      setModalVisible(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving menu:", error);
    }
  };

  // Delete menu item
  const handleDeleteMenu = async (id) => {
    try {
      await axios.delete(`https://epicurean-app-mern-server.vercel.app/api/menu/${id}`);
      const updatedMenuItems = menuItems.filter((item) => item._id !== id);
      setMenuItems(updatedMenuItems);
      setFilteredMenuItems(updatedMenuItems);
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  // Delete order
  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`https://epicurean-app-mern-server.vercel.app/api/order/${id}`);
      const updatedOrders = orders.filter((order) => order._id !== id);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Category filter handler
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const filteredItems = category
      ? menuItems.filter((item) => item.category === category)
      : menuItems;
    setFilteredMenuItems(filteredItems);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Tambahkan state untuk pagination menu
  const [currentMenuPage, setCurrentMenuPage] = useState(1);
  const menuItemsPerPage = 6;

  // Fungsi untuk mendapatkan menu yang di-paginate
  const getPaginatedMenuItems = () => {
    const startIndex = (currentMenuPage - 1) * menuItemsPerPage;
    const endIndex = startIndex + menuItemsPerPage;
    return filteredMenuItems.slice(startIndex, endIndex);
  };

  // Hitung total halaman menu
  const totalMenuPages = Math.ceil(filteredMenuItems.length / menuItemsPerPage);

  // Render pagination untuk menu
  const renderMenuPagination = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        {Array.from({ length: totalMenuPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentMenuPage(index + 1)}
            style={{
              ...styles.button,
              backgroundColor:
                currentMenuPage === index + 1
                  ? darkModernColors.primary
                  : darkModernColors.white,
              color:
                currentMenuPage === index + 1
                  ? darkModernColors.white
                  : darkModernColors.primary,
              border: `1px solid ${darkModernColors.primary}`,
              padding: "8px 15px",
              minWidth: "40px",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  // Fungsi untuk mengekspor laporan penjualan ke Excel
  const exportToExcel = (orders) => {
    // Transformasi data order menjadi format yang sesuai untuk Excel
    const excelData = orders.map((order) => ({
      "Order ID": order._id,
      "Nama Pelanggan": order.name,
      "Total Harga": order.total,
      Tanggal: new Date(order.createdAt).toLocaleDateString(),
      Status: order.status,
    }));

    // Membuat worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Membuat workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

    // Mengatur lebar kolom
    const columnWidths = [
      { wch: 20 }, // Order ID
      { wch: 25 }, // Nama Pelanggan
      { wch: 15 }, // Total Harga
      { wch: 15 }, // Tanggal
      { wch: 15 }, // Status
    ];
    worksheet["!cols"] = columnWidths;

    // Mengekspor file
    XLSX.writeFile(
      workbook,
      `Laporan_Penjualan_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // Unique categories
  const categories = [...new Set(menuItems.map((item) => item.category))];

  // Perbaharui definisi warna
  const darkModernColors = {
    background: "#f4f7f6",
    primary: "#3498db", // Soft Blue
    secondary: "#2ecc71", // Emerald Green
    text: "#2c3e50", // Dark Blue Gray
    accent: "#8e44ad", // Deep Purple
    danger: "#e74c3c", // Vibrant Red
    white: "#ffffff",
    lightGray: "#f8f9fa",
    darkGray: "#e9ecef",
  };

  // Gradient Button Style
  const gradientButton = {
    backgroundImage: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    color: "white",
    border: "none",
    boxShadow: "0 8px 15px rgba(37, 117, 252, 0.3)",
    transition: "transform 0.3s ease",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    "&:hover": {
      transform: "scale(1.05)",
    },
  };

  const darkdarkModernColors = {
    background: "#121212", // Deep dark background
    surface: "#1E1E1E", // Slightly lighter dark surface
    primary: "#3498db", // Soft Blue
    secondary: "#2ecc71", // Emerald Green
    text: "#E0E0E0", // Light gray text
    textSecondary: "#A0A0A0", // Muted gray text
    accent: "#8e44ad", // Deep Purple
    border: "#333333", // Dark border
    shadow: "rgba(255,255,255,0.05)", // Soft light shadow
  };

  // Responsive Styles (getResponsiveStyles function)
  const getResponsiveStyles = () => {
    const screenWidth = window.innerWidth;

    return {
      container: {
        fontFamily: "'Inter', sans-serif",
        maxWidth: screenWidth > 1200 ? "1400px" : "100%", // Tetap maksimal 1400px
        margin: "0 auto", // Pastikan margin auto untuk membuat konten terpusat
        padding:
          screenWidth > 768
            ? "40px 20px" // Kurangi padding horizontal
            : "20px 10px", // Padding lebih kecil di mobile
        backgroundColor: darkdarkModernColors.background,
        minHeight: "100vh",
        color: darkdarkModernColors.text,
      },
      header: {
        textAlign: "center",
        color: darkdarkModernColors.text,
        marginBottom: "50px",
        fontSize: screenWidth > 768 ? "2.5em" : "1.8em",
        fontWeight: "700",
        letterSpacing: "-0.5px",
        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
      },

      menuGrid: {
        display: "grid",
        gridTemplateColumns:
          screenWidth > 1024
            ? "repeat(3, 1fr)"
            : screenWidth > 768
            ? "repeat(2, 1fr)"
            : "1fr",
        gap: "15px", // Kurangi gap
        justifyContent: "center", // Tengahkan grid
        alignItems: "center",
      },
      menuItemImage: {
        width: "100%",
        height: "200px", // Fixed height
        objectFit: "cover",
        borderRadius: "10px",
        marginBottom: "10px",
      },

      mobileMenu: {
        display: screenWidth <= 768 ? "block" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "250px",
        height: "100%",
        backgroundColor: "white",
        zIndex: 1000,
        transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        padding: "20px",
      },
      responsiveButton: {
        display: screenWidth <= 768 ? "flex" : "none",
        position: "fixed",
        top: "15px",
        left: "15px",
        zIndex: 1100,
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "10px",
      },
      mobileForm: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: window.innerWidth <= 768 ? "100%" : "auto",
      },
      mobileInput: {
        width: "100%",
        padding: "12px",
        fontSize: window.innerWidth <= 768 ? "16px" : "inherit",
      },
    };
  };

  // Styles
  const styles = {
    card: {
      backgroundColor: darkdarkModernColors.surface,
      borderRadius: "16px",
      boxShadow: `0 15px 35px ${darkdarkModernColors.shadow}`,
      padding: "35px",
      marginBottom: "35px",
      border: `1px solid ${darkdarkModernColors.border}`,
      color: darkdarkModernColors.text,
      maxWidth: "100%",
      margin: "0 auto", // Tengahkan card
      display: "flex",
      justifyContent: "center", // Posisikan konten di tengah
      alignItems: "center",
      flexDirection: "column",
    },

    menuItem: {
      border: `1px solid ${darkdarkModernColors.border}`,
      borderRadius: "12px",
      padding: "15px",
      textAlign: "center",
      transition: "all 0.3s ease",
      backgroundColor: darkdarkModernColors.surface,
      boxShadow: `0 10px 20px ${darkdarkModernColors.shadow}`,
      position: "relative",
      overflow: "hidden",
      width: "100%",
      maxWidth: "300px",
      margin: "0 auto",

      transform: "translateY(0)",
      "&:hover": {
        transform: "translateY(-10px)",
        boxShadow: `0 15px 30px ${darkdarkModernColors.shadow}`,
      },
    },
    button: {
      padding: "12px 20px",
      margin: "10px 5px",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontWeight: "600",
      textTransform: "uppercase",
      fontSize: "0.9em",
      backgroundColor: darkdarkModernColors.primary,
      color: darkdarkModernColors.text,
      border: `1px solid ${darkdarkModernColors.primary}`,
    },
    primaryButton: {
      backgroundColor: darkModernColors.primary,
      color: darkModernColors.white,
      boxShadow: "0 8px 15px rgba(52,152,219,0.2)",
    },
    dangerButton: {
      backgroundColor: darkModernColors.danger,
      color: darkModernColors.white,
      boxShadow: "0 8px 15px rgba(231,76,60,0.2)",
    },
    compactButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 12px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "0.8rem",
      fontWeight: "500",
      "&:hover": {
        opacity: 0.9,
      },
    },

    paginationButton: {
      width: "35px",
      height: "35px",
      border: "none",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "0.9rem",
    },

    salesReport: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: darkdarkModernColors.surface,
      borderRadius: "10px",
      textAlign: "center",
      fontSize: "1.5em",
      marginBottom: "-30px",
      color: darkdarkModernColors.text,
    },
  };

  // Responsive hooks
  useEffect(() => {
    const handleResize = () => {
      // Force re-render for responsive design
      setMenuItems([...menuItems]);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuItems]);

  return (
    <>
      <div style={getResponsiveStyles().container}>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            hover: {
              backgroundColor: "#ff6b6b",
            },
          }}
        >
          Logout
        </button>
        <h1 style={getResponsiveStyles().header}>
          Restaurant Management Dashboard
        </h1>

        {/* Menu Management Section */}
        <div style={styles.card}>
          <h2>Menu Management</h2>

          {/* Add Menu Button */}
          <div
            style={{
              display: "flex",
              flexDirection: window.innerWidth <= 768 ? "column" : "row",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => {
                setModalVisible(true);
                setIsEditing(false);
              }}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                width: window.innerWidth <= 768 ? "100%" : "auto",
                marginBottom: window.innerWidth <= 768 ? "10px" : "0",
              }}
            >
              <FontAwesomeIcon icon={faShoppingCart} /> Add New Menu
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                maxWidth: "800px", // Batasi lebar maksimal
                overflowX: window.innerWidth <= 768 ? "auto" : "visible",
                padding: "10px",
                backgroundColor: darkModernColors.surface,
                borderRadius: "25px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              {[
                { label: "All", value: "" },
                ...categories.map((category) => ({
                  label: category,
                  value: category,
                })),
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => {
                    handleCategoryChange(value);
                    setCurrentMenuPage(1);
                  }}
                  style={{
                    padding: "10px 20px",
                    margin: "5px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor:
                      selectedCategory === value
                        ? darkModernColors.primary
                        : darkModernColors.background,
                    color:
                      selectedCategory === value
                        ? darkModernColors.white
                        : darkModernColors.text,
                    border: `1px solid ${
                      selectedCategory === value
                        ? darkModernColors.primary
                        : darkModernColors.border
                    }`,
                    transform:
                      selectedCategory === value ? "scale(1.05)" : "scale(1)",
                    boxShadow:
                      selectedCategory === value
                        ? "0 4px 8px rgba(0,0,0,0.2)"
                        : "none",
                    outline: "none",
                    userSelect: "none",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              padding: window.innerWidth <= 768 ? "10px" : "20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  window.innerWidth > 1024
                    ? "repeat(3, 1fr)"
                    : window.innerWidth > 768
                    ? "repeat(2, 1fr)"
                    : "1fr",
                gap: window.innerWidth <= 768 ? "15px" : "25px",
                width: "100%",
                maxWidth: "1400px",
              }}
            >
              {getPaginatedMenuItems().map((item) => (
                <div
                  key={item._id}
                  style={{
                    ...styles.menuItem,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: window.innerWidth <= 768 ? "200px" : "250px",
                      overflow: "hidden",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                        transition: "transform 0.3s ease",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        padding: "5px 10px",
                        textAlign: "center",
                        fontSize: "0.8em",
                      }}
                    >
                      {item.category}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "15px",
                      textAlign: "center",
                      width: "100%",
                      backgroundColor: darkdarkModernColors.surface,
                    }}
                  >
                    <h3
                      style={{
                        color: darkdarkModernColors.text,
                        marginBottom: "10px",
                        fontSize: window.innerWidth <= 768 ? "1em" : "1.2em",
                        fontWeight: "600",
                      }}
                    >
                      {item.name}
                    </h3>
                    <p
                      style={{
                        color: darkdarkModernColors.textSecondary,
                        marginBottom: "15px",
                        fontWeight: "500",
                      }}
                    >
                      Rp {item.price.toLocaleString()}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <button
                        onClick={() => {
                          setFormData(item);
                          setIsEditing(true);
                          setCurrentMenuId(item._id);
                          setModalVisible(true);
                        }}
                        style={{
                          ...styles.button,
                          ...styles.primaryButton,
                          width: window.innerWidth <= 768 ? "45%" : "auto",
                          padding: "10px 15px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        {window.innerWidth > 768 && "Edit"}
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(item._id)}
                        style={{
                          ...styles.button,
                          ...styles.dangerButton,
                          width: window.innerWidth <= 768 ? "45%" : "auto",
                          padding: "10px 15px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        {window.innerWidth > 768 && "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div
              style={{
                marginTop: "20px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {totalMenuPages > 1 && renderMenuPagination()}
            </div>
          </div>
        </div>

        {/* Modal for Add/Edit Menu */}
        {modalVisible && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                ...styles.card,
                width: window.innerWidth <= 768 ? "100%" : "500px",
                maxHeight: window.innerWidth <= 768 ? "90vh" : "auto",
                overflowY: window.innerWidth <= 768 ? "auto" : "visible",
              }}
            >
              <h2>{isEditing ? "Edit Menu Item" : "Add New Menu Item"}</h2>
              <form onSubmit={handleAddOrUpdateMenu}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    margin: "10px 0",
                    border: "1px solid #d1d5da",
                    borderRadius: "5px",
                  }}
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    margin: "10px 0",
                    border: "1px solid #d1d5da",
                    borderRadius: "5px",
                  }}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    margin: "10px 0",
                    border: "1px solid #d1d5da",
                    borderRadius: "5px",
                  }}
                  required
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    margin: "10px 0",
                    border: "1px solid #d1d5da",
                    borderRadius: "5px",
                  }}
                  required
                />
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    margin: "10px 0",
                    border: "1px solid #d1d5da",
                    borderRadius: "5px",
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.primaryButton }}
                >
                  {isEditing ? "Update Menu" : "Add Menu"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  style={{ ...styles.button, ...styles.dangerButton }}
                >
                  <FontAwesomeIcon icon={faTimes} /> Close
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div
          style={{
            ...styles.card,
            maxWidth: "100%",
            width: "100%",
            padding: "15px",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: window.innerWidth <= 768 ? "column" : "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "15px",
              borderBottom: `1px solid ${darkdarkModernColors.border}`,
              gap: window.innerWidth <= 768 ? "10px" : "0",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "1.2rem",
                color: darkdarkModernColors.text,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                style={{
                  color: darkdarkModernColors.primary,
                  fontSize: "1.2rem",
                }}
              />
              Recent Orders
            </h2>
            <FontAwesomeIcon
              icon={faFilter}
              style={{
                color: darkdarkModernColors.text,
                cursor: "pointer",
                fontSize: "1rem",
              }}
              onClick={() => handleOpenFilter()}
            />
          </div>

          {/* Empty State */}
          {currentOrders.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 0",
                color: darkdarkModernColors.textSecondary,
              }}
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "15px",
                  color: darkdarkModernColors.border,
                }}
              />
              <p>No orders found</p>
            </div>
          ) : (
            <>
              {/* Order List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  width: "95%",
                  marginLeft: "-30px",
                }}
              >
                {currentOrders.map((order) => (
                  <div
                    key={order._id}
                    style={{
                      display: "flex",
                      flexDirection:
                        window.innerWidth <= 768 ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      border: `1px solid ${darkdarkModernColors.border}`,
                      borderRadius: "10px",
                      backgroundColor: darkdarkModernColors.surface,
                      gap: window.innerWidth <= 768 ? "10px" : "20px",
                      width: "100%",
                    }}
                  >
                    {/* Order Details */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {/* Order Details */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "15px",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            backgroundColor:
                              darkdarkModernColors.primary + "20",
                            borderRadius: "50%",
                            minWidth: "45px",
                            minHeight: "45px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faUtensils}
                            style={{
                              color: darkdarkModernColors.primary,
                              fontSize: "1.2rem",
                            }}
                          />
                        </div>

                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: "600",
                              color: darkdarkModernColors.text,
                              fontSize: "0.9rem",
                              marginBottom: "5px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order.name}
                          </div>
                          <div
                            style={{
                              color: darkdarkModernColors.textSecondary,
                              fontSize: "0.8rem",
                            }}
                          >
                            Total: Rp {order.total.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginLeft: "15px",
                        }}
                      >
                        <button
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            ...styles.compactButton,
                            backgroundColor: darkdarkModernColors.primary,
                            color: "white",
                            width: "40px",
                            height: "40px",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "6px",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faChartLine}
                            style={{
                              fontSize: "1rem",
                              color: "white",
                            }}
                          />
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          style={{
                            ...styles.compactButton,
                            backgroundColor: darkdarkModernColors.danger,
                            color: "white",
                            width: "40px",
                            height: "40px",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "6px",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{
                              fontSize: "1rem",
                              color: "#121212",
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: "20px",
                  gap: "10px",
                }}
              >
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    style={{
                      ...styles.paginationButton,
                      backgroundColor:
                        currentPage === index + 1
                          ? darkdarkModernColors.primary
                          : darkdarkModernColors.surface,
                      color:
                        currentPage === index + 1
                          ? "white"
                          : darkdarkModernColors.text,
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => exportToExcel(currentOrders)}
                style={{
                  ...styles.compactButton,
                  backgroundColor: darkdarkModernColors.primary,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  marginTop: "20px",
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
                Download Laporan Penjualan
              </button>
            </>
          )}
        </div>

        {selectedOrder && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "400px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                border: "1px solid #e0e0e0",
                padding: "20px",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto",
                color: "black", // Tambahkan ini untuk warna teks hitam di seluruh modal
              }}
            >
              {/* Header bon */}
              <div
                style={{
                  textAlign: "center",
                  borderBottom: "2px dashed #c0c0c0",
                  paddingBottom: "10px",
                  marginBottom: "15px",
                }}
              >
                <h2 style={{ margin: 0, color: "black" }}>RECEIPT</h2>
                <small style={{ color: "black" }}>Transaction Details</small>
              </div>

              {/* Konten Receipt */}
              <div style={{ color: "black" }}>
                <Receipt order={selectedOrder} />
              </div>

              {/* Footer bon */}
              <div
                style={{
                  borderTop: "2px dashed #c0c0c0",
                  paddingTop: "15px",
                  marginTop: "15px",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#d32f2f")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#f44336")
                  }
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sales Report */}
        <div style={styles.salesReport}>
          <FontAwesomeIcon icon={faChartLine} />
          Total Sales: Rp {totalSales}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
