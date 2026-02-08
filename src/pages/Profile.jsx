import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Post from "./Post";
import { getPosts, addPost, updatePostInAPI, deletePost as deletePostAPI } from "../api/api";
import { useCart } from "../context/CartContext"; 
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap"; 

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { removeFromCart, removeFromWishlist } = useCart(); 

  const [username, setUsername] = useState(localStorage.getItem("u_name") || "shaimaa elrokh");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("u_img") || null);
  const [userRole, setUserRole] = useState(localStorage.getItem("u_role") || "seller");
  
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
        price: newPrice, // السعر النصي
        availableColors: availableColors, // الألوان المتاحة
        files: base64Files.length > 0 ? base64Files : posts.find(p => p.id === editPostId).files,
        sizes: selectedSizes,
        shoeSizes: selectedShoeSizes,
        fabricFocus: base64FabricFocus.length > 0 ? base64FabricFocus : posts.find(p => p.id === editPostId).fabricFocus,
        sizeGuide,
        shoeSizeGuide,
        fabricType,
        careInstructions
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
      
      <div className="container p-0 shadow-sm rounded-4 mb-4" 
           style={{ maxWidth: userRole === "seller" ? "1200px" : "850px", marginTop: "20px", backgroundColor: darkMode ? "#242526" : "#fff", position: "relative", overflow: "visible" }}>
        
        <div style={{ height: "200px", background: "linear-gradient(to right, #331515, #673333, #e8dfcc)", position: "relative", borderRadius: "15px 15px 0 0" }}>
          <div className="d-flex justify-content-between align-items-center p-3">
            <div className="d-flex gap-2">
              <button className="btn btn-light btn-sm rounded-pill fw-bold" onClick={() => navigate("/home")}>Home</button>
              <button className="btn btn-light btn-sm rounded-pill fw-bold" onClick={() => navigate("/shop")}>Shop</button>
            </div>
            
            <div className="d-flex gap-3 bg-white bg-opacity-25 p-2 rounded-pill px-3 shadow-sm">
              <span style={{ cursor: 'pointer', fontSize: '1.2rem' }} title="Wishlist" onClick={() => navigate("/wish")}>❤️</span>
              <span style={{ cursor: 'pointer', fontSize: '1.2rem' }} title="Cart" onClick={() => navigate("/cart")}>🛒</span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4" style={{ position: "relative", zIndex: "10" }}>
          <div style={{ marginTop: "-75px", display: "inline-block" }}>
            <img src={profileImage || "https://via.placeholder.com/150"} className="rounded-circle border border-5 border-white shadow" width="150" height="150" style={{objectFit: "cover", backgroundColor: "#fff"}} alt="profile" />
          </div>
          
          <h1 className="fw-bold mt-2">{username} {userRole === "seller" && <span className="badge bg-warning text-dark fs-6 rounded-pill ms-2">Seller</span>}</h1>

          <div className="d-flex gap-2 mt-3">
            <div className="dropdown">
              <button className="btn btn-dark rounded-pill px-4 fw-bold dropdown-toggle" data-bs-toggle="dropdown">Edit Profile</button>
              <ul className="dropdown-menu shadow border-0">
                <li><label className="dropdown-item py-2" style={{cursor:'pointer'}}>📸 Change Photo <input type="file" accept="image/*" hidden onChange={handleProfileImage}/></label></li>
                <li><button className="dropdown-item py-2" data-bs-target="#nameModal" data-bs-toggle="modal">✏️ Change Name</button></li>
              </ul>
            </div>

            <div className="dropdown">
              <button className="btn btn-outline-dark rounded-pill px-4 fw-bold dropdown-toggle" data-bs-toggle="dropdown">Settings</button>
              <ul className="dropdown-menu shadow border-0 p-2 text-center">
                <li><button className="btn btn-sm btn-light w-100 mb-1 fw-bold" onClick={() => setDarkMode(false)}>☀️ Light Mode</button></li>
                <li><button className="btn btn-sm btn-dark w-100 fw-bold" onClick={() => setDarkMode(true)}>🌙 Dark Mode</button></li>
              </ul>
            </div>

            {userRole === "seller" && <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => {setIsEditing(false); setNewPostText(""); setNewPrice(""); setAvailableColors(""); setNewFiles([]); setFabricFocusFiles([]);}} data-bs-target="#postModal" data-bs-toggle="modal">+ Create Product</button>}
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: userRole === "seller" ? "1200px" : "850px" }}>
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
              <div className={`card border-0 shadow-sm rounded-4 p-4 sticky-top ${darkMode ? "bg-dark text-white" : "bg-white"}`} style={{ top: "20px" }}>
                <h4 className="fw-bold mb-4">Business Analytics</h4>
                <div className="table-responsive">
                    <table className={`table table-borderless align-middle ${darkMode ? "table-dark" : ""}`}>
                    <thead className="small opacity-50 border-bottom">
                        <tr><th>Product</th><th>👍</th><th>👎</th><th>🛒</th><th>💰</th><th>⭐</th><th>💬</th></tr>
                    </thead>
                    <tbody>
                        {posts.map(p => (
                        <tr key={p.id} className="border-bottom">
                            <td className="small fw-bold text-truncate" style={{maxWidth: "80px"}}>{p.text || "Product"}</td>
                            <td className="text-success">{p.likes || 0}</td>
                            <td className="text-danger">{p.dislikes || 0}</td>
                            <td className="text-primary">{p.inCart || 0}</td>
                            <td className="fw-bold">{p.sales || 0}</td>
                            <td className="text-warning">{p.rating || 0}</td>
                            <td className="text-muted small">{p.comments?.length || 0}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Name */}
      <div className="modal fade" id="nameModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content border-0 rounded-4 ${darkMode ? "bg-dark text-white" : ""}`}>
            <div className="modal-header border-0 pb-0"><h5 className="modal-title fw-bold">Update Name</h5><button type="button" className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body py-4"><input type="text" className="form-control rounded-pill px-3" value={tempName} onChange={(e) => setTempName(e.target.value)} /></div>
            <div className="modal-footer border-0 pt-0"><button className="btn btn-primary w-100 rounded-pill fw-bold" onClick={() => {setUsername(tempName); localStorage.setItem("u_name", tempName);}} data-bs-dismiss="modal">Save</button></div>
          </div>
        </div>
      </div>

      {/* ✅ Modal Post المحدث */}
      <div className="modal fade" id="postModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
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
                  <input type="file" multiple accept="image/*" className="form-control rounded-pill shadow-sm" onChange={(e) => setNewFiles(Array.from(e.target.files))} />
                  {newFiles.length > 0 && <small className="text-primary d-block mt-1 ps-2">{newFiles.length} files selected</small>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small fw-bold mb-1">Fabric Focus (Close-up - Multiple)</label>
                  <input type="file" multiple accept="image/*" className="form-control rounded-pill shadow-sm" onChange={(e) => setFabricFocusFiles(Array.from(e.target.files))} />
                  {fabricFocusFiles.length > 0 && <small className="text-primary d-block mt-1 ps-2">{fabricFocusFiles.length} files selected</small>}
                </div>
              </div>
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