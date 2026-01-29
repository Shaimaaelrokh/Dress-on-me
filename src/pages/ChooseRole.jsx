import { useState } from "react";
import { useNavigate } from "react-router-dom";   
import "../styles/ChooseRole.css";
import choosebackImg from "../assets/chooseback.jpg";
import customerImg from "../assets/customer.jpg";
import sellerImg from "../assets/seller.jpg";

export default function ChooseRole() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();   // 👈

  const handleCreate = () => {
     navigate("/profile");
  };

  return (
    <div className="role-container">
      {!role && (
        <div className="role-boxes">
          <div
            className="role-box image-box"
            onClick={() => setRole("customer")}
          >
            <img src={customerImg} alt="Customer" />
            <div className="overlay">
              <h2>Customer</h2>
            </div>
          </div>

          <div
            className="role-box image-box"
            onClick={() => setRole("seller")}
          >
            <img src={sellerImg} alt="Seller" />
            <div className="overlay">
              <h2>Seller</h2>
            </div>
          </div>
        </div>
      )}

      {role === "customer" && (
        <div className="form-box">
          <h2>Customer Profile</h2>

          <input type="text" placeholder="Display Name" />
          <input type="number" placeholder="Age" />

          <select>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="text"
            placeholder="Favorite Colors (e.g. Black, Beige)"
          />

          <button onClick={handleCreate}>Create Profile</button>   {/* 👈 */}
        </div>
      )}

      {role === "seller" && (
        <div className="form-box">
          <h2>Seller Profile</h2>

          <input type="text" placeholder="Display Name" />
          <input type="number" placeholder="Age" />

          <input type="text" placeholder="Product Type (Clothes, Shoes…)" />

          <select>
            <option value="">Preferred Payment Method</option>
            <option>Cash</option>
            <option>Credit Card</option>
            <option>Online Wallet</option>
          </select>

          <button onClick={handleCreate}>Create Profile</button>   {/* 👈 */}
        </div>
      )}
    </div>
  );
}
