import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./D_Profile.css";
import toast from "react-hot-toast";

const D_Profile = () => {
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

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    profileImage: "https://lms.smartbrains.org.in/uploads/user_image/placeholder.png",
    biography: "",
    socialLinks: {
      twitter: "Link your Twitter account",
      facebook: "Link your Facebook account",
      linkedin: "Link your Linkdin account",
    },
  });
  const [selectedImage, setSelectedImage] = useState(null); // Store selected image file

  // Fetch user data on component load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await axios.get(`${API_URL}/api/auth/${userId}`);
        setUserData(response.data);
      } catch (error) {
        // console.error("Error fetching user data:", error);
        notifyB("Error fetching user data");
      }
    };
    fetchUserData();
  }, []);

  // Handle input changes for general fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for social links
  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      // Create FormData to send image and other fields
      const formData = new FormData();
      formData.append("fullName", userData.fullName);
      formData.append("email", userData.email);
      formData.append("biography", userData.biography);
      formData.append("socialLinks.twitter", userData.socialLinks.twitter);
      formData.append("socialLinks.facebook", userData.socialLinks.facebook);
      formData.append("socialLinks.linkedin", userData.socialLinks.linkedin);

      // Only append image if a new one is selected
      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      // Update user data with proper headers for multipart/form-data
      const response = await axios.put(
        `${API_URL}/api/auth/update/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local state and storage with the response
      setUserData(response.data.user);
      localStorage.setItem("profileImage", response.data.user.profileImage);
      notifyA("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      notifyB("Failed to update profile. Please try again.");
    }
  };

  const userIdRef = useRef(null);

  // Function to copy user ID
  const copyUserId = () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    navigator.clipboard.writeText(userId);
    notifyA("User ID copied to clipboard!");
  };


  return (
    <div className="profile-container">
      {userData ? (<div className="profile-content">
        <div className="profile-photo-section">
          <div className="profile-photo">
            <img src={userData.profileImage} alt="Profile" />
          </div>
          <div className="file-input-wrapper">
            <label htmlFor="profilePhotoUpload" className="custom-file-upload">
              Upload Photo
            </label>
            <input
              id="profilePhotoUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="profile-info">
          <h2>Profile Info</h2>
          <form onSubmit={handleFormSubmit}>
            <button type="button" onClick={copyUserId} className="copy-id-button save-button margin-btm-10px">
              Copy User ID
            </button>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Biography</label>
              <ReactQuill
                value={userData.biography}
                onChange={(value) => setUserData((prev) => ({ ...prev, biography: value }))}
                placeholder="Write something about yourself..."
              />
            </div>
            <div className="social-links">
              <h3>Social Links</h3>
              <div className="form-group">
                <label>
                  <i className="fab fa-twitter"></i> Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={userData.socialLinks.twitter}
                  onChange={handleSocialLinkChange}
                  placeholder="Twitter link"
                />
              </div>
              <div className="form-group">
                <label>
                  <i className="fab fa-facebook"></i> Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={userData.socialLinks.facebook}
                  onChange={handleSocialLinkChange}
                  placeholder="Facebook link"
                />
              </div>
              <div className="form-group">
                <label>
                  <i className="fab fa-linkedin"></i> LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={userData.socialLinks.linkedin}
                  onChange={handleSocialLinkChange}
                  placeholder="LinkedIn link"
                />
              </div>
            </div>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </form>
        </div>
      </div>) : (<div>Loading...</div>)}
    </div>
  );
};

export default D_Profile;
