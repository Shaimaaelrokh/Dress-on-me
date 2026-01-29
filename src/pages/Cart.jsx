import React from "react";
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
  
  // نأخذ 'cart' من الـ Context ونسميها هنا 'cartItems' ليتوافق مع باقي الكود
  const { cart: cartItems = [], removeFromCart, updateQuantity } = useCart(); 

  // حساب الحسابات المالية
  const shipping = cartItems.length > 0 ? 20 : 0;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = subtotal + shipping;

  return (
    <div className="cart-page">
      {/* --- Section Cover --- */}
      <section className="cart-cover" style={{ backgroundImage: `url(${carrtImg})` }}>
        <nav className="carrt-nav-overlay">
          <div className="nav-links">
            <a href="#!" onClick={() => navigate("/home")}>Home</a>
            <a href="#!" onClick={() => navigate("/shop")}>Shop</a>
            <a href="#!" onClick={() => navigate("/blog")}>Blog</a>
            <a href="#!" onClick={() => navigate("/about")}>About</a>
            <a href="#!" onClick={() => navigate("/contact")}>Contact</a>
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
        {/* التحقق من وجود عناصر في السلة */}
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
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <FaTrashAlt 
                        className="delete-icon" 
                        style={{ cursor: "pointer", color: "red" }} 
                        onClick={() => removeFromCart(item.id)} 
                      />
                    </td>
                    <td><img src={item.image} alt={item.name} className="cart-product-img" style={{ width: "70px", borderRadius: "8px" }} /></td>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <div className="quantity-control d-flex justify-content-center align-items-center gap-2">
                        <button className="btn btn-sm btn-light border" onClick={() => updateQuantity(item.id, -1)}>
                          <FaMinus size={10} />
                        </button>
                        <span className="mx-2 fw-bold">{item.quantity}</span>
                        <button className="btn btn-sm btn-light border" onClick={() => updateQuantity(item.id, 1)}>
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <h3 className="mb-4">Your cart is empty 🛍️</h3>
            <button className="btn btn-dark px-5 py-2" onClick={() => navigate("/shop")}>
                Go Shopping Now
            </button>
          </div>
        )}

        {/* --- Total & Coupon Section --- */}
        {cartItems.length > 0 && (
            <div className="row g-4 mt-5">
            <div className="col-md-6">
                <h4 className="fw-bold mb-3">Apply discount coupon</h4>
                <div className="d-flex gap-2">
                <input type="text" className="form-control" placeholder="Enter coupon code" />
                <button className="btn btn-dark">Apply</button>
                </div>
            </div>

            <div className="col-md-6 border p-4 shadow-sm bg-light">
                <h4 className="fw-bold mb-3">Cart Totals</h4>
                <table className="table">
                <tbody>
                    <tr><td>Subtotal</td><td>${subtotal.toFixed(2)}</td></tr>
                    <tr><td>Shipping</td><td>${shipping.toFixed(2)}</td></tr>
                    <tr className="fw-bold border-top fs-5">
                        <td>Total Amount</td>
                        <td className="text-primary">${totalAmount.toFixed(2)}</td>
                    </tr>
                </tbody>
                </table>
                <button className="btn btn-warning w-100 mt-3 fw-bold py-2">
                PROCEED TO CHECKOUT
                </button>
            </div>
            </div>
        )}
      </div>

      {/* --- Footer Section --- */}
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