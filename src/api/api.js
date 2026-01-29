// src/api/api.js
let posts = []; // مصفوفة لتخزين البوستات مؤقتًا

export const getPosts = () => {
  return Promise.resolve(posts);
};

export const addPost = (newPost) => {
  posts = [newPost, ...posts];
  return Promise.resolve(newPost);
};

export const addCommentToPost = (postId, comment) => {
  posts = posts.map((p) =>
    p.id === postId ? { ...p, comments: [comment, ...p.comments] } : p
  );
  return Promise.resolve(comment);
};
