import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaStar, FaCartPlus, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { getPosts } from "../api/api";
import "../styles/Shop.css";

// استيراد كافة الصور المستخدمة في المشروع (للخلفية والصور الجانبية فقط)
import mainBg from "../assets/lery.jpg"; 
import sideImg1 from "../assets/azza.jpg"; 
import sideImg2 from "../assets/zz.jpg"; 
import sideImg3 from "../assets/aa.jpg"; 

const Shop = () => {
  const navigate = useNavigate();
  const { cart, addToCart, addToWishlist, wishlist } = useCart(); 
  const [activeTab, setActiveTab] = useState("shop");
  
  // حالة التحكم في ظهور رسالة التأكيد (Toast)
  const [toast, setToast] = useState({ show: false, message: "" });
  
  // حالة جديدة لتخزين المنتجات من البروفايل
  const [products, setProducts] = useState([]);

  // جلب المنتجات من البوستات عند تحميل الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      const posts = await getPosts();
      // تحويل البوستات لصيغة المنتجات
      const formattedProducts = posts.map(post => ({
        id: post.id,
        brand: post.user || "Seller",
        name: post.text || "Product",
        price: post.price || 0,
        rating: post.rating || 0,
        image: post.files && post.files.length > 0 ? post.files[0] : "https://via.placeholder.com/300",
        files: post.files || [],
        text: post.text
      }));
      setProducts(formattedProducts);
    };
    
    fetchProducts();
  }, []);

  // دالة الإضافة للسلة
  const handleAddToCart = (product) => {
    const formattedProduct = {
      ...product,
      text: product.name,
      files: product.files || [product.image],
      quantity: 1
    };
    addToCart(formattedProduct);
    setToast({ show: true, message: "ADD SUCCESSFULLY" });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  // دالة الإضافة للـ Wishlist الموحدة
  const handleWishlistClick = (product) => {
    const formattedProduct = {
      ...product,
      text: product.name,
      files: product.files || [product.image]
    };
    addToWishlist(formattedProduct);
    setToast({ show: true, message: "Done" });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const handleNavClick = (path, tabName) => {
    setActiveTab(tabName);
    navigate(path);
  };

  return (
    <div className="shop-container">
      {/* رسالة التأكيد (Toast) في منتصف الشاشة */}
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
            <div className="brand-logo" onClick={() => navigate("/home")} style={{cursor: "pointer"}}>Dress On Me</div>
            <nav className="nav-links-pill">
                <span className={activeTab === "home" ? "nav-item active" : "nav-item"} 
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNavClick("/home", "home")}>Home</span>
                
                <span className={activeTab === "shop" ? "nav-item active" : "nav-item"} 
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNavClick("/shop", "shop")}>Shop</span>
                
                <span className={activeTab === "service" ? "nav-item active" : "nav-item"} 
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNavClick("/service", "service")}>Service</span>
                
                <span className={activeTab === "contact" ? "nav-item active" : "nav-item"} 
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNavClick("/contact", "contact")}>Contact</span>
                
                <div className="nav-icons-group">
                    <FaUserCircle className="profile-icon" style={{ cursor: "pointer" }} onClick={() => navigate("/profile")} />
                    <div className="cart-wrapper" style={{ cursor: "pointer" }} onClick={() => navigate("/wish")}>
                        <FaHeart className="cart-icon" />
                        {wishlist?.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
                    </div>
                    <div className="cart-wrapper" style={{ cursor: "pointer" }} onClick={() => navigate("/cart")}>
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
            {products.length > 0 ? (
              products.map((item) => (
                <div 
                  className="product-card" 
                  key={item.id}
                  onClick={() => navigate("/profile", { state: { scrollToPostId: item.id } })}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-img-container" style={{ backgroundColor: "#f9f9f9", overflow: "hidden" }}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain"
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300?text=No+Image";
                      }}
                    />
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
                          <button 
                            className="wishlist-btn-text" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWishlistClick(item);
                            }}
                          >
                            wish list
                          </button>
                          <button 
                            className="add-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                          >
                            <FaCartPlus />
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px" }}>
                <h3>No products available yet</h3>
                <p>Check back later for new items!</p>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default Shop;