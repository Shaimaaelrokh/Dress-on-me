// جلب البيانات المخزنة مسبقاً أو البدء بمصفوفة فارغة
let posts = JSON.parse(localStorage.getItem("user_posts")) || []; 

const saveToLocal = () => {
  localStorage.setItem("user_posts", JSON.stringify(posts));
};

export const getPosts = () => Promise.resolve(posts);

export const addPost = (newPost) => {
  const businessPost = {
    ...newPost,
    likes: newPost.likes || 0,
    dislikes: newPost.dislikes || 0,
    inCart: newPost.inCart || 0,
    sales: newPost.sales || 0,
    rating: newPost.rating || 0,
    comments: newPost.comments || []
  };
  posts = [businessPost, ...posts];
  saveToLocal();
  return Promise.resolve(businessPost);
};

// وظيفة جديدة لتحديث بيانات البوست في الذاكرة الدائمة
export const updatePostInAPI = (postId, updatedData) => {
  posts = posts.map(p => p.id === postId ? { ...p, ...updatedData } : p);
  saveToLocal();
  return Promise.resolve(posts);
};

export const addCommentToPost = (postId, comment) => {
  posts = posts.map((p) => 
    p.id === postId ? { ...p, comments: [comment, ...(p.comments || [])] } : p
  );
  saveToLocal();
  return Promise.resolve(comment);
};

// وظيفة جديدة لحذف البوست نهائياً من الذاكرة الدائمة
export const deletePost = (postId) => {
  posts = posts.filter(p => p.id !== postId);
  saveToLocal();
  return Promise.resolve(true);
};