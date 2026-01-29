import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import loginpic from "../assets/loginn.jpg";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/choose-role");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "250px",
        alignItems: "center",
        backgroundImage: `url(${loginpic})`,
        backgroundSize: "cover",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Form Box */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(0.1px)",
          padding: "40px 30px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(97, 11, 11, 0.69)",
          width: "100%",
          maxWidth: "600px",
          textAlign: "center",
          
        }}
      >
        <h2 style={{ marginBottom: "30px", fontWeight: "700", color: "#6a0202e2" }}>
          Start your journey!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start" style={{color: "#000000"}}>
            <label htmlFor="email" className="form-label fw-semibold">
              Email address
            </label>
            <input
              type="email"
              className="form-control shadow-sm"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3 text-start" style={{color: "#000000"}}>
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              className="form-control shadow-sm"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#6a0202e2",
              color: "#fff",
              fontWeight: "600",
              padding: "10px",
              width: "100%",
              borderRadius: "10px",
              marginTop: "15px",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#000000")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#6a0202e2")
            }
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: "20px", color: "#555" }}>
          Don't have an account?{" "}
          <a href="#" style={{ color: "#6c63ff" }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
