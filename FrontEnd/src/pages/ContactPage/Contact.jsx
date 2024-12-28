import React from 'react';
import './Contact.css';
import ContactImg from '../../assets/Contact.webp';
import emailjs from 'emailjs-com';
import toast from 'react-hot-toast';

function Contact() {

  const notifyA = () => toast.success('Message sent successfully!');
  const notifyB = () => toast.error('Failed to send message, please try again.');

  const redirectToGitHub = () => {
    window.open("https://github.com/VanshSharmaSDE/Collab", "_blank", "noopener,noreferrer");
  };

  const redirectToInstagram = () => {
    window.open("https://instagram.com/hidden_dev_007", "_blank", "noopener,noreferrer");
  };

  const redirectToLinkedIn = () => {
    window.open("https://www.linkedin.com/in/vansh-vyas-b7792b258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", "_blank", "noopener,noreferrer");
  }

  const redirectToMail = () => {
    window.open("mailto:vansh4664@gmail.com", "_blank", "noopener,noreferrer");
  }

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_se31tng', 'template_yxqqkg6', e.target, 'bnzxdQL3lfZ29L0ef')
      .then((result) => {
        console.log(result.text);
        notifyA();
        e.target.reset(); // Reset form after submission
      }, (error) => {
        console.log(error.text);
        notifyB();
      });
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <a href="/" className="home-portfolio">Hidden</a>
        <nav className="home-navigation">
          <a href="/about" className="home-nav-item">About</a>
          <div className="home-nav-item">Contact</div>
          <a href="/user/Dashboard" className="home-nav-item">Dashboard</a>
        </nav>
      </header>
      <div className="contact-home-container">
        <div className="contact-home-header">
          <h1>Nice to meet you!</h1>
        </div>
        <div className="contact-home-form">
          <form onSubmit={sendEmail}>
            <label htmlFor="firstName">YOUR FIRST NAME?</label>
            <input type="text" id="firstName" name="firstName" placeholder="Enter your first name" required />

            <label htmlFor="email">YOUR EMAIL? *</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required />

            <label htmlFor="phone">YOUR PHONE NUMBER?</label>
            <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" />

            <div className="contact-home-project">
              <h2>What if your project could speak?</h2>
            </div>

            <label htmlFor="message">✉️</label>
            <textarea id="message" name="message" rows="5" placeholder="Write your message" required></textarea>

            <button type="submit" className="contact-home-send-btn">SEND</button>
          </form>
        </div>

        {/* Right-side Contact Info */}
        <div className="contact-home-info">
          <div className="contact-home-colored-box">
            <img src={ContactImg} alt="" />
          </div>
          <div className="contact-home-details">
            <p>#00000, Delhi NCR, Sector 18</p>
            <p>514 806-1644</p>
            <span onClick={redirectToMail}>vansh4664@gmail.com</span>
            <ul>
              <li><span onClick={redirectToGitHub}>Github</span></li>
              <li><span onClick={redirectToLinkedIn}>LinkedIn</span></li>
              <li><span onClick={redirectToInstagram}>Instagram</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
