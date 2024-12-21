import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <a href="/" className="home-portfolio">Hidden</a>
        <nav className="home-navigation">
          <div className="home-nav-item">About</div>
          <a href="/contact" className="home-nav-item">Contact</a>
          <a href="/user/Dashboard" className="home-nav-item">Dashboard</a>
        </nav>
      </header>
      <div className="about-page">
        {/* Hero Section */}
        <section className="hero-section" data-aos="fade-up">
          <h1>
            We <span className="highlight">Shape Ideas</span> <br />
            and Build Future-Ready <span className="innovation">Solutions</span>
          </h1>
          <p>Your vision, our expertise – together we create something unique.</p>
        </section>

        {/* Bento Grid Section */}
        <section className="bento-section">
          <div className="bento-grid">
            {/* Large Card */}
            <div className="bento-card bento-large" data-aos="zoom-in">
              <img src="https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q29kZXxlbnwwfHwwfHx8MA%3D%3D" alt="Collaboration" />
              <div className="bento-overlay">
                <h3>Collaboration at Core</h3>
                <p>Our tools enhance collaboration and productivity.</p>
              </div>
            </div>

            {/* Medium Cards */}
            <div className="bento-card" data-aos="fade-right">
              <img src="https://plus.unsplash.com/premium_photo-1661882403999-46081e67c401?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Q29kZXxlbnwwfHwwfHx8MA%3D%3D" alt="Innovation" />
              <div className="bento-overlay">
                <h3>Innovative Ideas</h3>
                <p>We craft solutions tailored to your needs.</p>
              </div>
            </div>

            <div className="bento-card" data-aos="fade-left">
              <img src="https://plus.unsplash.com/premium_photo-1685086785077-ff65bf749544?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fENvZGV8ZW58MHx8MHx8fDA%3D" alt="Tools" />
              <div className="bento-overlay">
                <h3>Modern Tools</h3>
                <p>Empowering developers with real-time tools.</p>
              </div>
            </div>

            {/* Small Cards */}
            <div className="bento-card" data-aos="zoom-in-up">
              <img src="https://images.unsplash.com/photo-1531030874896-fdef6826f2f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fENvZGV8ZW58MHx8MHx8fDA%3D" alt="Teamwork" />
              <div className="bento-overlay">
                <h3>Teamwork</h3>
                <p>Strength lies in collaboration.</p>
              </div>
            </div>

            <div className="bento-card" data-aos="zoom-in-up">
              <img src="https://images.unsplash.com/photo-1499673610122-01c7122c5dcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fENvZGV8ZW58MHx8MHx8fDA%3D" alt="Vision" />
              <div className="bento-overlay">
                <h3>Our Vision</h3>
                <p>To shape technology for the future.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="cta-section" data-aos="fade-up">
          <h2>Let's Build Something Great Together</h2>
          <button className="cta-button">Get Started</button>
        </section>
      </div>
    </div>
  )
}

export default About




