// src/components/Layout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Transition from '../Transition/Transition';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const ease = "power4.inOut";

    const revealTransition = (to) => {
      return new Promise((resolve) => {
        gsap.set(".block", { scaleY: 1 });
        gsap.to(".block", {
          scaleY: 0,
          duration: 1,
          stagger: {
            each: 0.1,
            from: "start",
            grid: "auto",
            axis: "x",
          },
          ease: ease,
          onComplete: ()=>{
            navigate(to);
            resolve();
          },
        });
      });
    };

    const animateTransition = (to) => {
      return new Promise((resolve) => {
        gsap.set(".block", { visibility: "visible", scaleY: 0 });
        gsap.to(".block", {
          scaleY: 1,
          duration: 1,
          stagger: {
            each: 0.1,
            from: "start",
            grid: [2, 5],
            axis: "x",
          },
          ease: ease,
          onComplete: () => {
            navigate(to);
            resolve();
          },
        });
      });
    };

    revealTransition().then(() => {
      gsap.set(".block", { visibility: "hidden" });
    });

    const handleClick = async (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const to = e.target.getAttribute('href');
        await animateTransition(to);
        // window.location.href = to;
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigate]);

  return (
    <div className="app">
      <Transition />
      {children}
    </div>
  );
};

export default Layout;