// App.jsx
import React, { useState } from 'react';
import './Auth.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  // Regex patterns
  const patterns = {
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
    fullName: /^[a-zA-Z\s]{3,30}$/
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
  };

  const validateForm = () => {
    const { email, password, fullName } = formData;

    if (!patterns.email.test(email)) {
      showPopup('Invalid email format', 'error');
      return false;
    }

    if (formType === 'signup') {
      if (!patterns.fullName.test(fullName)) {
        showPopup('Name should be 3-30 characters long, letters only', 'error');
        return false;
      }
    }

    if (formType !== 'forgot' && !patterns.password.test(password)) {
      showPopup('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      const API_URL = 'http://localhost:5000/api/auth';

      switch (formType) {
        case 'signup':
          if (!validateForm()) return;
          response = await axios.post(`${API_URL}/signup`, formData);
          showPopup('Account created successfully!', 'success');
          setFormType('login');
          break;

        case 'login':
          response = await axios.post(`${API_URL}/login`, {
            email: formData.email,
            password: formData.password
          });
          showPopup('Logged in successfully!', 'success');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user))
          navigate('/user/Dashboard')
          break;

        case 'forgot':
          response = await axios.post(`${API_URL}/forgot-password`, {
            email: formData.email
          });
          showPopup('Password reset instructions sent to your email!', 'success');
          break;
      }
    } catch (error) {
      console.log(error)
      showPopup(error.response?.data?.message || 'An error occurred', 'error');
    }
  };

  // Add this component inside App.jsx
  const Popup = ({ message, type }) => (
    <div className={`auth-popup ${type}`}>
      <div className="auth-popup-content">
        <span className="auth-popup-icon">
          {type === 'success' ? '✓' : '✕'}
        </span>
        {message}
      </div>
    </div>
  );

  const renderForm = () => {
    switch (formType) {
      case 'signup':
        return (
          <form onSubmit={handleSubmit}>
            <div className="auth-input-box">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <label>Full Name</label>
            </div>
            <div className="auth-input-box">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label>Email</label>
            </div>
            <div className="auth-input-box">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <label>Password</label>
            </div>
            <button type="submit" className="auth-btn" onClick={() => setFormType('signup')}>Sign Up</button>
            <div className="auth-signup-link">
              Already have an account?
              <button type="submit" onClick={() => setFormType('login')}>Login</button>
            </div>
          </form>
        );

      case 'forgot':
        return (
          <form onSubmit={handleSubmit}>
            <div className="auth-input-box">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label>Email</label>
            </div>
            <button type="submit" className="auth-btn" onClick={() => setFormType('forgot')}>Reset Password</button>
            <div className="auth-signup-link">
              <button onClick={() => setFormType('login')}>Back to Login</button>
            </div>
          </form>
        );

      default:
        return (
          <>
            <form onSubmit={handleSubmit}>
              <div className="auth-input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <label>Email</label>
              </div>
              <div className="auth-input-box">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label>Password</label>
              </div>
              <button type="submit" className="auth-btn">Login</button>
              <div className="auth-forgot-password">
                <button onClick={() => setFormType('forgot')}>Forgot Password?</button>
              </div>
              <div className="auth-signup-link">
                Don't have an account?
                <button onClick={() => setFormType('signup')}> Signup</button>
              </div>
            </form>
            <div className="auth-oauth-buttons">
              <button className="auth-oauth-btn google">
                <i className="fab fa-google"></i>
                Sign in with Google
              </button>
              <button className="auth-oauth-btn github">
                <i className="fab fa-github"></i>
                Sign in with GitHub
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <header className="home-header custom-header-auth">
        <a href="/" className="home-portfolio">Hidden</a>
        <nav className="home-navigation">
          <a href="/about" className="home-nav-item">About</a>
          <a href="/contact" className="home-nav-item">Contact</a>
        </nav>
      </header>
      <div className="auth-main">
        <div className="auth-container">
          {popup.show && <Popup message={popup.message} type={popup.type} />}
          <div className="auth-login-box">
            <h2 className="auth-heading">
              {formType === 'login' ? 'Login' : formType === 'signup' ? 'Sign Up' : 'Reset Password'}
            </h2>
            {renderForm()}
          </div>

          {/* Animated spans */}
          {[...Array(50)].map((_, i) => (
            <span key={i} style={{ '--i': i }}></span>
          ))}
        </div>
      </div>
    </>

  );
};

export default Auth;



