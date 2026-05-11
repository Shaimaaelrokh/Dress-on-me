import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Post from "./Post";
import { getPosts, addPost, updatePostInAPI, deletePost as deletePostAPI } from "../api/api";
import { useCart } from "../context/CartContext"; 
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import dressBanner from "../assets/dress-on-me-banner.jpeg";

// ✅ قائمة الكاتيجوريز
const CATEGORY_GROUPS = {
  "👗 Women's Clothing": ["Casual Blouse","Cotton Blouses","Chiffon Blouses","Lace Blouses","Soiree Blouse","Classic Pants (Women)","Formal Pants (Women)","Soiree Pants","Skinny Jeans (Women)","Wide Leg Jeans","Casual T-Shirt (Women)","Classic T-Shirt (Women)","Formal Shirt (Women)","Semi-Formal Blazer","Formal Blazer","Classic Skirt","Mini Skirt","Formal Skirt","Basic Tops (Women)"],
  "👠 Women's Shoes": ["Sneakers (Women)","Heels","Sandals (Women)","Slippers"],
  "💍 Women's Accessories": ["Hijab Scarf","Socks","Earrings","Necklace","Rings","Bracelets","Sunglasses (Women)"],
  "👔 Men's Clothing": ["Classic Pants (Men)","Men's Jeans","Sports Pants (Men)","Casual T-Shirt (Men)","Classic T-Shirt (Men)","Formal Pants (Men)","Formal Shirt (Men)","Basic Tops (Men)"],
  "👟 Men's Shoes": ["Sneakers (Men)","Classic Shoes (Men)","Sandals (Men)"],
  "🕶️ Men's Accessories": ["Sunglasses (Men)"],
  "💄 Beauty & Cosmetics": ["Skincare","Makeup","Beauty & Cosmetics","Perfumes & Fragrances"],
};

