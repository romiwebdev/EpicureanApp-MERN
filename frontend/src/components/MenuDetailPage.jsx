import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function MenuDetailPage() {
  const { id } = useParams(); // Ambil ID menu dari URL
  const [menuItem, setMenuItem] = useState(null); // State untuk menyimpan data menu
  const [quantity, setQuantity] = useState(1); // State untuk jumlah pesanan

  // Fetch detail menu dari backend
  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/menu/${id}`);
        setMenuItem(response.data);
      } catch (err) {
        console.error("Error fetching menu details:", err);
      }
    };
    fetchMenuDetail();
  }, [id]);

  // Menangani perubahan jumlah pesanan
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Menangani proses pemesanan
  const handleOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/order", {
        menuId: menuItem._id,
        quantity: quantity,
      });
      alert(`You ordered ${quantity} ${menuItem.name}(s).`);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
    }
  };

  if (!menuItem) {
    return <p>Loading...</p>; // Tampilkan loading jika data belum ada
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{menuItem.name}</h1>
      <img
        src={menuItem.image}
        alt={menuItem.name}
        style={{ width: "300px", height: "300px", objectFit: "cover" }}
      />
      <p><strong>Category:</strong> {menuItem.category}</p>
      <p><strong>Price:</strong> Rp {menuItem.price}</p>
      <p><strong>Description:</strong> {menuItem.description}</p>

      <div style={{ marginTop: "20px" }}>
        <label>
          Quantity: 
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            style={{ marginLeft: "10px", width: "50px" }}
            min="1"
          />
        </label>
        <button
          onClick={handleOrder}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "20px",
          }}
        >
          Order Now
        </button>
      </div>
    </div>
  );
}

export default MenuDetailPage;
