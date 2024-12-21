import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./D_Profile.css";

const D_Profile = () => {
  const [biography, setBiography] = useState("");

  const handleBiographyChange = (value) => {
    setBiography(value);
  };
  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-photo-section">
          <div className="profile-photo">
            <img src="https://lms.smartbrains.org.in/uploads/user_image/placeholder.png" alt="" />
          </div>
          <button className="upload-button">Upload Photo</button>
        </div>
        <div className="profile-info">
          <h2>Profile Info</h2>
          <form>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="Vansh" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Vyas" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="abc@gmail.com" />
            </div>
            <div className="form-group">
              <label>Biography</label>
              <ReactQuill
                value={biography}
                onChange={handleBiographyChange}
                // theme="snow"
                placeholder="Write something about yourself..."
              />
            </div>
            <div className="social-links">
              <h3>Social Links</h3>
              <div className="form-group">
                <label>
                  <i className="fab fa-twitter"></i> Twitter
                </label>
                <input type="text" placeholder="Twitter link" />
              </div>
              <div className="form-group">
                <label>
                  <i className="fab fa-facebook"></i> Facebook
                </label>
                <input type="text" placeholder="Facebook link" />
              </div>
              <div className="form-group">
                <label>
                  <i className="fab fa-linkedin"></i> LinkedIn
                </label>
                <input type="text" placeholder="LinkedIn link" />
              </div>
            </div>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default D_Profile;