const GROUP_COLORS = {
  "👗 Women's Clothing": "#e91e8c",
  "👠 Women's Shoes": "#9c27b0",
  "💍 Women's Accessories": "#f59e0b",
  "👔 Men's Clothing": "#1976d2",
  "👟 Men's Shoes": "#0288d1",
  "🕶️ Men's Accessories": "#455a64",
  "💄 Beauty & Cosmetics": "#e91e63",
};

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { removeFromCart, removeFromWishlist } = useCart(); 

  const [username, setUsername] = useState(localStorage.getItem("u_name") || "shaimaa elrokh");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("u_img") || null);
  const [coverImage, setCoverImage] = useState(localStorage.getItem("u_cover") || null);
  const [userRole, setUserRole] = useState(localStorage.getItem("u_role") || "seller");

  // ── Brand Info (seller only) ──
  const rawBrand = localStorage.getItem("u_brand");
  const [brandData] = useState(rawBrand ? JSON.parse(rawBrand) : null);
  
  const [posts, setPosts] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPrice, setNewPrice] = useState(""); // تعديل: أصبح يقبل نصوص مثل 200-300
  const [availableColors, setAvailableColors] = useState(""); // إضافة: حقل الألوان الجديد
  const [darkMode, setDarkMode] = useState(false);
  const [tempName, setTempName] = useState(username);

  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

  // ✅ الإضافات الجديدة المطلوبة (البيانات الإضافية للبوست)
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedShoeSizes, setSelectedShoeSizes] = useState([]); // جدول مقاسات الجزم
  const [fabricFocusFiles, setFabricFocusFiles] = useState([]); 
  const [sizeGuide, setSizeGuide] = useState({}); 
  const [shoeSizeGuide, setShoeSizeGuide] = useState({}); // جايد مقاسات الجزم
  const [fabricType, setFabricType] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [imageCategories, setImageCategories] = useState([]); // كاتيجوري لكل صورة
  const [activeCategoryGroup, setActiveCategoryGroup] = useState([]); // الجروب المفتوح لكل صورة

  // ✅ State للرسائل السوداء
  const [messageModal, setMessageModal] = useState({ show: false, text: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, text: "", onConfirm: null });

  // ✅ Refs للبوستات عشان نعمل scroll
  const postRefs = useRef({});

  const showMessage = (text) => {
    setMessageModal({ show: true, text });
    setTimeout(() => setMessageModal({ show: false, text: "" }), 2000);
  };

  const showConfirm = (text, onConfirm) => {
    setConfirmModal({ show: true, text, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    setConfirmModal({ show: false, text: "", onConfirm: null });
  };

  const handleCancel = () => {
    setConfirmModal({ show: false, text: "", onConfirm: null });
  };

  useEffect(() => { fetchPosts(); }, []);

  // ✅ Scroll للبوست المطلوب لما نيجي من Shop
  useEffect(() => {
    if (location.state?.scrollToPostId && posts.length > 0) {
      const postId = location.state.scrollToPostId;
      setTimeout(() => {
        if (postRefs.current[postId]) {
          postRefs.current[postId].scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
          });
          // إضافة highlight للبوست
          postRefs.current[postId].style.transition = "all 0.3s";
          postRefs.current[postId].style.boxShadow = "0 0 20px rgba(255, 193, 7, 0.8)";
          setTimeout(() => {
            if (postRefs.current[postId]) {
              postRefs.current[postId].style.boxShadow = "";
            }
          }, 2000);
        }
      }, 500);
      // مسح الـ state بعد الاستخدام
      window.history.replaceState({}, document.title);
    }
  }, [location.state, posts]);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data || []);
  };

  const handleUpdatePost = async (postId, updatedData) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updatedData } : p));
    await updatePostInAPI(postId, updatedData);
  };

  // دالة لتحويل File إلى base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProfileImage = async (e) => {
    if (e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setProfileImage(base64);
        localStorage.setItem("u_img", base64);
      } catch (error) {
        console.error("Error converting image:", error);
        showMessage("Error uploading image");
      }
    }
  };

  const handleCoverImage = async (e) => {
    if (e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setCoverImage(base64);
        localStorage.setItem("u_cover", base64);
      } catch (error) {
        console.error("Error converting cover:", error);
        showMessage("Error uploading cover image");
      }
    }
  };

  const handleEdit = (post) => {
    setIsEditing(true);
    setEditPostId(post.id);
    setNewPostText(post.text);
    setNewPrice(post.price || "");
    setAvailableColors(post.availableColors || "");
    // إرجاع البيانات الجديدة للمودال عند التعديل
    setSelectedSizes(post.sizes || []);
    setSelectedShoeSizes(post.shoeSizes || []);
    setFabricType(post.fabricType || "");
    setCareInstructions(post.careInstructions || "");
    setSizeGuide(post.sizeGuide || {});
    setShoeSizeGuide(post.shoeSizeGuide || {});
    setNewFiles([]);
    setFabricFocusFiles([]);
    setImageCategories(post.imageCategories || []);
    setActiveCategoryGroup((post.imageCategories || []).map(() => null));
    const modal = new bootstrap.Modal(document.getElementById('postModal'));
    modal.show();
  };

  // دالة اختيار المقاسات
  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // دالة اختيار مقاسات الجزم
  const toggleShoeSize = (size) => {
    setSelectedShoeSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleAddPost = async () => {
    // ✅ التأكد من وجود نص أو صور
    if (!newPostText && newFiles.length === 0) {
      showMessage("Please add product description or images!");
      return;
    }

    // ✅ التعديل المطلوب: منع الرفع بدون سعر
    if (!newPrice || newPrice.trim() === "") {
      showMessage("You forgot to add the product price!");
      return;
    }

    // تحويل كل الصور لـ base64 (الأساسية وصور القماش)
    let base64Files = [];
    let base64FabricFocus = [];
    try {
      if (newFiles.length > 0) {
        base64Files = await Promise.all(newFiles.map(file => fileToBase64(file)));
      }
      if (fabricFocusFiles.length > 0) {
        base64FabricFocus = await Promise.all(fabricFocusFiles.map(file => fileToBase64(file)));
      }
    } catch (error) {
      console.error("Error converting files:", error);
      showMessage("Error uploading images");
      return;
    }

    if (isEditing) {
      const updatedData = { 
        text: newPostText, 
        price: newPrice,
        availableColors: availableColors,
        files: base64Files.length > 0 ? base64Files : posts.find(p => p.id === editPostId).files,
        sizes: selectedSizes,
        shoeSizes: selectedShoeSizes,
        fabricFocus: base64FabricFocus.length > 0 ? base64FabricFocus : posts.find(p => p.id === editPostId).fabricFocus,
        sizeGuide,
        shoeSizeGuide,
        fabricType,
        careInstructions,
        categories: [...new Set(imageCategories.filter(Boolean))],
        imageCategories,
      };
      handleUpdatePost(editPostId, updatedData);
      setIsEditing(false);
      setEditPostId(null);
    } else {
      const post = {
        id: Date.now(),
        user: username,
        userImage: profileImage,
        text: newPostText,
        price: newPrice, // السعر النصي
        availableColors: availableColors, // الألوان المتاحة
        files: base64Files,
        // إضافة الحقول الجديدة للبوست
        sizes: selectedSizes,
        shoeSizes: selectedShoeSizes,
        fabricFocus: base64FabricFocus,
        sizeGuide,
        shoeSizeGuide,
        fabricType,
        careInstructions,
        categories: [...new Set(imageCategories.filter(Boolean))],
        imageCategories,
        likes: 0,
        dislikes: 0,
        inCart: 0,
        sales: 0,
        rating: 0,
        comments: [],
      };
      await addPost(post);
      setPosts([post, ...posts]);
    }
    // تفريغ كافة الحقول بعد الرفع
    setNewPostText(""); 
    setNewPrice("");
    setAvailableColors("");
    setNewFiles([]);
    setSelectedSizes([]);
    setSelectedShoeSizes([]);
    setFabricFocusFiles([]);
    setSizeGuide({});
    setShoeSizeGuide({});
    setFabricType("");
    setCareInstructions("");
    setImageCategories([]);
    setActiveCategoryGroup([]);
    
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('postModal'));
    if (modalInstance) modalInstance.hide();
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.style.overflow = 'auto';
    showMessage("Product Posted Successfully!");
  };

  const deletePost = async (id) => {
    showConfirm("Are you sure you want to delete this product?", async () => {
      await deletePostAPI(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      
      // ✅ التعديل الجديد: الحذف من السلة والمفضلة عند مسح البوست
      removeFromCart(id);
      removeFromWishlist(id);
      
      showMessage("Product deleted successfully");
    });
  };

  return (
    <div style={{ backgroundColor: darkMode ? "#121212" : "#f0f2f5", minHeight: "100vh", color: darkMode ? "#fff" : "#000", transition: "0.3s" }}>
      
      {/* ══════════════════════════════════
          ── Profile Header ──
      ══════════════════════════════════ */}

      {/* ── البانر: عرض الصفحة كاملاً ── */}
      <div style={{ position: "relative", width: "100%", background: "#0d0500", lineHeight: 0 }}>
        <img
          src={coverImage || dressBanner}
          alt="Cover"
          style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "center", maxHeight: "280px" }}
        />

        {/* كل الأزرار في اليمين فقط */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "14px 24px",
          display: "flex", justifyContent: "flex-end", alignItems: "flex-start", gap: "10px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}>
          <button onClick={() => navigate("/home")} title="Home" style={{
            background: "rgba(255,255,255,0.13)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(10px)",
            borderRadius: "999px", padding: "11px 20px", fontWeight: 600,
            fontSize: "0.82rem", cursor: "pointer",
          }}>🏠 Home</button>
          <button onClick={() => navigate("/shop")} title="Shop" style={{
            background: "rgba(255,255,255,0.13)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(10px)",
            borderRadius: "999px", padding: "11px 20px", fontWeight: 600,
            fontSize: "0.82rem", cursor: "pointer",
          }}>🛍️ Shop</button>
          <div style={{
            display: "flex", gap: "12px", alignItems: "center",
            background: "rgba(255,255,255,0.13)", border: "1px solid rgba(255,255,255,0.22)",
            backdropFilter: "blur(10px)", borderRadius: "999px", padding: "11px 20px",
          }}>
            <span style={{ cursor: "pointer", fontSize: "1.1rem" }} title="Wishlist" onClick={() => navigate("/wish")}>❤️</span>
            <span style={{ cursor: "pointer", fontSize: "1.1rem" }} title="Cart" onClick={() => navigate("/cart")}>🛒</span>
          </div>
        </div>
      </div>

      {/* ── Wrapper: الصورة + الشريط الأبيض ── */}
      <div style={{ position: "relative" }}>

        {/* الصورة الشخصية — top سالب عشان ربعها يطلع فوق على البانر بس الكل يظهر */}
        <div style={{
          position: "absolute",
          top: "-20px",
          left: "48px",
          zIndex: 1200,
        }}>
          <img
            src={profileImage || "https://via.placeholder.com/150"}
            alt="profile"
            style={{
              width: 160, height: 160,
              borderRadius: "50%",
              objectFit: "cover",
              border: "5px solid #fff",
              boxShadow: "0 6px 28px rgba(0,0,0,0.3)",
              backgroundColor: "#fff",
              display: "block",
            }}
          />
        </div>

      {/* ── شريط المعلومات والأزرار ── */}
      <div style={{
        width: "100%",
        backgroundColor: darkMode ? "#1e1e1e" : "#fff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.09)",
        paddingTop: "14px",
        paddingBottom: "18px",
        paddingLeft: "230px",
        paddingRight: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px",
        minHeight: "120px",
        position: "relative",
        zIndex: 1100,
      }}>

        {/* الاسم + Seller */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h2 style={{
              margin: 0, fontWeight: 800, fontSize: "1.55rem",
              color: darkMode ? "#f1f1f1" : "#111",
              letterSpacing: "-0.3px",
            }}>{username}</h2>
            {userRole === "seller" && (
              <span style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#fff", fontWeight: 700,
                fontSize: "0.72rem", letterSpacing: "0.5px",
                padding: "3px 12px", borderRadius: "999px",
                boxShadow: "0 2px 8px rgba(245,158,11,0.35)",
                textTransform: "uppercase",
              }}>✦ Seller</span>
            )}
          </div>
        </div>

        {/* الأزرار الأيقونية */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>

          {/* Edit Profile */}
          <div className="dropdown">
            <button data-bs-toggle="dropdown" title="Edit Profile" style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: darkMode ? "#2a2a2a" : "#f4f4f4",
              color: darkMode ? "#eee" : "#222",
              border: darkMode ? "1px solid #3a3a3a" : "1px solid #ddd",
              borderRadius: "12px", padding: "9px 18px",
              fontWeight: 600, fontSize: "0.83rem", cursor: "pointer",
              transition: "all 0.2s",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </button>
            <ul className="dropdown-menu shadow border-0" style={{ borderRadius: "14px", overflow: "hidden", minWidth: "200px", zIndex: 9999 }}>
              <li><label className="dropdown-item py-2" style={{ cursor: "pointer", fontWeight: 500 }}>
                📸 Change Photo <input type="file" accept="image/*" hidden onChange={handleProfileImage}/>
              </label></li>
              <li><label className="dropdown-item py-2" style={{ cursor: "pointer", fontWeight: 500 }}>
                🖼️ Change Cover <input type="file" accept="image/*" hidden onChange={handleCoverImage}/>
              </label></li>
              <li><button className="dropdown-item py-2" style={{ fontWeight: 500 }} data-bs-target="#nameModal" data-bs-toggle="modal">
                ✏️ Change Name
              </button></li>
            </ul>
          </div>

          {/* Settings */}
          <div className="dropdown">
            <button data-bs-toggle="dropdown" title="Settings" style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: darkMode ? "#2a2a2a" : "#f4f4f4",
              color: darkMode ? "#eee" : "#222",
              border: darkMode ? "1px solid #3a3a3a" : "1px solid #ddd",
              borderRadius: "12px", padding: "9px 18px",
              fontWeight: 600, fontSize: "0.83rem", cursor: "pointer",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Settings
            </button>
            <ul className="dropdown-menu shadow border-0 p-2" style={{ borderRadius: "14px", minWidth: "180px", textAlign: "center", zIndex: 9999 }}>
              <li><button className="btn btn-sm btn-light w-100 mb-1 fw-bold rounded-pill" onClick={() => setDarkMode(false)}>☀️ Light Mode</button></li>
              <li><button className="btn btn-sm btn-dark w-100 fw-bold rounded-pill" onClick={() => setDarkMode(true)}>🌙 Dark Mode</button></li>
            </ul>
          </div>

          {/* Create Product */}
          {userRole === "seller" && (
            <button
              onClick={() => { setIsEditing(false); setNewPostText(""); setNewPrice(""); setAvailableColors(""); setNewFiles([]); setFabricFocusFiles([]); }}
              data-bs-target="#postModal" data-bs-toggle="modal"
              title="Create Product"
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                border: "none",
                borderRadius: "12px", padding: "9px 20px",
                fontWeight: 700, fontSize: "0.83rem", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Product
            </button>
          )}
        </div>
      </div>{/* end info bar */}
      </div>{/* end wrapper */}

      <div className="container" style={{ maxWidth: userRole === "seller" ? "1400px" : "1000px", marginTop: "28px" }}>
        <div className="row">
          <div className={userRole === "seller" ? "col-lg-7" : "col-12"}>
            {posts.map(p => (
              <div 
                key={p.id} 
                ref={(el) => postRefs.current[p.id] = el}
              >
                <Post 
                  post={p} darkMode={darkMode} currentUserImage={profileImage} 
                  onDelete={() => deletePost(p.id)} onEdit={() => handleEdit(p)} 
                  isSeller={userRole === "seller"}
                  onUpdatePost={handleUpdatePost} 
                />
              </div>
            ))}
          </div>

          {userRole === "seller" && (
            <div className="col-lg-5">
              <div className={`card border-0 shadow rounded-4 sticky-top overflow-hidden ${darkMode ? "bg-dark text-white" : "bg-white"}`} style={{ top: "20px" }}>

                {/* ══════════════════════════════════
                    ── Brand Identity Card ──
                ══════════════════════════════════ */}
                {brandData && (
                  <div style={{
                    background: darkMode
                      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                      : "linear-gradient(135deg, #fdfbff 0%, #f3eeff 100%)",
                    borderBottom: darkMode ? "1px solid #2a2a3e" : "1px solid #e8e0f8",
                    padding: "22px 24px 18px",
                  }}>

                    {/* Brand Header row */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      {/* Brand logo placeholder */}
                      <div style={{
                        width: 54, height: 54, borderRadius: "14px", flexShrink: 0,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.5rem", boxShadow: "0 4px 14px rgba(118,75,162,0.35)",
                      }}>
                        🏷️
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.2px",
                          color: darkMode ? "#e2e8f0" : "#1e1b2e",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {brandData.brandName || username}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: darkMode ? "#a78bfa" : "#7c3aed", fontWeight: 600 }}>
                          Official Brand Account
                        </div>
                      </div>

                      {/* Verified badge */}
                      <div className="ms-auto" style={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        borderRadius: "20px", padding: "3px 10px",
                        fontSize: "0.65rem", fontWeight: 700, color: "#fff",
                        letterSpacing: "0.3px", whiteSpace: "nowrap",
                        boxShadow: "0 2px 8px rgba(118,75,162,0.3)",
                      }}>
                        ✓ Verified
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(118,75,162,0.12)", marginBottom: 14 }} />

                    {/* Info rows */}
                    <div className="d-flex flex-column gap-2" style={{ fontSize: "0.82rem" }}>

                      {brandData.brandYear && (
                        <div className="d-flex align-items-center gap-2">
                          <span style={{
                            width: 28, height: 28, borderRadius: "8px", flexShrink: 0,
                            background: darkMode ? "#2a2a3e" : "#ede9fe",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.9rem",
                          }}>📅</span>
                          <div>
                            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: darkMode ? "#888" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Founded</div>
                            <div style={{ fontWeight: 700, color: darkMode ? "#e2e8f0" : "#1e293b" }}>{brandData.brandYear}</div>
                          </div>
                        </div>
                      )}

                      {brandData.taxNumber && (
                        <div className="d-flex align-items-center gap-2">
                          <span style={{
                            width: 28, height: 28, borderRadius: "8px", flexShrink: 0,
                            background: darkMode ? "#2a2a3e" : "#ede9fe",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.9rem",
                          }}>🧾</span>
                          <div>
                            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: darkMode ? "#888" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tax Reg. No.</div>
                            <div style={{ fontWeight: 600, color: darkMode ? "#e2e8f0" : "#1e293b", fontFamily: "monospace", fontSize: "0.85rem" }}>{brandData.taxNumber}</div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Brand Intro */}
                    {brandData.brandIntro && (
                      <div style={{
                        marginTop: 14,
                        background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(118,75,162,0.06)",
                        border: darkMode ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(118,75,162,0.15)",
                        borderRadius: 12,
                        padding: "12px 14px",
                        position: "relative",
                      }}>
                        {/* quote icon */}
                        <div style={{
                          position: "absolute", top: -8, left: 14,
                          background: darkMode ? "#1a1a2e" : "#f3eeff",
                          padding: "0 6px",
                          fontSize: "0.75rem", color: "#764ba2", fontWeight: 800,
                        }}>❝</div>
                        <p style={{
                          margin: 0, fontSize: "0.8rem", lineHeight: 1.65,
                          color: darkMode ? "#c4b5fd" : "#4c1d95",
                          fontStyle: "italic",
                        }}>
                          {brandData.brandIntro}
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* ── Header Gradient ── */}
                <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px 24px 16px" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="fw-bold mb-0 text-white">📊 Business Analytics</h5>
                      <p className="mb-0" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.78rem" }}>
                        {posts.length} product{posts.length !== 1 ? "s" : ""} listed
                      </p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "8px 14px", backdropFilter: "blur(8px)" }}>
                      <span style={{ fontSize: "1.5rem" }}>🏪</span>
                    </div>
                  </div>
                </div>

                {/* ── Summary Stat Cards ── */}
                <div className="d-flex gap-2 p-3 flex-wrap" style={{ background: darkMode ? "#1a1a2e" : "#f5f3ff" }}>
                  {[
                    { label: "Likes",    value: posts.reduce((s,p) => s + (p.likes    || 0), 0), color: "#22c55e", icon: "👍" },
                    { label: "In Cart",  value: posts.reduce((s,p) => s + (p.inCart   || 0), 0), color: "#3b82f6", icon: "🛒" },
                    { label: "Sales",    value: posts.reduce((s,p) => s + (p.sales    || 0), 0), color: "#f59e0b", icon: "💰" },
                    { label: "Comments", value: posts.reduce((s,p) => s + (p.comments?.length || 0), 0), color: "#8b5cf6", icon: "💬" },
                    { label: "Replies",  value: posts.reduce((s,p) => s + (p.comments?.reduce((rs,c) => rs + (c.replies?.length || 0), 0) || 0), 0), color: "#06b6d4", icon: "↩️" },
                  ].map(stat => (
                    <div key={stat.label} className="flex-fill text-center rounded-3 py-2 px-1"
                      style={{ background: darkMode ? "#242536" : "#fff", border: `1px solid ${stat.color}30`, minWidth: "58px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                      <div style={{ fontSize: "1rem", lineHeight: 1.2 }}>{stat.icon}</div>
                      <div className="fw-bold" style={{ color: stat.color, fontSize: "1.15rem", lineHeight: 1.1 }}>{stat.value}</div>
                      <div style={{ color: darkMode ? "#aaa" : "#94a3b8", fontSize: "0.62rem", fontWeight: 500 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* ── Products Table ── */}
                <div className="px-3 pb-3">
                  <div className="table-responsive" style={{ maxHeight: "420px", overflowY: "auto" }}>
                    <table className={`table table-borderless align-middle mb-0 ${darkMode ? "table-dark" : ""}`} style={{ fontSize: "0.78rem" }}>
                      <thead className="sticky-top" style={{ background: darkMode ? "#242526" : "#fff", zIndex: 1 }}>
                        <tr style={{ borderBottom: `2px solid ${darkMode ? "#3a3a50" : "#e2e8f0"}` }}>
                          <th className="fw-semibold pb-2" style={{ color: darkMode ? "#aaa" : "#64748b", fontSize: "0.72rem" }}>Product</th>
                          <th className="fw-semibold pb-2" style={{ color: darkMode ? "#aaa" : "#64748b", fontSize: "0.72rem" }}>Category</th>
                          <th className="fw-semibold pb-2 text-center" style={{ color: "#22c55e", fontSize: "0.72rem" }}>👍</th>
                          <th className="fw-semibold pb-2 text-center" style={{ color: "#ef4444", fontSize: "0.72rem" }}>👎</th>
                          <th className="fw-semibold pb-2 text-center" style={{ color: "#3b82f6", fontSize: "0.72rem" }}>🛒</th>
                          <th className="fw-semibold pb-2 text-center" style={{ color: "#f59e0b", fontSize: "0.72rem" }}>💰</th>
                          <th className="fw-semibold pb-2 text-center" style={{ color: "#f59e0b", fontSize: "0.72rem" }}>⭐</th>
                          <th className="fw-semibold pb-2 text-center" style={{ color: darkMode ? "#aaa" : "#64748b", fontSize: "0.72rem" }}>💬</th>
                          <th className="fw-semibold pb-2 text-center" style={{ color: "#06b6d4", fontSize: "0.72rem" }}>↩️</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map(p => {
                          const totalVotes = (p.likes || 0) + (p.dislikes || 0);
                          const likeRatio = totalVotes > 0 ? Math.round(((p.likes || 0) / totalVotes) * 100) : null;
                          return (
                            <tr key={p.id}
                              style={{ borderBottom: `1px solid ${darkMode ? "#2a2a3e" : "#f1f5f9"}`, transition: "background 0.15s", cursor: "default" }}
                              onMouseEnter={e => e.currentTarget.style.background = darkMode ? "#1a1a2e" : "#f8f7ff"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                              {/* Product name + like ratio bar */}
                              <td style={{ maxWidth: "85px" }}>
                                <div className="fw-bold text-truncate" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                                  {p.text || "Product"}
                                </div>
                                {likeRatio !== null && (
                                  <div style={{ marginTop: "3px", height: "3px", borderRadius: "99px", background: darkMode ? "#333" : "#e2e8f0", overflow: "hidden" }}>
                                    <div style={{ width: `${likeRatio}%`, height: "100%", background: likeRatio >= 70 ? "#22c55e" : likeRatio >= 40 ? "#f59e0b" : "#ef4444", borderRadius: "99px", transition: "width 0.4s" }} />
                                  </div>
                                )}
                              </td>

                              {/* Category badge */}
                              <td style={{ minWidth: "80px" }}>
                                {p.categories && p.categories.length > 0 ? (
                                  <div className="d-flex flex-column gap-1">
                                    {p.categories.slice(0, 1).map((cat, i) => {
                                      const grp = Object.keys(CATEGORY_GROUPS).find(g => CATEGORY_GROUPS[g].includes(cat));
                                      const color = grp ? GROUP_COLORS[grp] : "#6c757d";
                                      return (
                                        <span key={i} className="badge rounded-pill px-2" style={{ background: color + "18", color, border: `1px solid ${color}44`, fontSize: "0.6rem", fontWeight: 600 }}>
                                          {cat}
                                        </span>
                                      );
                                    })}
                                    {p.categories.length > 1 && (
                                      <span style={{ color: darkMode ? "#777" : "#94a3b8", fontSize: "0.6rem" }}>+{p.categories.length - 1} more</span>
                                    )}
                                  </div>
                                ) : <span style={{ color: "#94a3b8" }}>—</span>}
                              </td>

                              {/* Metrics */}
                              <td className="text-center">
                                <span className="badge rounded-pill" style={{ background: "#22c55e18", color: "#22c55e", fontSize: "0.72rem", padding: "3px 7px" }}>{p.likes || 0}</span>
                              </td>
                              <td className="text-center">
                                <span className="badge rounded-pill" style={{ background: "#ef444418", color: "#ef4444", fontSize: "0.72rem", padding: "3px 7px" }}>{p.dislikes || 0}</span>
                              </td>
                              <td className="text-center">
                                <span className="badge rounded-pill" style={{ background: "#3b82f618", color: "#3b82f6", fontSize: "0.72rem", padding: "3px 7px" }}>{p.inCart || 0}</span>
                              </td>
                              <td className="text-center fw-bold" style={{ color: "#f59e0b" }}>{p.sales || 0}</td>
                              <td className="text-center">
                                <span style={{ color: "#f59e0b", fontSize: "0.72rem", fontWeight: 600 }}>
                                  {p.rating ? `⭐${p.rating}` : "—"}
                                </span>
                              </td>
                              <td className="text-center" style={{ color: darkMode ? "#aaa" : "#64748b" }}>{p.comments?.length || 0}</td>
                              <td className="text-center">
                                <span className="badge rounded-pill" style={{ background: "#06b6d418", color: "#06b6d4", fontSize: "0.72rem", padding: "3px 7px" }}>
                                  {p.comments?.reduce((sum, c) => sum + (c.replies?.length || 0), 0) || 0}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Name */}
            <div
  className="modal fade"
  id="nameModal"
  tabIndex="-1"
  style={{ zIndex: 99999 }}
>
  <div
    className="modal-dialog modal-dialog-centered"
    style={{ zIndex: 99999 }}
  >
          <div className={`modal-content border-0 rounded-4 ${darkMode ? "bg-dark text-white" : ""}`}>
            <div className="modal-header border-0 pb-0"><h5 className="modal-title fw-bold">Update Name</h5><button type="button" className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body py-4"><input type="text" className="form-control rounded-pill px-3" value={tempName} onChange={(e) => setTempName(e.target.value)} /></div>
            <div className="modal-footer border-0 pt-0"><button className="btn btn-primary w-100 rounded-pill fw-bold" onClick={() => {setUsername(tempName); localStorage.setItem("u_name", tempName);}} data-bs-dismiss="modal">Save</button></div>
          </div>
        </div>
      </div>

      {/* ✅ Modal Post المحدث */}
         <div 
           className="modal fade" 
           id="postModal" 
           tabIndex="-1"
           style={{ zIndex: 99999 }}
                >
           <div 
             className="modal-dialog modal-dialog-centered modal-lg"
             style={{ zIndex: 99999 }}
                  >
          <div className={`modal-content border-0 rounded-4 shadow ${darkMode ? "bg-dark text-white" : ""}`}>
            <div className="modal-header border-0 pb-0"><h5 className="modal-title fw-bold">{isEditing ? "Edit Product" : "New Product"}</h5><button type="button" className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body py-4" style={{maxHeight: '75vh', overflowY: 'auto'}}>
              <textarea 
                className={`form-control border-0 rounded-4 mb-3 ${darkMode ? "bg-secondary text-white" : "bg-light"}`} 
                rows="3" 
                placeholder="Product details..." 
                value={newPostText} 
                onChange={(e) => setNewPostText(e.target.value)} 
              />
              
              <div className="row mb-3">
                <div className="col-md-4">
                   <label className="small fw-bold mb-1">Price (e.g. 200 or 200-300)</label>
                   <input type="text" className="form-control rounded-pill px-3 shadow-sm" placeholder="Product Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                </div>
                <div className="col-md-8">
                   <label className="small fw-bold mb-1">Available Colors (Comma separated)</label>
                   <input type="text" className="form-control rounded-pill px-3 shadow-sm" placeholder="e.g. Red, Blue, Black" value={availableColors} onChange={(e) => setAvailableColors(e.target.value)} />
                </div>
              </div>

              {/* 👕 جدول مقاسات الملابس */}
              <div className="mb-3">
                <label className="small fw-bold mb-2 d-block">Clothes Sizes (Select multiple)</label>
                <div className="d-flex gap-2 flex-wrap">
                  {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(size => (
                    <button 
                      key={size} 
                      type="button" 
                      className={`btn btn-sm rounded-pill px-3 ${selectedSizes.includes(size) ? 'btn-primary shadow' : 'btn-outline-secondary'}`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {selectedSizes.length > 0 && (
                <div className="mb-3 p-3 rounded-4 border shadow-sm bg-light text-dark">
                  <label className="small fw-bold mb-2 d-block">Clothes Size Guide (Weight kg)</label>
                  <div className="row g-2">
                    {selectedSizes.map(size => (
                      <div key={size} className="col-4">
                        <small className="d-block text-muted">{size}:</small>
                        <input 
                          type="text" 
                          className="form-control form-control-sm border-0 shadow-sm rounded-pill px-2" 
                          placeholder="e.g. 60-70" 
                          value={sizeGuide[size] || ""} 
                          onChange={(e) => setSizeGuide({...sizeGuide, [size]: e.target.value})} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 👞 جدول مقاسات الأحذية */}
              <div className="mb-3">
                <label className="small fw-bold mb-2 d-block">Shoe Sizes (35 to 43)</label>
                <div className="d-flex gap-2 flex-wrap">
                  {['35', '36', '37', '38', '39', '40', '41', '42', '43'].map(size => (
                    <button 
                      key={size} 
                      type="button" 
                      className={`btn btn-sm rounded-pill px-3 ${selectedShoeSizes.includes(size) ? 'btn-success text-white shadow' : 'btn-outline-secondary'}`}
                      onClick={() => toggleShoeSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {selectedShoeSizes.length > 0 && (
                <div className="mb-3 p-3 rounded-4 border shadow-sm bg-light text-dark">
                  <label className="small fw-bold mb-2 d-block">Shoe Size Guide (Details)</label>
                  <div className="row g-2">
                    {selectedShoeSizes.map(size => (
                      <div key={size} className="col-4">
                        <small className="d-block text-muted">{size}:</small>
                        <input 
                          type="text" 
                          className="form-control form-control-sm border-0 shadow-sm rounded-pill px-2" 
                          placeholder="e.g. Fits wide feet" 
                          value={shoeSizeGuide[size] || ""} 
                          onChange={(e) => setShoeSizeGuide({...shoeSizeGuide, [size]: e.target.value})} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="small fw-bold mb-1">Fabric Type</label>
                <input type="text" className="form-control rounded-pill px-3 shadow-sm" placeholder="e.g. Cotton, Silk" value={fabricType} onChange={(e) => setFabricType(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="small fw-bold mb-1">Care & Cleaning Instructions</label>
                <input type="text" className="form-control rounded-pill px-3 shadow-sm" placeholder="How to clean the product..." value={careInstructions} onChange={(e) => setCareInstructions(e.target.value)} />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="small fw-bold mb-1">Main Images (Select Multiple)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="form-control rounded-pill shadow-sm"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setNewFiles(files);
                      setImageCategories(files.map(() => ""));
                      setActiveCategoryGroup(files.map(() => null));
                    }}
                  />
                  {newFiles.length > 0 && <small className="text-primary d-block mt-1 ps-2">{newFiles.length} files selected</small>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small fw-bold mb-1">Fabric Focus (Close-up - Multiple)</label>
                  <input type="file" multiple accept="image/*" className="form-control rounded-pill shadow-sm" onChange={(e) => setFabricFocusFiles(Array.from(e.target.files))} />
                  {fabricFocusFiles.length > 0 && <small className="text-primary d-block mt-1 ps-2">{fabricFocusFiles.length} files selected</small>}
                </div>
              </div>

              {/* ✅ اختيار الكاتيجوري لكل صورة - Modern UI */}
              {newFiles.length > 0 && (
                <div className="mb-3">
                  <label className="small fw-bold mb-2 d-block">
                    🏷️ {newFiles.length > 1 ? "Select a Category for Each Image" : "Select Category"}
                  </label>
                  <div className="d-flex flex-column gap-3">
                    {newFiles.map((file, idx) => {
                      const selectedCat = imageCategories[idx] || "";
                      const activeGroup = activeCategoryGroup[idx] || null;
                      const selectedGroupColor = selectedCat
                        ? GROUP_COLORS[Object.keys(CATEGORY_GROUPS).find(g => CATEGORY_GROUPS[g].includes(selectedCat))] || "#6c757d"
                        : null;

                      return (
                        <div
                          key={idx}
                          className="rounded-4 p-3"
                          style={{
                            background: darkMode ? "#1a1a2e" : "#f8f9ff",
                            border: selectedCat
                              ? `1.5px solid ${selectedGroupColor}55`
                              : `1.5px solid ${darkMode ? "#333" : "#e2e8f0"}`,
                            transition: "border 0.2s",
                          }}
                        >
                          {/* صف رقم الصورة + اسمها + الاختيار الحالي */}
                          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                            <span
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: 28, height: 28, fontSize: "0.75rem",
                                background: selectedCat ? selectedGroupColor : "#6366f1",
                                color: "#fff", flexShrink: 0,
                              }}
                            >
                              {idx + 1}
                            </span>
                            <span className="small text-muted text-truncate" style={{ maxWidth: 160 }}>{file.name}</span>
                            {selectedCat ? (
                              <span
                                className="badge rounded-pill px-3 py-1 ms-auto"
                                style={{ background: selectedGroupColor, color: "#fff", fontSize: "0.72rem" }}
                              >
                                ✓ {selectedCat}
                              </span>
                            ) : (
                              <span className="badge rounded-pill px-3 py-1 ms-auto" style={{ background: "#e2e8f0", color: "#64748b", fontSize: "0.72rem" }}>
                                Not selected
                              </span>
                            )}
                          </div>

                          {/* Group pills */}
                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {Object.keys(CATEGORY_GROUPS).map((group) => {
                              const gColor = GROUP_COLORS[group] || "#6c757d";
                              const isActive = activeGroup === group;
                              return (
                                <button
                                  key={group}
                                  type="button"
                                  onClick={() => {
                                    const updated = [...activeCategoryGroup];
                                    updated[idx] = isActive ? null : group;
                                    setActiveCategoryGroup(updated);
                                  }}
                                  className="btn btn-sm rounded-pill fw-semibold"
                                  style={{
                                    fontSize: "0.72rem",
                                    padding: "3px 10px",
                                    background: isActive ? gColor : gColor + "18",
                                    color: isActive ? "#fff" : gColor,
                                    border: `1px solid ${gColor}44`,
                                    transition: "all 0.15s",
                                  }}
                                >
                                  {group}
                                </button>
                              );
                            })}
                          </div>

                          {/* Sub-category pills */}
                          {activeGroup && (
                            <div
                              className="d-flex flex-wrap gap-1 pt-2"
                              style={{ borderTop: `1px solid ${GROUP_COLORS[activeGroup] || "#ccc"}33` }}
                            >
                              {CATEGORY_GROUPS[activeGroup].map((cat) => {
                                const gColor = GROUP_COLORS[activeGroup] || "#6c757d";
                                const isSel = selectedCat === cat;
                                return (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...imageCategories];
                                      updated[idx] = isSel ? "" : cat;
                                      setImageCategories(updated);
                                    }}
                                    className="btn btn-sm rounded-pill"
                                    style={{
                                      fontSize: "0.72rem",
                                      padding: "3px 10px",
                                      background: isSel ? gColor : (darkMode ? "#2a2a3e" : "#fff"),
                                      color: isSel ? "#fff" : (darkMode ? "#ccc" : "#334155"),
                                      border: `1px solid ${isSel ? gColor : (darkMode ? "#444" : "#cbd5e1")}`,
                                      fontWeight: isSel ? 600 : 400,
                                      transition: "all 0.15s",
                                    }}
                                  >
                                    {isSel ? "✓ " : ""}{cat}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-primary w-100 rounded-pill fw-bold shadow" onClick={handleAddPost}>
                {isEditing ? "Update Product" : "Post Product"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* الرسائل السوداء */}
      {messageModal.show && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: "#000",
            color: "#f5f5dc",
            padding: "25px 30px",
            borderRadius: "10px",
            textAlign: "center",
            maxWidth: "90%",
            fontSize: "16px",
          }}>
            {messageModal.text}
          </div>
        </div>
      )}

      {/* رسالة تأكيد (Confirm) */}
      {confirmModal.show && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: "#000",
            color: "#f5f5dc",
            padding: "30px 40px",
            borderRadius: "10px",
            textAlign: "center",
            maxWidth: "90%",
          }}>
            <p style={{ fontSize: "16px", marginBottom: "20px", color: "#fff" }}>{confirmModal.text}</p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button 
                onClick={handleConfirm}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                Yes, Delete
              </button>
              <button 
                onClick={handleCancel}
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}