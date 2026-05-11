import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaStar, FaCartPlus, FaHeart, FaSearch } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { getPosts } from "../api/api";
import Fuse from "fuse.js";
import "../styles/Shop.css";

// استيراد كافة الصور المستخدمة في المشروع
import mainBg from "../assets/lery.jpg"; 
import sideImg1 from "../assets/azza.jpg"; 
import sideImg2 from "../assets/zz.jpg"; 
import sideImg3 from "../assets/aa.jpg"; 

const Shop = () => {
  const navigate = useNavigate();
  const { cart, addToCart, addToWishlist, wishlist } = useCart(); 
  const [activeTab, setActiveTab] = useState("shop");
  
  const [toast, setToast] = useState({ show: false, message: "" });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // جلب المنتجات وإضافة تصنيفات تلقائية (Tags)
  useEffect(() => {
    const fetchProducts = async () => {
      const posts = await getPosts();
      const formattedProducts = posts.map(post => {
        // تحويل النص لـ Lowercase لسهولة المقارنة
        const description = (post.text || "").toLowerCase();
        
        // منطق التصنيف التلقائي بناءً على الكلمات المفتاحية
        let tags = [];
        if (description.includes("bag") || description.includes("شنطة") || description.includes("leather") || description.includes("clutch")) {
          tags.push("bags");
        }
        if (description.includes("dress") || description.includes("فستان") || description.includes("silk") || description.includes("gown")) {
          tags.push("dresses");
        }
        if (description.includes("accessory") || description.includes("jewelry") || description.includes("ring") || description.includes("necklace")) {
          tags.push("accessories");
        }
        if (description.includes("shoes") || description.includes("شوز") || description.includes("heels")) {
          tags.push("shoes");
        }

        return {
          id: post.id,
          brand: post.user || "Seller",
          name: post.text || "Product",
          price: post.price || 0,
          rating: post.rating || 0,
          image: post.files && post.files.length > 0 ? post.files[0] : "https://via.placeholder.com/300",
          files: post.files || [],
          text: post.text,
          tags: tags // إضافة التاجات للمنتج
        };
      });
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    };
    
    fetchProducts();
  }, []);

  // تنفيذ البحث الذكي (Fuzzy Search + Categorization)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const fuse = new Fuse(products, {
      keys: [
        { name: "tags", weight: 0.8 }, // الأولوية القصوى للتصنيف (مثل bags)
        { name: "name", weight: 0.5 },
        { name: "brand", weight: 0.3 },
        { name: "text", weight: 0.2 }
      ],
      threshold: 0.4, // توازن بين الدقة والمرونة
      distance: 100,
    });

    const results = fuse.search(searchTerm);
    setFilteredProducts(results.map(result => result.item));
  }, [searchTerm, products]);

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

          {/* شريط البحث المصمم ليناسب Glass Overlay */}
          <div className="search-section" style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
              <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }} />
              <input 
                type="text" 
                placeholder="Search by product name or category (e.g., bags, dresses)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 50px',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <section className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
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
                <h3>No products found for "{searchTerm}"</h3>
                <p>Try searching for categories like bags, dresses, or accessories.</p>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default Shop;