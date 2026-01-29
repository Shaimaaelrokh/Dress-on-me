import { useState } from "react";
import { addCommentToPost } from "../api/api";

export default function Post({ post, darkMode }) {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [rating, setRating] = useState(post.rating);
  const [comments, setComments] = useState(post.comments);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState(null);

  const toggleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      if (disliked) {
        setDislikes(dislikes - 1);
        setDisliked(false);
      }
      setLiked(true);
    }
  };

  const toggleDislike = () => {
    if (disliked) {
      setDislikes(dislikes - 1);
      setDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
      setDisliked(true);
    }
  };

  const handleAddComment = async () => {
    if (!commentText && !commentImage) return;

    const newComment = {
      id: Date.now(),
      text: commentText,
      image: commentImage ? URL.createObjectURL(commentImage) : null,
      likes: 0,
      liked: false,
      replies: [],
    };

    await addCommentToPost(post.id, newComment);
    setComments([newComment, ...comments]);
    setCommentText("");
    setCommentImage(null);
  };

  const handleCommentLike = (index) => {
    const updated = [...comments];
    if (updated[index].liked) {
      updated[index].likes--;
      updated[index].liked = false;
    } else {
      updated[index].likes++;
      updated[index].liked = true;
    }
    setComments(updated);
  };

  const handleReply = (index, replyText) => {
    if (!replyText) return;
    const updated = [...comments];
    updated[index].replies.push({ id: Date.now(), text: replyText });
    setComments(updated);
  };

  return (
    <div className={`card mb-4 ${darkMode ? "bg-secondary text-light" : ""}`}>
      <div className="card-body">

        <p className="fw-bold mb-2">{post.user}</p>
        {post.text && <p style={{ fontSize: "1.2rem" }}>{post.text}</p>}

        {/* Media */}
        {post.files.map((file, i) => (
          <div key={i} className="mb-2">
            {file.type.startsWith("image") ? (
              <img
                src={URL.createObjectURL(file)}
                alt=""
                style={{ maxWidth: "400px", maxHeight: "400px" }}
                className="rounded"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                controls
                style={{ maxWidth: "250px" }}
                className="rounded"
              />
            )}
          </div>
        ))}

        {/* Likes / Dislikes / Rating */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-2">
            <button className={`btn btn-outline-success btn-sm ${liked ? "active" : ""}`} onClick={toggleLike}>
              👍 {likes}
            </button>
            <button className={`btn btn-outline-danger btn-sm ${disliked ? "active" : ""}`} onClick={toggleDislike}>
              👎 {dislikes}
            </button>
          </div>
          <div>
            {[1,2,3,4,5].map((star) => (
              <i
                key={star}
                className={`bi bi-star${star <= rating ? "-fill" : ""} text-warning fs-5`}
                style={{ cursor: "pointer" }}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="border-top pt-3">
          {comments.map((c, i) => (
            <div key={c.id} className={`p-2 rounded mb-2 ${darkMode ? "bg-dark text-light" : "bg-light"}`}>
              <p className="mb-1">{c.text}</p>
              {c.image && <img src={c.image} alt="" style={{ maxWidth: "100px" }} className="rounded mb-1" />}
              <div className="d-flex gap-2 mb-2 align-items-center">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleCommentLike(i)}>
                  ❤️ {c.likes}
                </button>
                {/* Reply inline */}
                <input
                  type="text"
                  placeholder="Reply..."
                  className="form-control form-control-sm"
                  style={{ maxWidth: "150px" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleReply(i, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
              {/* عرض الردود */}
              {c.replies.map((r) => (
                <div key={r.id} className="ms-3 p-1 border-start border-secondary">
                  <p className="mb-0">{r.text}</p>
                </div>
              ))}
            </div>
          ))}

          {/* إضافة كومنت جديد */}
          <div className="d-flex mb-2 align-items-center">
            <textarea
              className="form-control me-2"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <label className="btn btn-outline-secondary mb-0 p-2">
              📷
              <input type="file" hidden accept="image/*" onChange={(e) => setCommentImage(e.target.files[0])} />
            </label>
          </div>
          <button className="btn btn-primary btn-sm mb-2" onClick={handleAddComment}>
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}
