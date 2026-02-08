import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { addCommentToPost } from "../api/api";

export default function Post({ post, darkMode, currentUserImage, onDelete, onEdit, isSeller, onUpdatePost }) {
  const { addToCart, addToWishlist } = useContext(CartContext);
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [rating, setRating] = useState(post.rating || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  
  const [commentText, setCommentText] = useState("");
  const [commentFile, setCommentFile] = useState(null);
  const [replyData, setReplyData] = useState({});

  // ✅ حالات المودالات الجديدة والتحكم في الصور
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCartSelection, setShowCartSelection] = useState(false);
  const [selection, setSelection] = useState({ size: "", color: "" });
  
  // ✅ حالة السلايدر (Index الصورة الحالية)
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [messageModal, setMessageModal] = useState({ show: false, text: "" });

  const showMessage = (text) => {
    setMessageModal({ show: true, text });
    setTimeout(() => setMessageModal({ show: false, text: "" }), 2000);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRating = (star) => {
    const newRating = rating === star ? 0 : star;
    setRating(newRating);
    onUpdatePost(post.id, { rating: newRating });
  };

  const toggleLike = () => {
    let newLikes = likes;
    let newDislikes = dislikes;
    if (liked) { newLikes -= 1; setLiked(false); }
    else { 
        newLikes += 1; setLiked(true);
        if (disliked) { newDislikes -= 1; setDisliked(false); }
    }
    setLikes(newLikes); setDislikes(newDislikes);
    onUpdatePost(post.id, { likes: newLikes, dislikes: newDislikes });
  };

  const toggleDislike = () => {
    let newLikes = likes;
    let newDislikes = dislikes;
    if (disliked) { newDislikes -= 1; setDisliked(false); }
    else { 
        newDislikes += 1; setDisliked(true);
        if (liked) { newLikes -= 1; setLiked(false); }
    }
    setLikes(newLikes); setDislikes(newDislikes);
    onUpdatePost(post.id, { likes: newLikes, dislikes: newDislikes });
  };

  // ✅ التنقل في السلايدر
  const nextImage = (e) => {
    e.stopPropagation();
    if (post.files && post.files.length > 0) {
      setCurrentImgIndex((prev) => (prev + 1) % post.files.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (post.files && post.files.length > 0) {
      setCurrentImgIndex((prev) => (prev - 1 + post.files.length) % post.files.length);
    }
  };

  const confirmAddToCart = () => {
    // ✅ التعديل المطلوب: الإجبارية تعتمد على وجود البيانات
    const needsSize = (post.sizes?.length > 0 || post.shoeSizes?.length > 0);
    const needsColor = (post.availableColors && post.availableColors.trim() !== "");

    if (needsSize && !selection.size) {
      showMessage("Please select size first!");
      return;
    }
    if (needsColor && !selection.color) {
      showMessage("Please select color first!");
      return;
    }

    const productToAdd = { ...post, selectedSize: selection.size, selectedColor: selection.color };
    addToCart(productToAdd);
    const newInCart = (post.inCart || 0) + 1;
    onUpdatePost(post.id, { inCart: newInCart });
    setShowCartSelection(false);
    showMessage(`Added successfully!`);
  };

  const handleCart = () => {
    if (!post.price) {
      showMessage("This product does not have a valid price");
      return;
    }
    setShowCartSelection(true);
  };

  const handleWish = () => {
    addToWishlist(post);
    showMessage("Added to wishlist!");
  };

  const handleAddComment = async () => {
    if (!commentText && !commentFile) return;
    let imageBase64 = null;
    if (commentFile) {
      try { imageBase64 = await fileToBase64(commentFile); } 
      catch (error) { console.error("Error converting comment image:", error); }
    }
    const newComment = { 
      id: Date.now(), 
      user: post.user, 
      userImage: currentUserImage, 
      text: commentText, 
      image: imageBase64,
      replies: [] 
    };
    await addCommentToPost(post.id, newComment);
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    onUpdatePost(post.id, { comments: updatedComments });
    setCommentText(""); 
    setCommentFile(null);
    showMessage("Comment added!");
  };

  const handleReply = async (index) => {
    const data = replyData[index];
    if (!data?.text && !data?.file) return;
    let imageBase64 = null;
    if (data.file) {
      try { imageBase64 = await fileToBase64(data.file); } 
      catch (error) { console.error("Error converting reply image:", error); }
    }
    const updated = [...comments];
    updated[index].replies.push({ 
      id: Date.now(), 
      user: post.user, 
      userImage: currentUserImage, 
      text: data.text, 
      image: imageBase64
    });
    setComments(updated);
    onUpdatePost(post.id, { comments: updated });
    setReplyData({ ...replyData, [index]: { text: "", file: null } });
    showMessage("Reply added!");
  };

  return (
    <div className={`card mb-4 border-0 shadow-sm rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : "bg-white text-dark"}`}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <img src={currentUserImage || "https://via.placeholder.com/45"} className="rounded-circle me-3 border" width="45" height="45" style={{objectFit:'cover'}} alt="user" />
            <div>
              <span className="fw-bold fs-5 d-block">{post.user}</span>
              <div className="d-flex gap-2">
                {post.price && (
                  <span className="badge bg-success">${post.price}</span>
                )}
                {/* ✅ زر Details بلون نص أسود */}
                <button 
                  className="btn btn-sm btn-info py-0 px-2 rounded-pill shadow-sm fw-bold" 
                  onClick={() => setShowDetailsModal(true)} 
                  style={{fontSize: '0.75rem', color: 'black'}}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
          {isSeller && (
            <div className="dropdown">
              <button className="btn btn-sm text-muted" data-bs-toggle="dropdown">•••</button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                <li><button className="dropdown-item" onClick={onEdit}>✏️ Edit</button></li>
                <li><button className="dropdown-item text-danger" onClick={onDelete}>🗑️ Delete</button></li>
              </ul>
            </div>
          )}
        </div>

        <p className="mb-3 fs-5">{post.text}</p>
        
        {/* ✅ السلايدر لعرض الصور */}
        {post.files && post.files.length > 0 && (
          <div className="mb-3 position-relative rounded-4 overflow-hidden border shadow-sm bg-black" style={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img 
              src={post.files[currentImgIndex]} 
              className="img-fluid" 
              style={{ maxHeight: "500px", objectFit: "contain", width: "100%" }} 
              alt={`product-${currentImgIndex}`}
            />
            
            {post.files.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="btn btn-dark btn-sm rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2 opacity-75 shadow"
                  style={{ zIndex: 10, width: "35px", height: "35px" }}
                >
                  ❮
                </button>
                <button 
                  onClick={nextImage}
                  className="btn btn-dark btn-sm rounded-circle position-absolute top-50 end-0 translate-middle-y me-2 opacity-75 shadow"
                  style={{ zIndex: 10, width: "35px", height: "35px" }}
                >
                  ❯
                </button>
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 bg-dark bg-opacity-50 text-white px-3 py-1 rounded-pill small">
                  {currentImgIndex + 1} / {post.files.length}
                </div>
              </>
            )}
          </div>
        )}

        <div className="d-flex justify-content-between border-top border-bottom py-3 mb-3 px-1">
          <div className="d-flex gap-4">
            <span style={{cursor:'pointer'}} className={liked ? "text-success fw-bold" : ""} onClick={toggleLike}>👍 {likes}</span>
            <span style={{cursor:'pointer'}} className={disliked ? "text-danger fw-bold" : ""} onClick={toggleDislike}>👎 {dislikes}</span>
            <span style={{cursor:'pointer'}} className="text-primary" onClick={handleCart}>🛒 Add</span>
            <span style={{cursor:'pointer'}} className="text-danger" onClick={handleWish}>❤️ Wish</span>
          </div>
          <div className="text-warning" style={{fontSize: '1.4rem'}}>
            {[1,2,3,4,5].map(s => (
              <span key={s} onClick={() => handleRating(s)} style={{cursor:'pointer'}} className="mx-1">
                {s <= rating ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {comments.map((c, i) => (
            <div key={c.id} className={`p-3 rounded-4 mb-3 shadow-sm ${darkMode ? "bg-secondary bg-opacity-25" : "bg-light"}`}>
              <div className="d-flex align-items-center mb-2">
                <img src={c.userImage || "https://via.placeholder.com/30"} className="rounded-circle me-2 border shadow-sm" width="30" height="30" style={{objectFit:'cover'}} alt="commenter" />
                <p className="mb-0 fw-bold small">{c.user}</p>
              </div>
              <p className="mb-0 ps-4">{c.text}</p>
              {c.image && <img src={c.image} className="rounded-3 mb-2 d-block ms-4 shadow-sm" width="120" alt="comment" />}
              {c.replies && c.replies.map(r => (
                <div key={r.id} className="ms-5 border-start border-3 ps-3 mt-2 opacity-75 small">
                  <p className="mb-1 fw-bold">{r.user}</p>
                  <p className="mb-0">{r.text}</p>
                  {r.image && <img src={r.image} width="80" className="rounded mt-1 shadow-sm" alt="reply-img" />}
                </div>
              ))}
              <div className="mt-3 ms-4 d-flex gap-2 align-items-center">
                <input className="form-control form-control-sm rounded-pill" placeholder="Reply..." 
                       value={replyData[i]?.text || ""} onChange={(e) => setReplyData({...replyData, [i]: { ...replyData[i], text: e.target.value}})} />
                <label className="mb-0" style={{cursor:'pointer'}}>
                  📸
                  <input type="file" hidden onChange={(e) => setReplyData({...replyData, [i]: { ...replyData[i], file: e.target.files[0]}})} />
                </label>
                <button className="btn btn-sm btn-primary rounded-circle px-3" onClick={() => handleReply(i)}>Replay</button>
              </div>
            </div>
          ))}

          <div className="mt-4 pt-3 border-top d-flex gap-2 align-items-center">
             <img src={currentUserImage || "https://via.placeholder.com/35"} className="rounded-circle shadow-sm" width="35" height="35" style={{objectFit:'cover'}} alt="user" />
             <input className={`form-control border-0 rounded-pill px-3 shadow-sm ${darkMode ? "bg-secondary text-white" : "bg-light"}`} 
                    placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddComment()} />
             <label className="mb-0" style={{cursor:'pointer'}}>
               📸
               <input type="file" hidden onChange={(e) => setCommentFile(e.target.files[0])} />
             </label>
             <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={handleAddComment}>Ok</button>
          </div>
          {commentFile && <small className="d-block mt-1 ms-5 text-primary">Image Selected: {commentFile.name}</small>}
        </div>
      </div>

      {/* ✅ مودال اختيار المقاس واللون المحدث كلياً */}
      {showCartSelection && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 }}>
          <div className="p-4 bg-white text-dark rounded-4 shadow-lg" style={{ width: "350px" }}>
            <h5 className="mb-3 fw-bold text-center border-bottom pb-2">Product Selection</h5>
            
            {/* ✅ حقل المقاس: يظهر فقط إذا وجد مقاسات ملابس أو أحذية */}
            {(post.sizes?.length > 0 || post.shoeSizes?.length > 0) && (
              <div className="mb-3">
                <label className="small fw-bold">Size (Required):</label>
                <select className="form-select rounded-pill" onChange={(e) => setSelection({...selection, size: e.target.value})}>
                  <option value="">Choose Size</option>
                  {post.sizes?.length > 0 && <optgroup label="Clothes">
                      {post.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>}
                  {post.shoeSizes?.length > 0 && <optgroup label="Shoes">
                      {post.shoeSizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>}
                </select>
              </div>
            )}

            {/* ✅ حقل اللون: يظهر كقائمة اختيار فقط إذا حدد البائع ألواناً */}
            {post.availableColors && post.availableColors.trim() !== "" && (
              <div className="mb-3">
                <label className="small fw-bold">Color (Required):</label>
                <select className="form-select rounded-pill" onChange={(e) => setSelection({...selection, color: e.target.value})}>
                  <option value="">Choose Color</option>
                  {post.availableColors.split(',').map(color => (
                    <option key={color} value={color.trim()}>{color.trim()}</option>
                  ))}
                </select>
              </div>
            )}

            {!((post.sizes?.length > 0 || post.shoeSizes?.length > 0) || (post.availableColors && post.availableColors.trim() !== "")) && (
              <p className="text-center small text-muted my-3">No specific options (size/color) are required for this product.</p>
            )}

            <div className="d-flex gap-2">
              <button className="btn btn-primary w-100 rounded-pill fw-bold" onClick={confirmAddToCart}>Confirm</button>
              <button className="btn btn-light border w-100 rounded-pill fw-bold" onClick={() => setShowCartSelection(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ مودال التفاصيل المحدث */}
      {showDetailsModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000, padding: "20px" }}>
          <div className={`p-4 rounded-4 shadow-lg w-100 ${darkMode ? "bg-dark text-light border" : "bg-white text-dark"}`} style={{ maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
               <h4 className="fw-bold mb-0">Product Info</h4>
               <button className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
            </div>
            <hr />
            <p className="mb-2"><strong>Fabric Type:</strong> {post.fabricType || "N/A"}</p>
            <p className="mb-2"><strong>Available Colors:</strong> {post.availableColors || "N/A"}</p>
            <p className="mb-3"><strong>Care:</strong> {post.careInstructions || "N/A"}</p>
            
            {/* عرض جايد الملابس */}
            {post.sizes?.length > 0 && (
              <div className="mb-3">
                <strong className="text-primary">Clothes Size Guide:</strong>
                <div className="mt-2 bg-light p-2 rounded text-dark small">
                    {post.sizeGuide ? Object.entries(post.sizeGuide).map(([sz, wt]) => (
                        <div key={sz} className="d-flex justify-content-between border-bottom py-1">
                            <span>Size {sz}:</span> <span className="fw-bold">{wt} kg</span>
                        </div>
                    )) : <span>No guide provided</span>}
                </div>
              </div>
            )}

            {/* عرض جايد الأحذية */}
            {post.shoeSizes?.length > 0 && (
              <div className="mb-3">
                <strong className="text-success">Shoes Size Guide:</strong>
                <div className="mt-2 bg-light p-2 rounded text-dark small">
                    {post.shoeSizeGuide ? Object.entries(post.shoeSizeGuide).map(([sz, detail]) => (
                        <div key={sz} className="d-flex justify-content-between border-bottom py-1">
                            <span>Size {sz}:</span> <span className="fw-bold">{detail}</span>
                        </div>
                    )) : <span>No guide provided</span>}
                </div>
              </div>
            )}

            {post.fabricFocus && post.fabricFocus.length > 0 && (
              <div className="mb-3">
                <strong>Fabric Focus:</strong>
                <div className="d-flex gap-2 overflow-auto py-2">
                  {post.fabricFocus.map((img, idx) => (
                    <img key={idx} src={img} width="110" height="110" className="rounded border shadow-sm" style={{objectFit: "cover"}} alt="focus" />
                  ))}
                </div>
              </div>
            )}
            <button className="btn btn-secondary w-100 rounded-pill fw-bold mt-2" onClick={() => setShowDetailsModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* الرسائل السوداء */}
      {messageModal.show && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999 }}>
          <div style={{ backgroundColor: "#000", color: "#f5f5dc", padding: "20px 40px", borderRadius: "10px", textAlign: "center" }}>
            {messageModal.text}
          </div>
        </div>
      )}
    </div>
  );
}