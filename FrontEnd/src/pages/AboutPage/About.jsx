import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './About.css';

function About() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/user/Dashboard');
  };

  const redirectToGitHub = () => {
    window.open("https://github.com/VanshSharmaSDE/Collab", "_blank", "noopener,noreferrer");
  };

  const redirectToInstagram = () => {
    window.open("https://instagram.com/hidden_dev_007", "_blank", "noopener,noreferrer");
  };


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
            We <span className="highlight">Shape Collaborations</span> <br />
            and Build Future-Ready <span className="innovation">Platforms</span>
          </h1>
          <p>Your vision, our tools – together we code something extraordinary.</p>
        </section>

        {/* Bento Grid Section */}
        <section className="bento-section">
          <div className="bento-grid">
            {/* Large Card */}
            <div className="bento-card bento-large" data-aos="zoom-in">
              <img src="https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q29kZXxlbnwwfHwwfHx8MA%3D%3D" alt="Collaboration" />
              <div className="bento-overlay">
                <h3>Collaboration at Core</h3>
                <p>
                  Imagine a world where every idea is instantly shared, every solution is built together, and every line of code tells a story of teamwork. That’s the essence of our platform.
                </p>
              </div>
            </div>

            {/* Medium Cards */}
            <div className="bento-card" data-aos="fade-right">
              <img src="https://plus.unsplash.com/premium_photo-1661882403999-46081e67c401?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Q29kZXxlbnwwfHwwfHx8MA%3D%3D" alt="Innovation" />
              <div className="bento-overlay">
                <h3>Innovative Ideas</h3>
                <p>
                  Great things start with a spark. We take your ideas and turn them into solutions so innovative that they redefine the very meaning of creativity.
                </p>
              </div>
            </div>

            <div className="bento-card" data-aos="fade-left">
              <img src="https://plus.unsplash.com/premium_photo-1685086785077-ff65bf749544?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fENvZGV8ZW58MHx8MHx8fDA%3D" alt="Tools" />
              <div className="bento-overlay">
                <h3>Modern Tools</h3>
                <p>
                  Our platform is powered by tools so advanced, they feel like magic. Real-time updates, seamless integration, and boundless possibilities await you.
                </p>
              </div>
            </div>

            {/* Small Cards */}
            <div className="bento-card" data-aos="zoom-in-up">
              <img src="https://images.unsplash.com/photo-1531030874896-fdef6826f2f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fENvZGV8ZW58MHx8MHx8fDA%3D" alt="Teamwork" />
              <div className="bento-overlay">
                <h3>Teamwork</h3>
                <p>
                  Teamwork isn’t just a buzzword; it’s the backbone of innovation. Together, we can achieve what seems impossible alone.
                </p>
              </div>
            </div>

            <div className="bento-card" data-aos="zoom-in-up">
              <img src="https://images.unsplash.com/photo-1499673610122-01c7122c5dcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fENvZGV8ZW58MHx8MHx8fDA%3D" alt="Vision" />
              <div className="bento-overlay">
                <h3>Our Vision</h3>
                <p>
                  To empower every creator, developer, and dreamer to build solutions today that will shape the world of tomorrow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Section */}

        <section className="developer-section">
          <div className="developer-container">
            <h2>About the Developer</h2>
            <p>
              Hello! I'm <span className="highlight">[Vansh Sharma]</span>, the passionate developer behind this project. I’ve created this platform to foster collaborative coding and innovation. This is an <span className="highlight">Open Source</span> project, and you can find the source code on my GitHub.
            </p>
            <p>
              My vision with this project is to enable developers to collaborate in real-time and build amazing solutions together. It’s not just a tool—it's a way to bring ideas to life as a team.
            </p>

            {/* GitHub and Instagram Cards */}
            <div className="developer-links">
              <div className="link-card" data-aos="fade-right">
                <img
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub"
                />
                <div className="link-overlay">
                  <h3>Go to GitHub</h3>
                  <span
                    onClick={() => redirectToGitHub()}
                  >
                    Visit My GitHub
                  </span>
                </div>
              </div>

              <div className="link-card" data-aos="fade-left">
                <img
                  src="https://cdn.icon-icons.com/icons2/1211/PNG/512/1491579602-yumminkysocialmedia36_83067.png"
                  alt="Instagram"
                />
                <div className="link-overlay">
                  <h3>Go to Instagram</h3>
                  <span
                    onClick={() => redirectToInstagram()}
                  >
                    Visit My Instagram
                  </span>
                </div>
              </div>
            </div>

            {/* Scope of Improvements */}
            <div className="scope-of-improvements">
              <h3>Scope of Improvements</h3>
              <ul>
                <li>Enhance the user interface and visual design for a smoother experience.</li>
                <li>Introduce cloud storage and backups for projects.</li>
                <li>Add support for team chats during collaboration sessions.</li>
                <li>Expand the file editor to include more programming languages.</li>
                <li>Optimize backend performance for handling large teams and files.</li>
              </ul>
            </div>
          </div>
        </section>



        {/* Call-to-Action Section */}
        <section className="cta-section" data-aos="fade-up">
          <h2>Let's Build Something Great Together</h2>
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </section>
      </div>
    </div>
  );
}

export default About;
