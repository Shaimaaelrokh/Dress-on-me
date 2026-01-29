import React from 'react';
import { useNavigate } from 'react-router-dom'; // استيراد الهوك الخاص بالتنقل
import 'bootstrap/dist/css/bootstrap.min.css';

const Contact = () => {
  const navigate = useNavigate(); // تعريف الـ navigate

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="card shadow-sm p-4" style={{ maxWidth: '800px', width: '100%', borderRadius: '10px' }}>
        
        {/* زرار Home بالأعلى */}
        <div className="d-flex justify-content-start mb-3">
          <button 
            className="btn btn-outline-dark btn-sm fw-bold" 
            onClick={() => navigate('/home')}
          >
            🏠 Home
          </button>
        </div>

        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#333' }}>Contact Us</h2>
          <p className="text-muted">Have questions or feedback? We'd love to hear from you!</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row">
            {/* Your Name */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">Your Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter your full name" 
                style={{ backgroundColor: '#f1f3f5' }}
              />
            </div>

            {/* Email Address */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter your email address" 
                style={{ backgroundColor: '#f1f3f5' }}
              />
            </div>
          </div>

          <div className="row">
            {/* Subject */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">Subject</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter the subject" 
                style={{ backgroundColor: '#f1f3f5' }}
              />
            </div>

            {/* Message */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">Message</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="Write your message here..." 
                style={{ backgroundColor: '#f1f3f5' }}
              ></textarea>
            </div>
          </div>

          {/* Send Message Button */}
          <div className="d-grid gap-2 mb-3">
            <button className="btn btn-primary py-2 fw-bold" type="submit" style={{ backgroundColor: '#007bff' }}>
              Send Message
            </button>
          </div>

          {/* Back to Store Button - متصل بصفحة المتجر */}
          <div className="text-center">
            <button 
              type="button"
              className="btn btn-secondary px-4 py-2" 
              style={{ backgroundColor: '#6c757d', border: 'none' }}
              onClick={() => navigate('/shop')}
            >
              Back to Store
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Contact;