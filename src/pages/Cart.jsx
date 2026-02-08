import React, { useState } from "react";
import "../styles/Cart.css";
import { 
  FaShoppingCart, FaUserCircle, FaTrashAlt, FaPlus, FaMinus, 
  FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaYoutube 
} from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import carrtImg from "../assets/colorr.jpg"; 

const Cart = () => {
  const navigate = useNavigate();
  const { cart: cartItems = [], removeFromCart, updateQuantity } = useCart(); 

  const [confirmDelete, setConfirmDelete] = useState({ show: false, itemId: null });

  const handleDeleteClick = (id) => {
    setConfirmDelete({ show: true, itemId: id });
  };

  const confirmDeletion = () => {
    removeFromCart(confirmDelete.itemId);
    setConfirmDelete({ show: false, itemId: null });
  };

  const cancelDeletion = () => {
    setConfirmDelete({ show: false, itemId: null });
  };

  const shipping = cartItems.length > 0 ? 20 : 0;

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0; 
    const quantity = parseInt(item.quantity) || 1;
    return acc + (price * quantity);
  }, 0);

  const totalAmount = subtotal + shipping;

  const getImageUrl = (item) => {
    if (!item.files || item.files.length === 0) {
      return "https://via.placeholder.com/70?text=No+Image";
    }
    return item.files[0] || "https://via.placeholder.com/70?text=Invalid";
  };

  return (
    <div className="cart-page">
      {/* Section Cover */}
      <section className="cart-cover" style={{ backgroundImage: `url(${carrtImg})` }}>
        <nav className="carrt-nav-overlay">
          <div className="nav-links">
            <a href="#!" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Home</a>
            <a href="#!" onClick={(e) => { e.preventDefault(); navigate("/shop"); }}>Shop</a>
            <a href="#!" onClick={(e) => { e.preventDefault(); navigate("/blog"); }}>Blog</a>
            <a href="#!" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About</a>
            <a href="#!" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>Contact</a>
            <FaUserCircle className="profile-icon" size={20} style={{ cursor: "pointer" }} onClick={() => navigate("/profile")} />
            <FaShoppingCart className="cart-icon" size={20} style={{ color: "#ffc107", cursor: "pointer" }} />
          </div>
        </nav>
        <div className="cover-text">
            <h1># Your Cart</h1>
            <p>Review your selected items before checkout!</p>
        </div>
      </section>

      <div className="container py-5">
        {cartItems && cartItems.length > 0 ? (
          <div className="table-responsive mb-5">
            <table className="table cart-table text-center align-middle">
              <thead>
                <tr>
                  <th>DELETE</th>
                  <th>IMAGE</th>
                  <th>PRODUCT</th>
                  <th>UNIT PRICE</th>
                  <th>QUANTITY</th>
                  <th>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const itemPrice = parseFloat(item.price) || 0;
                  const itemQty = parseInt(item.quantity) || 1;
                  const itemImage = getImageUrl(item);

                  return (
                    <tr key={item.id}>
                      <td>
                        <FaTrashAlt 
                          className="delete-icon" 
                          style={{ cursor: "pointer", color: "red" }} 
                          onClick={() => handleDeleteClick(item.id)} 
                        />
                      </td>
                      <td>
                        <img 
                          src={itemImage} 
                          alt="product" 
                          className="cart-product-img" 
                          style={{ 
                            width: "70px", 
                            height: "70px", 
                            borderRadius: "8px", 
                            objectFit: "cover" 
                          }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/70?text=Error";
                          }}
                        />
                      </td>
                      <td className="text-truncate" style={{maxWidth: "150px"}}>
                        {item.text || "No Name Product"}
                      </td>
                      <td>${itemPrice.toFixed(2)}</td>
                      <td>
                        <div className="quantity-control d-flex justify-content-center align-items-center gap-2">
                          <button 
                            className="btn btn-sm btn-light border" 
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={itemQty <= 1}
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="mx-2 fw-bold">{itemQty}</span>
                          <button 
                            className="btn btn-sm btn-light border" 
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold">${(itemPrice * itemQty).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <FaShoppingCart size={80} className="text-muted mb-4" />
            <h3 className="mb-4">Shopping cart is empty 🛍️</h3>
            <p className="text-muted mb-4">You haven't added any products yet</p>
            <button className="btn btn-dark px-5 py-2" onClick={() => navigate("/shop")}>
               Start Shopping Now
            </button>
          </div>
        )}

        {cartItems.length > 0 && (
            <div className="row g-4 mt-5">
            <div className="col-md-6">
                <h4 className="fw-bold mb-3">Apply discount coupon</h4>
                <div className="d-flex gap-2">
                <input type="text" className="form-control" placeholder="Enter coupon code" />
                <button className="btn btn-dark">Apply</button>
                </div>
            </div>

            <div className="col-md-6 border p-4 shadow-sm bg-light rounded-4">
                <h4 className="fw-bold mb-3">Cart Totals</h4>
                <table className="table table-borderless">
                <tbody>
                    <tr>
                      <td>Subtotal</td>
                      <td className="text-end">${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Shipping</td>
                      <td className="text-end">${shipping.toFixed(2)}</td>
                    </tr>
                    <tr className="fw-bold border-top fs-5">
                        <td>Total Amount</td>
                        <td className="text-primary text-end">${totalAmount.toFixed(2)}</td>
                    </tr>
                </tbody>
                </table>
                <button 
                  className="btn btn-warning w-100 mt-3 fw-bold py-2"
                  onClick={() => alert("Checkout page is under development...")}
                >
                PROCEED TO CHECKOUT
                </button>
            </div>
            </div>
        )}
      </div>

      {/* البوكس الأسود للتأكيد */}
      {confirmDelete.show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              maxWidth: "90%",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "20px", color:"white" }}>
              Are you sure you want to delete this item?
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-danger" onClick={confirmDeletion}>
                Yes, Delete
              </button>
              <button className="btn btn-secondary" onClick={cancelDeletion}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer-section bg-dark text-white pt-5 pb-3 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h4 className="mb-3">Contact</h4>
              <p><strong>Phone:</strong> +201029924884</p>
              <p><strong>Address:</strong> Autostrad El Maadi, Cairo</p>
              <p><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
            </div>

            <div className="col-md-4 mb-4">
              <h4 className="mb-3">About</h4>
              <ul className="list-unstyled">
                <li><a href="#!" className="text-white-50 text-decoration-none">About us</a></li>
                <li><a href="#!" className="text-white-50 text-decoration-none">Delivery Info</a></li>
                <li><a href="#!" className="text-white-50 text-decoration-none">Privacy Policy</a></li>
                <li><a href="#!" className="text-white-50 text-decoration-none">Terms & Conditions</a></li>
              </ul>
            </div>

            <div className="col-md-4 mb-4">
              <h4 className="mb-3">Follow Us</h4>
              <div className="d-flex gap-3 fs-4">
                <FaFacebookF className="icon-hover" style={{ cursor: "pointer" }} />
                <FaTwitter className="icon-hover" style={{ cursor: "pointer" }} />
                <FaInstagram className="icon-hover" style={{ cursor: "pointer" }} />
                <FaYoutube className="icon-hover" style={{ cursor: "pointer" }} />
              </div>
            </div>
          </div>
          <hr className="bg-secondary" />
          <div className="text-center">
            <p className="mb-0 text-white-50">&copy; 2026 Dress On Me</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
