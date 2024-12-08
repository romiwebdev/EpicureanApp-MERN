import React, { useState, useEffect } from "react";
import axios from "axios";
import Receipt from "./Receipt";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUtensils, 
  faTimes, 
  faChartLine,
  faFilter,
  faTrash,
  faEdit,
  faBars
} from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: "", 
    description: "", 
    price: "", 
    category: "", 
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemsPerPage = 6;

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuResponse, orderResponse, salesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/menu"),
          axios.get("http://localhost:5000/api/order"),
          axios.get("http://localhost:5000/api/order/sales-report")
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

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add or update menu
  const handleAddOrUpdateMenu = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isEditing 
        ? `http://localhost:5000/api/menu/${currentMenuId}`
        : "http://localhost:5000/api/menu";
      
      const method = isEditing ? axios.put : axios.post;
      const response = await method(endpoint, formData);
      
      const updatedMenuItems = isEditing
        ? menuItems.map(item => item._id === currentMenuId ? response.data : item)
        : [...menuItems, response.data];
      
      setMenuItems(updatedMenuItems);
      setFilteredMenuItems(updatedMenuItems);
      
      // Reset form and modal
      setFormData({
        name: "", description: "", price: "", category: "", image: ""
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
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      const updatedMenuItems = menuItems.filter(item => item._id !== id);
      setMenuItems(updatedMenuItems);
      setFilteredMenuItems(updatedMenuItems);
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  // Delete order
  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/order/${id}`);
      const updatedOrders = orders.filter(order => order._id !== id);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Category filter handler
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const filteredItems = category 
      ? menuItems.filter(item => item.category === category)
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '20px',
        gap: '10px'
      }}>
        {Array.from({ length: totalMenuPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentMenuPage(index + 1)}
            style={{
              ...styles.button,
              backgroundColor: currentMenuPage === index + 1 
                ? modernColors.primary 
                : modernColors.white,
              color: currentMenuPage === index + 1 
                ? modernColors.white 
                : modernColors.primary,
              border: `1px solid ${modernColors.primary}`,
              padding: '8px 15px',
              minWidth: '40px'
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  // Unique categories
  const categories = [...new Set(menuItems.map(item => item.category))];

  // Perbaharui definisi warna
const modernColors = {
  background: '#f4f7f6',
  primary: '#3498db',     // Soft Blue
  secondary: '#2ecc71',   // Emerald Green
  text: '#2c3e50',        // Dark Blue Gray
  accent: '#8e44ad',      // Deep Purple
  danger: '#e74c3c',      // Vibrant Red
  white: '#ffffff',
  lightGray: '#f8f9fa',   
  darkGray: '#e9ecef'     
};

// Gradient Button Style
const gradientButton = {
  backgroundImage: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  color: 'white',
  border: 'none',
  boxShadow: '0 8px 15px rgba(37, 117, 252, 0.3)',
  transition: 'transform 0.3s ease',
  padding: '12px 20px',
  borderRadius: '10px',
  fontWeight: '600',
  '&:hover': {
    transform: 'scale(1.05)'
  }
};

  // Responsive Styles (getResponsiveStyles function)
  const getResponsiveStyles = () => {
    const screenWidth = window.innerWidth;
    
    return {
      container: {
        fontFamily: "'Inter', sans-serif", // Modern, clean font
        maxWidth: screenWidth > 1200 ? '1400px' : '100%',
        margin: '0 auto',
        padding: screenWidth > 768 ? '40px' : '20px',
        backgroundColor: modernColors.background,
        minHeight: '100vh',
      },
      header: {
        textAlign: 'center',
        color: modernColors.text,
        marginBottom: '50px',
        fontSize: screenWidth > 768 ? '2.5em' : '1.8em',
        fontWeight: '700',
        letterSpacing: '-0.5px',
      },
      
      menuGrid: {
        display: 'grid',
        gridTemplateColumns: screenWidth > 1024 
          ? 'repeat(3, 1fr)' 
          : screenWidth > 768 
            ? 'repeat(2, 1fr)' 
            : '1fr',
        gap: '15px', // Kurangi gap
        justifyContent: 'center', // Tengahkan grid
        alignItems: 'center',
      },
      menuItemImage: {
        width: '100%',
        height: '200px', // Fixed height
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '10px'
      },
    
      mobileMenu: {
        display: screenWidth <= 768 ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '250px',
        height: '100%',
        backgroundColor: 'white',
        zIndex: 1000,
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 0 15px rgba(0,0,0,0.2)',
        padding: '20px',
      },
      responsiveButton: {
        display: screenWidth <= 768 ? 'flex' : 'none',
        position: 'fixed',
        top: '15px',
        left: '15px',
        zIndex: 1100,
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '10px',
      },
      mobileForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: window.innerWidth <= 768 ? '100%' : 'auto'
      },
      mobileInput: {
        width: '100%',
        padding: '12px',
        fontSize: window.innerWidth <= 768 ? '16px' : 'inherit'
      }
    };
    
  };

  // Styles
  const styles = {
    
    card: {
      backgroundColor: modernColors.white,
      borderRadius: '16px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
      padding: '35px',
      marginBottom: '35px',
      border: '1px solid rgba(0,0,0,0.05)',
    },
    
    menuItem: {
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: '12px', // Sedikit mengecilkan border radius
      padding: '15px', // Kurangi padding
      textAlign: 'center',
      transition: 'all 0.3s ease',
      backgroundColor: modernColors.white,
      boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
      position: 'relative',
      overflow: 'hidden',
      width: '100%', // Pastikan full width
      maxWidth: '300px', // Batasi lebar maksimum
      margin: '0 auto', // Tengahkan
    },
    button: {
      padding: '12px 20px',
      margin: '10px 5px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontSize: '0.9em',
    },
    primaryButton: {
      backgroundColor: modernColors.primary,
      color: modernColors.white,
      boxShadow: '0 8px 15px rgba(52,152,219,0.2)',
    },
    dangerButton: {
      backgroundColor: modernColors.danger,
      color: modernColors.white,
      boxShadow: '0 8px 15px rgba(231,76,60,0.2)',
    },
    salesReport: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#e8f5e9',
      borderRadius: '10px',
      textAlign: 'center',
      fontSize: '1.5em',
      color: '#2c3e50',
    },
  };

  
  // Responsive hooks
  useEffect(() => {
    const handleResize = () => {
      // Force re-render for responsive design
      setMenuItems([...menuItems]);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuItems]);

  return (
    <>
     

      <div style={getResponsiveStyles().container}>
        <h1 style={getResponsiveStyles().header}>
          Restaurant Management Dashboard
        </h1>


        {/* Menu Management Section */}
        <div style={styles.card}>
          <h2>Menu Management</h2>
          
          {/* Add Menu Button */}
          <div style={{ 
  display: 'flex', 
  flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
  justifyContent: 'flex-end', 
  marginBottom: '20px' 
}}>
  <button 
    onClick={() => {
      setModalVisible(true);
      setIsEditing(false);
    }}
    style={{
      ...styles.button, 
      ...styles.primaryButton,
      width: window.innerWidth <= 768 ? '100%' : 'auto',
      marginBottom: window.innerWidth <= 768 ? '10px' : '0'
    }}
  >
    <FontAwesomeIcon icon={faShoppingCart} /> Add New Menu
  </button>
</div>

          {/* Category Filter */}
          <div style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start'
}}>
  <button
    onClick={() => {
      handleCategoryChange('');
      setCurrentMenuPage(1);
    }}
    style={{
      ...styles.button, 
      ...(selectedCategory === "" ? { background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white' } : {}),
      width: window.innerWidth <= 768 ? '100%' : 'auto'
    }}
  >
    All
  </button>
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => {
        handleCategoryChange(category);
        setCurrentMenuPage(1);
      }}
      style={{
        ...styles.button,
        ...(selectedCategory === category ? { background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white' } : {}),
        width: window.innerWidth <= 768 ? '100%' : 'auto'
      }}
    >
      {category}
    </button>
  ))}
</div>

          <div style={getResponsiveStyles().menuGrid}>
          {getPaginatedMenuItems().map((item) => (
            <div key={item._id} style={styles.menuItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={getResponsiveStyles().menuItemImage}
                  
                />
                <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>{item.name}</h3>
                <p style={{ color: '#7f8c8d', marginBottom: '15px' }}>
                  Rp {item.price} - {item.category}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => {
                      setFormData(item);
                      setIsEditing(true);
                      setCurrentMenuId(item._id);
                      setModalVisible(true);
                    }}
                    style={{...styles.button, ...styles.primaryButton}}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteMenu(item._id)}
                    style={{...styles.button, ...styles.dangerButton}}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </div>
              
            ))}
            {/* Menu Pagination */}
          </div>
            {totalMenuPages > 1 && renderMenuPagination()}
          
        </div>

        {/* Modal for Add/Edit Menu */}
        {modalVisible && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{...styles.card, width: window.innerWidth <= 768 ? '100%' : '500px',
      maxHeight: window.innerWidth <= 768 ? '90vh' : 'auto',
      overflowY: window.innerWidth <= 768 ? 'auto' : 'visible'}}>
              <h2>{isEditing ? "Edit Menu Item" : "Add New Menu Item"}</h2>
              <form onSubmit={handleAddOrUpdateMenu}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #d1d5da', borderRadius: '5px' }}
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #d1d5da', borderRadius: '5px' }}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #d1d5da', borderRadius: '5px' }}
                  required
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #d1d5da', borderRadius: '5px' }}
                  required
                />
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #d1d5da', borderRadius: '5px' }}
                  required
                />
                <button 
                  type="submit" 
                  style={{...styles.button, ...styles.primaryButton}}
                >
                  {isEditing ? "Update Menu" : "Add Menu"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setModalVisible(false)} 
                  style={{...styles.button, ...styles.dangerButton}}
                >
                  <FontAwesomeIcon icon={faTimes} /> Close
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div style={styles.card}>
          <h2>Recent Orders</h2>
          <ul style={{ 
  listStyleType: 'none', 
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
}}>
  {currentOrders.map((order) => (
    <li 
      key={order._id} 
      style={{ 
        padding: '15px', 
        border: '1px solid #e1e4e8', 
        borderRadius: '8px',
        display: 'flex',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: window.innerWidth <= 768 ? '10px' : '0'
      }}
    >
      <div>
        {order.name} - Rp {order.total}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: '10px',
        width: window.innerWidth <= 768 ? '100%' : 'auto'
      }}>
        <button 
          onClick={() => setSelectedOrder(order)}
          style={{
            ...styles.button, 
            ...styles.primaryButton, 
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}
        >
          View Receipt
        </button>
        <button 
          onClick={() => handleDeleteOrder(order._id)}
          style={{
            ...styles.button, 
            ...styles.dangerButton,
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}
        >
          <FontAwesomeIcon icon={faTrash} /> Delete
        </button>
      </div>
    </li>
  ))}
</ul>
          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  ...styles.button,
                  backgroundColor: currentPage === index + 1 ? '#3498db' : 'white',
                  color: currentPage === index + 1 ? 'white' : '#3498db',
                  margin: '0 5px',
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Receipt Modal */}
        {selectedOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{...styles.card, width: '500px'}}>
              <Receipt order={selectedOrder} />
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{...styles.button, ...styles.dangerButton, width: '100%'}}
              >
                Close
              </button>
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