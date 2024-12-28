// App.jsx
import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader/Loader';

const Auth = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const notifyA = (e) => toast.success(e,
    {
      style: {
        borderRadius: '10px',
        background: '#21262d',
        color: '#fff',
      },
    }
  );
  const notifyB = (e) => toast.error(e, {
    style: {
      borderRadius: '10px',
      background: '#21262d',
      color: '#fff',
    },
  })
  const navigate = useNavigate();
  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [loader, setLoader] = useState(false);

  const patterns = {
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
    fullName: /^[a-zA-Z\s]{3,30}$/
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, password, fullName } = formData;

    if (!patterns.email.test(email)) {
      notifyB('Invalid email format');
      return false;
    }

    if (formType === 'signup') {
      if (!patterns.fullName.test(fullName)) {
        notifyB('Name should be 3-30 characters long, letters only');
        return false;
      }
    }

    if (formType !== 'forgot' && !patterns.password.test(password)) {
      notifyB('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      let response;
      switch (formType) {
        case 'signup':
          if (!validateForm()) return;
          response = await axios.post(`${API_URL}/api/auth/signup`, formData);
          setOtpData({
            ...otpData,
            showOtpInput: true,
            tempUserData: formData
          });
          notifyA(response.data.message);
          break;

        case 'login':
          response = await axios.post(`${API_URL}/api/auth/login`, {
            email: formData.email,
            password: formData.password
          });
          notifyA('Logged in successfully!');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user))
          navigate('/user/Dashboard')
          break;

        case 'forgot':
          notifyA('System Error');
          break;
      }
    } catch (error) {
      notifyB(error.response?.data?.message || 'An error occurred');
    }
    setLoader(false);
  };


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
          <form onSubmit={handleForgotPassword}>
            {!forgotPasswordState.showOtpInput && !forgotPasswordState.showNewPasswordInput && (
              <>
                <div className="auth-input-box">
                  <input
                    type="email"
                    value={forgotPasswordState.email}
                    onChange={(e) => setForgotPasswordState(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <label>Email</label>
                </div>
                <button type="submit" className="auth-btn" onClick={() => setFormType('forgot')}>Reset Password</button>
              </>
            )}

            {forgotPasswordState.showOtpInput && (
              <>
                <div className="auth-input-box">
                  <input
                    type="text"
                    maxLength="4"
                    value={forgotPasswordState.otp}
                    onChange={(e) => setForgotPasswordState(prev => ({ ...prev, otp: e.target.value }))}
                    required
                  />
                  <label>Enter OTP</label>
                </div>
                <button type="button" className='auth-btn' onClick={verifyForgotPasswordOtp}>Verify OTP</button>
              </>
            )}

            {forgotPasswordState.showNewPasswordInput && (
              <>
                <div className="auth-input-box">
                  <input
                    type="password"
                    value={forgotPasswordState.newPassword}
                    onChange={(e) => setForgotPasswordState(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                  />
                  <label>New Password</label>
                </div>
                <div className="auth-input-box">
                  <input
                    type="password"
                    value={forgotPasswordState.confirmPassword}
                    onChange={(e) => setForgotPasswordState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                  <label>Confirm Password</label>
                </div>
                <button type="button" className='auth-btn' onClick={updatePassword}>Update Password</button>
              </>
            )}

            <div className="auth-signup-link">
              <button type="button" onClick={() => setFormType('login')}>Back to Login</button>
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

  const [otpData, setOtpData] = useState({
    otp: '',
    showOtpInput: false,
    tempUserData: null
  });

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (!otpData.otp || otpData.otp.length !== 4) {
      notifyB('Please enter a valid 4-digit OTP');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: otpData.tempUserData.email,
        otp: otpData.otp
      });

      if (response.data.success) {
        setLoader(false);
        notifyA('Account created successfully!');
        setFormType('login');
        setOtpData({
          otp: '',
          showOtpInput: false,
          tempUserData: null
        });
      }
    } catch (error) {
      notifyB(error.response?.data?.message || 'Invalid OTP');
      console.log(error);
    }
  };

  const [forgotPasswordState, setForgotPasswordState] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    showOtpInput: false,
    showNewPasswordInput: false
  });

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: forgotPasswordState.email
      });
      notifyA('OTP sent to your email!');
      setForgotPasswordState(prev => ({
        ...prev,
        showOtpInput: true
      }));
      setLoader(false);
    } catch (error) {
      notifyB(error.response?.data?.message || 'Error sending OTP');
      console.log(error);
    }
  };

  const verifyForgotPasswordOtp = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-forgot-password-otp`, {
        email: forgotPasswordState.email,
        otp: forgotPasswordState.otp
      });
      notifyA('OTP verified successfully!');
      setForgotPasswordState(prev => ({
        ...prev,
        showOtpInput: false,
        showNewPasswordInput: true
      }));
      setLoader(false);
    } catch (error) {
      notifyB(error.response?.data?.message || 'Invalid OTP');
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (forgotPasswordState.newPassword !== forgotPasswordState.confirmPassword) {
      notifyB('Passwords do not match!');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: forgotPasswordState.email,
        newPassword: forgotPasswordState.newPassword
      });
      notifyA('Password updated successfully!');
      setLoader(false);
      setFormType('login');
    } catch (error) {
      notifyB(error.response?.data?.message || 'Error updating password');
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
          {otpData.showOtpInput ? (
            <div className="auth-container-otp">
              <h2>Verify OTP</h2>
              <p>Enter the 4-digit code sent to {otpData.tempUserData.email}</p>
              <form onSubmit={verifyOtp}>
                <input
                  type="text"
                  maxLength="4"
                  value={otpData.otp}
                  onChange={(e) =>
                    setOtpData({ ...otpData, otp: e.target.value })
                  }
                  placeholder="OTP"
                  className="otp-input"
                />
                <button type="submit" className="auth-button">
                  Verify OTP
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="auth-login-box">
                <h2 className="auth-heading">
                  {formType === 'login' ? 'Login' : formType === 'signup' ? 'Sign Up' : 'Reset Password'}
                </h2>
                {renderForm()}
              </div>
              {/* Animated spans */}
              {
                [...Array(50)].map((_, i) => (
                  <span key={i} style={{ '--i': i }}></span>
                ))
              }
            </>
          )}
        </div>
      </div>
      {loader ? <Loader /> : null}
    </>

  );
};

export default Auth;

