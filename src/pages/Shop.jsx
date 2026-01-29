import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaStar, FaCartPlus, FaHeart, } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "../styles/Shop.css";
import mainBg from "../assets/lery.jpg"; 
import sideImg1 from "../assets/azza.jpg"; 
import sideImg2 from "../assets/zz.jpg"; 
import sideImg3 from "../assets/aa.jpg"; 
import sideImg4 from "../assets/oo.jpg"; 
import sideImg5 from "../assets/Egyptian woman.jpg"; 
import sideImg6 from "../assets/stat.jpg"; 
import sideImg7 from "../assets/qq.jpg"; 
import sideImg8 from "../assets/azzo.jpg"; 
import sideImg9 from "../assets/download (26).jpg"; 
import sideImg10 from "../assets/download.jpg"; 
import sideImg11 from "../assets/55.jpg"; 
import sideImg12 from "../assets/ff.jpg"; 
import sideImg13 from "../assets/gg.jpg"; 
import sideImg14 from "../assets/qq3.jpg"; 
import sideImg15 from "../assets/aa.jpg"; 

const Shop = () => {
  const navigate = useNavigate();
  const { cart, addToCart, addToWishlist, wishlist } = useCart(); 
  const [activeTab, setActiveTab] = useState("shop");
  
  // حالة التحكم في ظهور الرسالة والنص بداخلها
  const [toast, setToast] = useState({ show: false, message: "" });

  const products = [
    { id: 1, brand: "Azza Fahmy", name: "Necklace", price: 300, rating: 5, image: sideImg1 },
    { id: 2, brand: "Azza Fahmy", name: "Necklace", price: 78, rating: 4, image: sideImg2 },
    { id: 3, brand: "Azza Fahmy", name: "Tales of the nile - Azza Fahmy", price: 78, rating: 5, image: sideImg3 },
    { id: 4, brand: "Azza Fahmy", name: "Necklace", price: 78, rating: 5, image: mainBg },
    { id: 5, brand: "Azza Fahmy", name: "Necklace", price: 300, rating: 5, image: sideImg5 },
    { id: 6, brand: "Azza Fahmy", name: "Earrings", price: 78, rating: 4, image: sideImg6 },
    { id: 7, brand: "Azza Fahmy", name: "Necklace", price: 78, rating: 5, image: sideImg7 },
    { id: 8, brand: "Azza Fahmy", name: "Necklace", price: 78, rating: 5, image: sideImg8 },
    { id: 9, brand: "Azza Fahmy", name: "Necklace", price: 300, rating: 5, image: sideImg9 },
    { id: 10, brand: "Azza Fahmy", name: "Rings", price: 78, rating: 4, image: sideImg10 },
    { id: 11, brand: "Azza Fahmy", name: "Necklace", price: 78, rating: 5, image: sideImg4 },
    { id: 12, brand: "Azza Fahmy", name: "Necklace", price: 78, rating: 5, image: sideImg11 },
    { id: 13, brand: "Azza Fahmy", name: "Bracelets", price: 300, rating: 5, image: sideImg13 },
    { id: 14, brand: "Azza Fahmy", name: "Rings", price: 78, rating: 4, image: sideImg14 },
    { id: 15, brand: "Azza Fahmy", name: "Necklace", price: 78, rating: 5, image: sideImg15 },
    { id: 16, brand: "Azza Fahmy", name: "Necklace", price: 78, rating: 5, image: sideImg12 },
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast({ show: true, message: "ADD SUCCESSFULLY" });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const handleWishlistClick = (product) => {
    if (addToWishlist) {
      addToWishlist(product);
      setToast({ show: true, message: "Done" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    }
  };

  const handleNavClick = (path, tabName) => {
    setActiveTab(tabName);
    navigate(path);
  };

  return (
    <div className="shop-container">
      {/* الرسالة المطلوبة في نصف الشاشة */}
      {toast.show && (
        <div className="toast-overlay">
          <div className="toast-box">{toast.message}</div>
        </div>
      )}

      <div className="background-wrapper">
        <img src={mainBg} alt="Background" className="main-bg-img" />
      </div>

      <div className="glass-overlay">
        <div className="main-border-frame">
          
          <header className="navbar">
            <div className="brand-logo">Dress On Me</div>
            <nav className="nav-links-pill">
                <a href="#!" className={activeTab === "home" ? "nav-item active" : "nav-item"} onClick={() => handleNavClick("/Home", "home")}>Home</a>
                <a href="#!" className={activeTab === "shop" ? "nav-item active" : "nav-item"} onClick={() => handleNavClick("/shop", "shop")}>Shop</a>
                <a href="#!" className={activeTab === "service" ? "nav-item active" : "nav-item"} onClick={() => handleNavClick("/service", "service")}>Service</a>
                <a href="#!" className={activeTab === "contact" ? "nav-item active" : "nav-item"} onClick={() => handleNavClick("/Contact", "contact")}>Contact</a>
                
                <div className="nav-icons-group">
                    <FaUserCircle className="profile-icon" onClick={() => navigate("/profile")} />
                    <div className="cart-wrapper" onClick={() => navigate("/wish")}>
                        <FaHeart className="cart-icon" />
                        {wishlist?.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
                    </div>
                    <div className="cart-wrapper" onClick={() => navigate("/Cart")}>
                        <FaShoppingCart className="cart-icon" />
                        {cart?.length > 0 && <span className="cart-badge">{cart.length}</span>}
                    </div>
                </div>
            </nav>

            <div className="social-media-group">
              <a href="#!"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#!"><i className="fa-brands fa-instagram"></i></a>
              <a href="#!"><i className="fa-brands fa-x-twitter"></i></a>
            </div>
          </header>

          <div className="layout-grid">
            <section className="hero-text-block">
              <h1 className="main-title">delicate <br /> Pieces</h1>
              <div className="description-meta">
                <h3 className="sub-brand">Elegant Pieces</h3>
                <p className="main-para">
                  These jewelry will be an unforgettable gift that will preserve wonderful moments.
                </p>
              </div>
            </section>

            <aside className="visual-side-panel">
              <div className="side-card-large">
                <div className="card-image-wrapper">
                  <img src={sideImg1} alt="exquisite" className="side-main-img" />
                </div>
                <div className="card-content-box">
                  <p>PLUNGE INTO THE WORLD OF EXQUISITE</p>
                  <button className="btn-view-side" onClick={() => navigate("/collection")}>View More</button>
                </div>
              </div>
              <div className="side-gallery-row">
                <div className="gallery-box">
                  <img src={sideImg2} alt="View 1" className="gallery-img-item" />
                </div>
                <div className="gallery-box">
                  <img src={sideImg3} alt="View 2" className="gallery-img-item" />
                </div>
              </div>
            </aside>
          </div>

          <section className="products-grid">
            {products.map((item) => (
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
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button className="wishlist-btn-text" onClick={() => handleWishlistClick(item)}>
                          wish list
                        </button>
                        <button className="add-btn" onClick={() => handleAddToCart(item)}>
                          <FaCartPlus />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

        </div>
      </div>
    </div>
  );
};

export default Shop;