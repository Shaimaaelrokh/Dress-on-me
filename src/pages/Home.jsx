import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

// الصور
import heroImg from "../assets/hero.jpg";
import featureImg from "../assets/featurre.jpg";
import backImg from "../assets/backk.jpg";
import eleganceImg from "../assets/elegance.jpg";
import vanImg from "../assets/sherry.jpg";   
import confidenceImg from "../assets/confidence.jpg";
import innovationImg from "../assets/innovation.jpg";
import yassImg from "../assets/yass.jpg"; 
import mmImg from "../assets/mm.jpg"; 
import soadImg from "../assets/soad.jpg"; 
import individualityImg from "../assets/individuality.jpg";                 
import bannerImg from "../assets/banner.jpg"; 
import bannerrImg from "../assets/noor.jpg"; 
import elegancceImg from "../assets/roushdy.jpg"; 
import individdualityImg from "../assets/omar2.jpg"; 
import confiddenceImg from "../assets/kareem.jpg"; 
import innovattionImg from "../assets/haleem.jpg"; 
import shou from "../assets/shoukry.jpg"; 
import nourImg from "../assets/nour.jpg"; 
import ezzImg from "../assets/Ahmedezz.jpg"; 
import aserImg from "../assets/aser.jpg"; 
import omaar from "../assets/omar.jpg"; 
import malekImg from "../assets/malek.jpg"; 

// أيقونات
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaShoppingCart, FaUserCircle, FaRobot, FaCamera } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";

