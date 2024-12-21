import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css'

function Contact() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <a href="/" className="home-portfolio">Hidden</a>
        <nav className="home-navigation">
          <a href="/about" className="home-nav-item">About</a>
          <div  className="home-nav-item">Contact</div>
          <a href="/user/Dashboard" className="home-nav-item">Dashboard</a>
        </nav>
      </header>
      <div className="contact-home-container">
      <div className="contact-home-header">
        <h1>Nice to meet you!</h1>
      </div>
      <div className="contact-home-form">
        <form>
          <label htmlFor="firstName">YOUR FIRST NAME?</label>
          <input type="text" id="firstName" placeholder="Enter your first name" />

          <label htmlFor="email">YOUR EMAIL? *</label>
          <input type="email" id="email" placeholder="Enter your email" />

          <label htmlFor="phone">YOUR PHONE NUMBER?</label>
          <input type="tel" id="phone" placeholder="Enter your phone number" />

          <div className="contact-home-project">
            <h2>What if your project could speak?</h2>
          </div>

          <label htmlFor="message">✉️</label>
          <textarea id="message" rows="5" placeholder="Write your message"></textarea>

          <button type="submit" className="contact-home-send-btn">SEND</button>
        </form>
      </div>

      {/* Right-side Contact Info */}
      <div className="contact-home-info">
        <div className="contact-home-colored-box"></div>
        <div className="contact-home-details">
          <p>#501-5605, de Gaspé Montreal, Quebec H2T 2A4</p>
          <p>514 806-1644</p>
          <a href="mailto:hello@leeroy.ca">hello@leeroy.ca</a>
          <ul>
            <li><a href="#instagram">Instagram</a></li>
            <li><a href="#linkedin">LinkedIn</a></li>
            <li><a href="#facebook">Facebook</a></li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Contact
