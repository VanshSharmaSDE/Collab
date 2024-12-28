import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner" />
      <div className="loading-text">Loading, please wait...</div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(18, 18, 18, 0.85); /* Semi-transparent dark background */
  backdrop-filter: blur(8px); /* Blurred background */
  z-index: 9999;

  .spinner {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 20px; /* Space between spinner and text */
  }

  .spinner::before,
  .spinner:after {
    content: "";
    position: absolute;
    border-radius: inherit;
  }

  .spinner:before {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(0deg, #1e2126 0%,rgb(93, 46, 194) 100%); /* Gradient for dark theme */
    animation: spin8932 0.5s infinite linear;
  }

  .spinner:after {
    width: 85%;
    height: 85%;
    background-color: #121212; /* Inner circle color for dark theme */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(95, 46, 194, 0.8); /* Subtle inner glow */
  }

  .loading-text {
    font-size: 1.2rem;
    color: #e0e0e0; /* Subtle light text color */
    text-align: center;
    font-family: 'Poppins', sans-serif;
    text-shadow: 0px 2px 5px rgba(95, 46, 194, 0.8); /* Glow effect for text */
    animation: fadeInOut 1.5s infinite ease-in-out;
  }

  @keyframes spin8932 {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes fadeInOut {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
`;

export default Loader;
