import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // نستخدم نفس الـ Context
import "../styles/Shop.css"; // سنستخدم نفس التنسيقات للاتساق

const WishlistPage = () => {
  const navigate = useNavigate();
  // نجلب القائمة ووظيفة الحذف والاضافة للكارت من الـ Context
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  return (
    <div className="shop-container">
      <div className="glass-overlay" style={{ minHeight: "100vh", padding: "20px" }}>
        <div className="main-border-frame">
          <header className="navbar">
            <div className="brand-logo" onClick={() => navigate("/shop")} style={{cursor: 'pointer'}}>
              My Wishlist
            </div>
            <button className="btn-view-side" onClick={() => navigate("/shop")}>
              Back to Shop
            </button>
          </header>

          <section className="products-grid" style={{ marginTop: "40px" }}>
            {wishlist && wishlist.length > 0 ? (
              wishlist.map((item) => (
                <div className="product-card" key={item.id}>
                  <div className="product-img-container">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="product-details">
                    <span className="brand-tag">{item.brand}</span>
                    <h4 className="item-name">{item.name}</h4>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < item.rating ? "star yellow" : "star gray"} />
                      ))}
                    </div>
                    <div className="card-footer">
                      <span className="price-text">${item.price}</span>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button 
                          className="add-btn" 
                          style={{ backgroundColor: "#ff4d4d" }} 
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <FaTrash />
                        </button>
                        <button className="add-btn" onClick={() => addToCart(item)}>
                          <FaShoppingCart />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="hero-text-block" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                <h2 className="main-title" style={{ fontSize: "2rem" }}>Your Wishlist is Empty</h2>
                <button className="btn-view-side" onClick={() => navigate("/shop")}>Go Shopping</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;