export default function Home() {
  const navigate = useNavigate(); 

  return (
    <div className="home-page" style={{ backgroundImage: `url(${backImg})` }}>
      
      {/* HERO مع Navbar overlay */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroImg})` }}>
        {/* Navbar */}
        <nav className="navbar-overlay">
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/blog" className="nav-link">Blog</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/outfits" className="nav-link">Inspir your clothes</Link>

            <FaUserCircle
              className="profile-icon"
              size={24}
              style={{ cursor: "pointer", marginLeft: "10px" }}
              title="Profile"
              onClick={() => navigate("/profile")}
            />
            <FaRobot 
              size={22}
              style={{ cursor: "pointer" }}
              title="AI Assistant"
              onClick={() => navigate("/vichat")}
            />
            <GiClothes 
              size={24}
              style={{ cursor: "pointer" }}
              title="Virtual Wardrobe"
              onClick={() => navigate("/viton")}
            />
            <FaShoppingCart 
              className="cart-icon"
              size={22}
              style={{ cursor: "pointer" }}
              title="Cart"
              onClick={() => navigate("/cart")}
            />
          </div>
        </nav>

        <div className="overlay">
          <div className="container text-center">
            <h1 className="brand-title">COUTURE</h1>
            <p className="brand-sub">
              Every woman deserves to feel unique & beautiful
            </p>
            <button className="btn btn-light px-5 py-2 mt-3">Explore Collection</button>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="values container py-5">
        <div className="row text-center g-4">
          <div className="col-md-3">
            <div className="value-card" style={{ backgroundImage: `url(${eleganceImg})` }}>
              <h5>Elegance</h5>
              <p>Timeless feminine beauty</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="value-card" style={{ backgroundImage: `url(${confidenceImg})` }}>
              <h5>Confidence</h5>
              <p>Every style is unique</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="value-card" style={{ backgroundImage: `url(${vanImg})` }}>
              <h5>Individuality</h5>
              <p>Wear what empowers you</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="value-card" style={{ backgroundImage: `url(${innovationImg})` }}>
              <h5>Innovation</h5>
              <p>Modern fashion technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER SECTION */}
      <section className="repair-banner" style={{ backgroundImage: `url(${bannerImg})` }}>
        <div className="banner-content text-center">
          <h6>Hurry up!</h6>
          <h2>Up to <span>70% off</span></h2>
          <button className="btn btn-light mt-3">Explore More</button>
        </div>
      </section>

      {/* FEATURED TEXT CENTER */}
      <section className="featured container d-flex justify-content-center align-items-center py-5">
        <div className="featured-text text-center">
          <h2>Dress On Me</h2>
          <p>Created for those who appreciate femininity, elegance and modern luxury.</p>
          <button className="btn btn-outline-dark mt-3" onClick={() => navigate("/shop")}>
            Shop Now
          </button>
        </div>
      </section>

      {/* PROMOTIONS GRID SECTION 1 */}
      <section className="promotions-grid container py-5">
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="promo-card" style={{ backgroundImage: `url(${featureImg})` }}>
              <div className="promo-overlay">
                <h6 style={{ color: 'white', backgroundColor: 'darkred', display: 'inline-block', padding: '2px 5px' }}>Crazy deals</h6>
                <h3 style={{ color: '#8B0000' }}>buy 1 get 1 free</h3>
                <p style={{ color: 'white', backgroundColor: 'darkred', padding: '2px 5px' }}>
                  The best classic dress is on sale at COUTURE
                </p>
                <button className="btn btn-outline-light">Learn More</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="promo-card" style={{ backgroundImage: `url(${yassImg})` }}>
              <div className="promo-overlay">
                <h6>Spring/Summer</h6>
                <h3>Upcoming season</h3>
                <p>The best classic dress is on sale at COUTURE</p>
                <button className="btn btn-outline-light">Collection</button>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="promo-card small" style={{ backgroundImage: `url(${individualityImg})` }}>
              <div className="promo-overlay">
                <h4>SEASONAL SALE</h4>
                <span className="red-text">Winter Collection -50% OFF</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="promo-card small" style={{ backgroundImage: `url(${mmImg})` }}>
              <div className="promo-overlay">
                <h4>NEW FOOTWEAR COLLECTION</h4>
                <span className="red-text">Spring / Summer 2025</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="promo-card small" style={{ backgroundImage: `url(${soadImg})` }}>
              <div className="promo-overlay">
                <h4>T-SHIRTS</h4>
                <span className="red-text">New Trendy Prints</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES MEN */}
      <section className="values container py-5">
        <div className="row text-center g-4">
          <div className="col-md-3">
            <div className="value-card" style={{ backgroundImage: `url(${elegancceImg})` }}>
              <h5>Elegance</h5>
              <p>Timeless men fashion</p>
            </div>
          </div>      
          <div className="col-md-3">
            <div className="value-card" style={{ backgroundImage: `url(${confiddenceImg})` }}>
              <h5>Individuality</h5>
              <p>Every style is unique</p>
            </div>
          </div>                
          <div className="col-md-3">
            <div className="value-card" style={{ backgroundImage: `url(${individdualityImg})` }}>
              <h5>Confidence</h5>
              <p>Wear what empowers you</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="value-card" style={{ backgroundImage: `url(${innovattionImg})` }}>
              <h5>Innovation</h5>
              <p>Modern fashion technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER 2 */}
      <section className="repair-banner" style={{ backgroundImage: `url(${bannerrImg})` }}>
        <div className="banner-content text-center">
          <h6>Hurry up!</h6>
          <h2>Up to <span>70% off</span></h2>
          <button className="btn btn-light mt-3">Explore More</button>
        </div>
      </section>

      {/* CREATIVE MID SECTION */}
      <section className="creative-mid-section">
        <div className="creative-mid-overlay">
          <div className="creative-mid-content">
            <p className="small-title">Hey, I'm a</p>
            <h2 className="mid-title">Creative <br /> Director</h2>
            <p className="mid-desc">
              Great design should feel invisible. Built around clarity, emotion and purpose.
            </p>
          </div>
        </div>
      </section>

      {/* PROMOTIONS GRID SECTION 2 */}
      <section className="promotions-grid container py-5">
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="promo-card" style={{ backgroundImage: `url(${shou})` }}>
              <div className="promo-overlay">
                <h6 style={{ color: 'white', backgroundColor: 'darkred', display: 'inline-block', padding: '2px 5px' }}>Crazy deals</h6>
                <h3 style={{ color: '#8B0000' }}>buy 1 get 1 free</h3>
                <p style={{ color: 'white', backgroundColor: 'darkred', padding: '2px 5px' }}>The best classic dress is on sale at COUTURE</p>
                <button className="btn btn-outline-light">Learn More</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="promo-card" style={{ backgroundImage: `url(${nourImg})` }}>
              <div className="promo-overlay">
                <h6>Spring/Summer</h6>
                <h3>Upcoming season</h3>
                <p>The best classic dress is on sale at COUTURE</p>
                <button className="btn btn-outline-light">Collection</button>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="promo-card small" style={{ backgroundImage: `url(${aserImg})` }}>
              <div className="promo-overlay">
                <h4>SEASONAL SALE</h4>
                <span className="red-text">Winter Collection -50% OFF</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="promo-card small" style={{ backgroundImage: `url(${omaar})` }}>
              <div className="promo-overlay">
                <h4>NEW FOOTWEAR COLLECTION</h4>
                <span className="red-text">Spring / Summer 2025</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="promo-card small" style={{ backgroundImage: `url(${ezzImg})` }}>
              <div className="promo-overlay">
                <h4>T-SHIRTS</h4>
                <span className="red-text">New Trendy Prints</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section bg-dark text-white pt-5 pb-3 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h4 className="mb-3">Contact</h4>
              <p><strong>Phone:</strong> +201029924884</p>
              <p><strong>Address:</strong> Autostrad El Maadi, Cairo</p>
              <p><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
            </div>
            <div className="col-md-4 mb-4">
              <h4 className="mb-3">About</h4>
              <ul className="list-unstyled">
                <li><a href="#!" className="text-white-50 text-decoration-none">About us</a></li>
                <li><a href="#!" className="text-white-50 text-decoration-none">Delivery Info</a></li>
                <li><a href="#!" className="text-white-50 text-decoration-none">Privacy Policy</a></li>
                <li><a href="#!" className="text-white-50 text-decoration-none">Terms & Conditions</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h4 className="mb-3">Follow Us</h4>
              <div className="d-flex gap-3 fs-4">
                <FaFacebookF className="icon-hover" style={{ cursor: "pointer" }} />
                <FaTwitter className="icon-hover" style={{ cursor: "pointer" }} />
                <FaInstagram className="icon-hover" style={{ cursor: "pointer" }} />
                <FaYoutube className="icon-hover" style={{ cursor: "pointer" }} />
              </div>
            </div>
          </div>
          <hr className="bg-secondary" />
          <div className="text-center">
            <p className="mb-0 text-white-50">&copy; 2026 Dress On Me</p>
          </div>
        </div>
      </footer>
    </div>
  );
}