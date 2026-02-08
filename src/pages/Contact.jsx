import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Contact = () => {
  const navigate = useNavigate();

  // تنسيق داخلي للخطوط والألوان المستوحاة من الصورة
  const styles = {
    pageContainer: {
      backgroundColor: '#f4ede4', // لون الخلفية الكريمي
      fontFamily: '"Playfair Display", serif', // خط كلاسيكي (يفضل إضافته في index.html)
      minHeight: '100vh',
      padding: '50px 0'
    },
    heroSection: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#5d4037'
    },
    contactCard: {
      backgroundColor: '#ffffff',
      maxWidth: '700px',
      margin: '0 auto',
      padding: '40px',
      borderRadius: '0px', // الصورة حوافها حادة
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    inputField: {
      border: 'none',
      borderBottom: '1px solid #d7ccc8', // خط سفلي فقط كالموجود بالصورة
      borderRadius: '0',
      padding: '10px 0',
      marginBottom: '20px',
      backgroundColor: 'transparent'
    },
    submitBtn: {
      backgroundColor: '#8d6e63', // لون بني ترابي
      color: 'white',
      border: 'none',
      borderRadius: '0',
      padding: '12px 40px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontSize: '14px',
      marginTop: '20px'
    },
    backLink: {
      color: '#8d6e63',
      textDecoration: 'none',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'inline-block',
      marginTop: '20px',
      borderBottom: '1px solid #8d6e63'
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* قسم العنوان العلوي */}
      <div style={styles.heroSection}>
        <h1 style={{ fontSize: '3rem', fontWeight: '300', marginBottom: '10px' }}>
          Ready to slow <br /> down, tune in, and <br /> get aligned?
        </h1>
        <p style={{ letterSpacing: '1px', fontSize: '0.9rem', opacity: '0.8' }}>
          (MENTALLY, EMOTIONALLY, AND PHYSICALLY)
        </p>
      </div>

      <div style={styles.contactCard}>
        <div className="text-center mb-5">
          <h2 style={{ fontSize: '2.5rem', fontWeight: '300' }}>Inquire Here</h2>
          <p className="text-muted small">
            Fill out the contact form below to inquire about our services. <br />
            You can expect a response within 24 hours!
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="small text-uppercase" style={{ color: '#8d6e63' }}>First Name (required)</label>
              <input type="text" className="form-control" style={styles.inputField} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="small text-uppercase" style={{ color: '#8d6e63' }}>Last Name</label>
              <input type="text" className="form-control" style={styles.inputField} />
            </div>
          </div>

          <div className="mb-4">
            <label className="small text-uppercase" style={{ color: '#8d6e63' }}>Email (required)</label>
            <input type="email" className="form-control" style={styles.inputField} />
          </div>

          <div className="mb-4">
            <label className="small text-uppercase" style={{ color: '#8d6e63' }}>Subject (required)</label>
            <input type="text" className="form-control" style={styles.inputField} />
          </div>

          <div className="mb-4">
            <label className="small text-uppercase" style={{ color: '#8d6e63' }}>Message (required)</label>
            <textarea className="form-control" rows="3" style={styles.inputField}></textarea>
          </div>

          <div className="text-center">
            <button style={styles.submitBtn} type="submit">
              SUBMIT
            </button>
          </div>

          <div className="text-center mt-3">
             <span style={styles.backLink} onClick={() => navigate('/home')}>Back to Home</span>
             <span className="mx-2">|</span>
             <span style={styles.backLink} onClick={() => navigate('/shop')}>Back to Store</span>
          </div>
        </form>
      </div>

      {/* الجزء السفلي (Footer المماثل للصورة) */}
      <footer className="text-center mt-5" style={{ color: '#5d4037', padding: '40px' }}>
        <p className="small text-uppercase" style={{ letterSpacing: '2px' }}>Let's Connect</p>
        <div className="d-flex justify-content-center gap-5 mt-4">
          <div>
            <h5 style={{ fontWeight: '300' }}>Instagram</h5>
            <p className="small border-bottom border-secondary d-inline-block">FOLLOW ALONG</p>
          </div>
          <div>
            <h5 style={{ fontWeight: '300' }}>Pinterest</h5>
            <p className="small border-bottom border-secondary d-inline-block">GET INSPIRED</p>
          </div>
          <div>
            <h5 style={{ fontWeight: '300' }}>Email</h5>
            <p className="small border-bottom border-secondary d-inline-block">GET IN TOUCH</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;