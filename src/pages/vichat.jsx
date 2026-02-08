import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FaPlus, FaHistory, FaPaperPlane, FaImage, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import backgroundVideo from "../assets/chatt.mp4"; 

const Vichat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate(); 

  const MISTRAL_API_KEY = "cl7OnxUSl6RTzEZtHO3Dv1m32ooBIbnX";

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!input && !selectedImage) return;
    setLoading(true);
    const userText = input;
    const currentImage = selectedImage;
    const imageUrl = currentImage ? URL.createObjectURL(currentImage) : null;

    setMessages(prev => [...prev, { role: "user", text: userText, image: imageUrl }]);
    setInput("");
    setSelectedImage(null);

    try {
      let imageBase64 = "";
      if (currentImage) imageBase64 = await fileToBase64(currentImage);

      const messageContent = [{ type: "text", text: userText || "Analyze this picture" }];
      if (imageBase64) messageContent.push({ type: "image_url", image_url: `data:image/jpeg;base64,${imageBase64}` });

      const payload = {
        model: "pixtral-12b-2409",
        messages: [
          { role: "system", content: "أنت خبيره موضة ذكيه في موقع Dress on me .واسمك هو wella ساعدي المستخدمين في تنسيق ملابسهم والرد بالعربي بأسلوب راقٍ." },
          ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text || "" })),
          { role: "user", content: messageContent }
        ]
      };

      const response = await axios.post("https://api.mistral.ai/v1/chat/completions", payload, {
        headers: { "Authorization": `Bearer ${MISTRAL_API_KEY}`, "Content-Type": "application/json" }
      });

      setMessages(prev => [...prev, { role: "assistant", text: response.data.choices[0].message.content }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", text: "حدث خطأ في الاتصال." }]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    pageWrapper: {
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
      direction: 'rtl',
      padding: '20px',
      overflow: 'hidden'
    },
    videoBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: -1
    },
    videoOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.1)', // إضافة تعتيم خفيف للفيديو لزيادة الوضوح
      zIndex: -1
    },
    mainCard: {
      width: '100%',
      maxWidth: '1000px',
      height: '85vh',
      backgroundColor: 'hsla(300, 100%, 93%, 0.85)',
      borderRadius: '40px',
      display: 'flex',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
      position: 'relative',
      backdropFilter: 'blur(10px)' // زيادة الـ blur لجمالية أكثر
    },
    sideIconsBar: {
      width: '70px',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderLeft: '1px solid #F0F0F0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '30px',
      gap: '20px'
    },
    iconCircle: {
      width: '45px',
      height: '45px',
      borderRadius: '15px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: '0.3s',
      color: '#7B61FF',
      backgroundColor: '#F8F6FF'
    },
    chatSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '30px',
      backgroundColor: 'transparent'
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      marginBottom: '20px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    botBubble: {
      alignSelf: 'flex-start',
      maxWidth: '85%',
      backgroundColor: '#FFFFFF',
      padding: '15px 20px',
      borderRadius: '25px 25px 25px 5px',
      boxShadow: '0 2px 15px rgba(0,0,0,0.03)',
      border: '1px solid #F0F0F0',
      lineHeight: '1.6',
      fontSize: '15px'
    },
    userBubble: {
      alignSelf: 'flex-end',
      maxWidth: '75%',
      backgroundColor: '#F8F6FF',
      padding: '12px 20px',
      borderRadius: '25px 25px 5px 25px',
      color: '#333',
      fontSize: '15px'
    },
    inputWrapper: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '25px',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    textInput: {
      flex: 1,
      border: 'none',
      backgroundColor: 'transparent',
      outline: 'none',
      padding: '10px',
      fontSize: '15px'
    },
    sendBtn: {
      backgroundColor: '#7B61FF',
      border: 'none',
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <video autoPlay loop muted playsInline style={styles.videoBackground}>
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div style={styles.videoOverlay}></div>

      <div style={styles.mainCard}>
        <div style={styles.sideIconsBar}>
          <div style={styles.iconCircle} title="Home" onClick={() => navigate('/Home')}>
            <FaHome size={20} />
          </div>
          <div style={styles.iconCircle} title="New Chat" onClick={() => setMessages([])}>
            <FaPlus size={20} />
          </div>
          <div style={styles.iconCircle} title="History">
            <FaHistory size={20} />
          </div>
        </div>

        <div style={styles.chatSection}>
          <h2 style={{ textAlign: 'center', color: '#444', marginBottom: '20px', fontSize: '22px' }}>Wella is here for you ✨</h2>
          
          <div style={styles.messagesArea}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '50px', color: '#AAA' }}>
                <p>You ask, Wella delivers</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={m.role === 'user' ? styles.userBubble : styles.botBubble}>
                {m.image && <img src={m.image} alt="uploaded" style={{ maxWidth: '200px', borderRadius: '15px', marginBottom: '10px', display: 'block' }} />}
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            ))}
            {loading && <div style={{ color: '#7B61FF', fontSize: '13px', marginRight: '10px' }}>Wella gets your vibe...</div>}
            <div ref={chatEndRef} />
          </div>

          <div style={styles.inputWrapper}>
            <label style={{ cursor: 'pointer', color: '#7B61FF' }}>
              <FaImage size={20} />
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg, image/webp" // التعديل هنا لضمان ظهور المعاينة
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
              />
            </label>
            <input 
              style={styles.textInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Wella anything..."
            />
            <button style={styles.sendBtn} onClick={sendMessage} disabled={loading}>
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vichat;