import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 للتوجيه
import Post from "./Post";
import { getPosts, addPost } from "../api/api";

export default function Profile() {
  const navigate = useNavigate(); // 👈 تهيئة التوجيه
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  const handleProfileImage = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleNewFiles = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  const handleAddPost = async () => {
    if (!newPostText && newFiles.length === 0) return;
    const post = {
      id: Date.now(),
      user: username || "Anonymous",
      text: newPostText,
      files: newFiles,
      likes: 0,
      dislikes: 0,
      rating: 0,
      comments: [],
    };
    await addPost(post);
    fetchPosts();
    setNewFiles([]);
    setNewPostText("");
  };

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light min-vh-100"}>
      
      {/* Navbar شفاف */}
      <nav 
        className="d-flex align-items-center px-4 py-2" 
        style={{ 
          position: "sticky", 
          top: 0, 
          backgroundColor: "rgba(255, 255, 255, 0.5)", 
          backdropFilter: "blur(5px)", 
          zIndex: 1000 
        }}
      >
        <button 
          className="btn btn-outline-dark btn-sm"
          onClick={() => navigate("/home")}
        >
          Home
        </button>
      </nav>

      <div className="container py-5">

        {/* Profile Card */}
        <div className={`card shadow-lg border-0 mb-5 ${darkMode && "bg-secondary text-light"}`}>
          <div className="card-body text-center">

            {/* صورة البروفايل */}
            <div className="position-relative d-inline-block mb-3">
              <img
                src={profileImage || "https://i.pravatar.cc/150"}
                className="rounded-circle border"
                width="140"
                height="140"
                alt="profile"
              />
              <label
                className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex justify-content-center align-items-center"
                style={{ width: "30px", height: "30px", cursor: "pointer" }}
              >
                +
                <input type="file" accept="image/*" hidden onChange={handleProfileImage} />
              </label>
            </div>

            {/* اسم المستخدم تحت الصورة بمسافة واضحة وبولد */}
            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-lg fw-bold text-center"
                style={{ maxWidth: "250px", margin: "0 auto" }}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Post Controls */}
            <div className="card mb-4 p-3">
              <textarea
                className="form-control mb-2"
                placeholder="What's on your mind?"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                style={{ fontSize: "1.2rem" }}
              />
              <div className="d-flex gap-2">
                <label className="btn btn-primary btn-sm">
                  Add Media
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*,video/*"
                    onChange={handleNewFiles}
                  />
                </label>
                <button className="btn btn-success btn-sm" onClick={handleAddPost}>
                  Create Post
                </button>
              </div>
            </div>

            <button
              className="btn btn-outline-dark btn-sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        {/* عرض البوستات */}
        {posts.map((post) => (
          <Post key={post.id} post={post} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
}
