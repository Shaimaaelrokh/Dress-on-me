import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChooseRole.css";
import customerBg from "../assets/clutch.jpg"; 
import sellerBg from "../assets/ff.jpg";    

export default function ChooseRole() {
  const [isSeller, setIsSeller] = useState(false); 
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [favoriteColors, setFavoriteColors] = useState("");
  const [productType, setProductType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Brand Details Modal State
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandYear, setBrandYear] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [brandIntro, setBrandIntro] = useState("");
  const [pendingRole, setPendingRole] = useState(null);

  const navigate = useNavigate();

  const handleCreate = (role) => {
    if (role === "seller") {
      // حفظ بيانات السيلر مؤقتاً وإظهار فورم البراند
      localStorage.setItem("u_role", role);
      localStorage.setItem("u_name", displayName || "New Seller");
      localStorage.setItem("u_email", email);
      setPendingRole(role);
      setShowBrandModal(true);
    } else {
      localStorage.setItem("u_role", role);
      localStorage.setItem("u_name", displayName || "New Customer");
      localStorage.setItem("u_email", email);
      navigate("/profile");
    }
  };

  const handleBrandSubmit = () => {
    // حفظ بيانات البراند في localStorage
    const brandData = {
      brandName: brandName || displayName || "My Brand",
      brandYear,
      taxNumber,
      brandIntro,
    };
    localStorage.setItem("u_brand", JSON.stringify(brandData));
    setShowBrandModal(false);
    navigate("/profile");
  };

  return (
    <>
      <div className="role-body">
        <div className={`role-container ${isSeller ? "right-panel-active" : ""}`} id="container">
          
          {/* ── Seller Form ── */}
          <div className="form-container seller-container">
            <div className="form-box">
              <h1>Seller Profile</h1>
              <span>Fill in your store details</span>
              <input type="text" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} />
              <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
              <input type="text" placeholder="Product Type" onChange={(e) => setProductType(e.target.value)} />
              <select onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Payment Method</option>
                <option>Cash</option>
                <option>Credit Card</option>
              </select>
              <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              <button className="main-btn" onClick={() => handleCreate("seller")}>Create Seller Account</button>
            </div>
          </div>

          {/* ── Customer Form ── */}
          <div className="form-container customer-container">
            <div className="form-box">
              <h1>Customer Profile</h1>
              <span>Join us as a buyer</span>
              <input type="text" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} />
              <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
              <select onChange={(e) => setGender(e.target.value)}>
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <input type="text" placeholder="Favorite Colors" onChange={(e) => setFavoriteColors(e.target.value)} />
              <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              <button className="main-btn" onClick={() => handleCreate("customer")}>Create Customer Account</button>
            </div>
          </div>

          {/* ── Overlay ── */}
          <div className="overlay-container">
            <div className="overlay">
              <div 
                className="overlay-panel overlay-left" 
                style={{ backgroundImage: `url(${customerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <h1 style={{ color: 'white' }}>Welcome Back!</h1>
                <p style={{ color: 'white' }}>To stay connected as a customer, please switch here</p>
                <button className="ghost-btn" onClick={() => setIsSeller(false)}>I am a Customer</button>
              </div>

              <div 
                className="overlay-panel overlay-right" 
                style={{ backgroundImage: `url(${sellerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <h1 style={{ color: 'white' }}>Hello, Partner!</h1>
                <p style={{ color: 'white' }}>Enter your details and start your selling journey with us</p>
                <button className="ghost-btn" onClick={() => setIsSeller(true)}>I am a Seller</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Brand Details Modal ── */}
      {showBrandModal && (
        <div className="brand-modal-overlay">
          <div className="brand-modal">

            <div className="brand-modal-header">
              <div className="brand-modal-icon">🏷️</div>
              <h2>Brand Identity</h2>
              <p>Tell us about your brand so customers can know you better</p>
            </div>

            <div className="brand-modal-body">
              <div className="brand-field">
                <label>Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Luxe Studio"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>

              <div className="brand-field-row">
                <div className="brand-field">
                  <label>Founded Year</label>
                  <input
                    type="number"
                    placeholder="e.g. 2019"
                    value={brandYear}
                    onChange={(e) => setBrandYear(e.target.value)}
                  />
                </div>
                <div className="brand-field">
                  <label>Tax Registration No.</label>
                  <input
                    type="text"
                    placeholder="e.g. EG-123456789"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="brand-field">
                <label>Brand Introduction</label>
                <textarea
                  placeholder="Write a short intro about your brand, what you offer, and your story..."
                  value={brandIntro}
                  onChange={(e) => setBrandIntro(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="brand-modal-footer">
              <button className="brand-skip-btn" onClick={() => { setShowBrandModal(false); navigate("/profile"); }}>
                Skip for now
              </button>
              <button className="brand-submit-btn" onClick={handleBrandSubmit}>
                Launch My Brand ✨
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}