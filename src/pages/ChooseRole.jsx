import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChooseRole.css";
import customerBg from "../assets/clutch.jpg"; 
import sellerBg from "../assets/ff.jpg";    

export default function ChooseRole() {
  const [isSeller, setIsSeller] = useState(false); 
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleCreate = (role) => {
    localStorage.setItem("u_role", role);
    localStorage.setItem("u_name", displayName || (role === "seller" ? "New Seller" : "New Customer"));
    navigate("/profile");
  };

  return (
    <div className="role-body">
      <div className={`role-container ${isSeller ? "right-panel-active" : ""}`} id="container">
        
        {/* فورم السيلر */}
        <div className="form-container seller-container">
          <div className="form-box">
            <h1>Seller Profile</h1>
            <span>Fill in your store details</span>
            <input type="text" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} />
            <input type="number" placeholder="Age" />
            <input type="text" placeholder="Product Type" />
            <select>
              <option value="">Payment Method</option>
              <option>Cash</option>
              <option>Credit Card</option>
            </select>
            <button className="main-btn" onClick={() => handleCreate("seller")}>Create Seller Account</button>
          </div>
        </div>

        {/* فورم الكاستمر */}
        <div className="form-container customer-container">
          <div className="form-box">
            <h1>Customer Profile</h1>
            <span>Join us as a buyer</span>
            <input type="text" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} />
            <input type="number" placeholder="Age" />
            <select>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <input type="text" placeholder="Favorite Colors" />
            <button className="main-btn" onClick={() => handleCreate("customer")}>Create Customer Account</button>
          </div>
        </div>

        {/* الجزء المتحرك (Overlay) */}
        <div className="overlay-container">
          <div className="overlay">
            {/* الناحية الشمال - خلفية الكاستمر */}
            <div 
              className="overlay-panel overlay-left" 
              style={{ backgroundImage: `url(${customerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <h1 style={{ color: 'white' }}>Welcome Back!</h1>
              <p style={{ color: 'white' }}>To stay connected as a customer, please switch here</p>
              <button className="ghost-btn" onClick={() => setIsSeller(false)}>I am a Customer</button>
            </div>

            {/* الناحية اليمين - خلفية السيلر */}
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
  );
}