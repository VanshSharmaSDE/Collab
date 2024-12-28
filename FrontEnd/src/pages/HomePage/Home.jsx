import React from "react";
import "./Home.css";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="home-portfolio">Hidden</div>
                <nav className="home-navigation">
                    <a href="/about" className="home-nav-item">About</a>
                    <a href="/contact" className="home-nav-item">Contact</a>
                    <a href="/user/Dashboard" className="home-nav-item">Dashboard</a>
                </nav>
            </header>

            {/* Main Content */}
            <div className="home-content">
                {/* Left Section */}
                <div className="home-left-section">
                    <h1 className="home-title">
                        <span className="home-title-highlight">Co</span>llab
                    </h1>
                    <p className="home-subtitle">Build a Masterpiece Together</p>
                </div>

                <div className="home-circle">
                    {/* Left Half of Circle */}
                    <div className="home-circle-left" />
                    {/* Right Half of Circle */}
                    <div className="home-circle-right">
                        <img
                            src="https://images.unsplash.com/photo-1512551980832-13df02babc9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMxfHxkYXJrJTIwdGVjaHxlbnwwfHwwfHx8MA%3D%3D"
                            alt="Collab"
                            className="home-image"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="home-right-section">
                    {/* Text Content */}
                    <div className="home-text-content">
                        <h2 className="home-kitchen-title">Get Started</h2>
                        <p className="home-kitchen-description">
                            Craft a collaborative, intuitive coding space with smart tools, elegant design, layered features, and personalized touches for an efficient and inspiring experience
                        </p>
                        <div className="home-arrows">
                            <span>----</span>
                            <a href="/auth">&rarr;</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;