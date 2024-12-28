import React, { useState, useEffect } from "react";
import "./DashBoard.css";
import D_Home from "./ChildrenPages/D_Home";
import D_Project from "./ChildrenPages/D_Project";
import D_Invites from "./ChildrenPages/D_Invites";
import D_Chats from "./ChildrenPages/D_Chats";
import D_Profile from "./ChildrenPages/D_Profile";
import axios from "axios"; 
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
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
    const [profileImage, setProfileImage] = useState("");
    const user = JSON.parse(localStorage.getItem("user")) || {};
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem("user")).id;
                const response = await axios.get(`${API_URL}/api/auth/${userId}`);
                setProfileImage(response.data.profileImage);
            } catch (error) {
                // console.error("Error fetching user data:", error);
                notifyB("Error fetching user data");
            }
        };
        fetchUserData();
    }, []);



    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("Dashboard");
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    // Get active page from URL
    useEffect(() => {
        const path = window.location.pathname.split("/");
        const page = path[path.length - 1] || "Dashboard";
        setActivePage(page.split("?")[0]); // Remove any query params
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        document.body.style.overflow = !isSidebarOpen ? "hidden" : "auto";
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        document.body.style.overflow = "auto";
    };

    const changePage = (page) => {
        setActivePage(page);
        closeSidebar(); // Close sidebar after clicking span link
        window.history.pushState(null, null, "/user/" + page);
    };

    const renderPage = () => {
        switch (activePage) {
            case "Dashboard":
                return <D_Home />;
            case "Project":
                return <D_Project />;
            case "Invites":
                return <D_Invites />;
            case "Chats":
                return <D_Chats />;
            case "Profile":
                return <D_Profile />;
            default:
                return <D_Home />;
        }
    };

    // Open logout confirmation popup
    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    // Close logout confirmation popup
    const closeLogoutPopup = () => {
        setShowLogoutPopup(false);
    };

    // Handle actual logout
    const handleLogoutConfirm = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("profileImage");
        setShowLogoutPopup(false);
        navigate("/");
        notifyA("Logged out successfully");
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
            {/* Hamburger Button */}
            <div
                className={`hamburger ${isSidebarOpen ? "active" : ""}`}
                onClick={toggleSidebar}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
                <a href="/" className="dashboard-logo">
                    Collab
                </a>
                <div className="dashboard-profile">
                    <img
                        src={profileImage || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="profile-img"
                    />
                    <div className="profile-name">{user.fullName}</div>
                </div>
                <nav className="dashboard-nav">
                    <span
                        className={`dashboard-link ${activePage === "Dashboard" ? "active" : ""}`}
                        onClick={() => changePage("Dashboard")}
                    >
                        Dashboard
                    </span>
                    <span
                        className={`dashboard-link ${activePage === "Project" ? "active" : ""}`}
                        onClick={() => changePage("Project")}
                    >
                        Project
                    </span>
                    <span
                        className={`dashboard-link ${activePage === "Invites" ? "active" : ""}`}
                        onClick={() => changePage("Invites")}
                    >
                        Invites
                    </span>
                    <span
                        className={`dashboard-link ${activePage === "Chats" ? "active" : ""}`}
                        onClick={() => changePage("Chats")}
                    >
                        Chats
                    </span>
                    <span
                        className={`dashboard-link ${activePage === "Profile" ? "active" : ""}`}
                        onClick={() => changePage("Profile")}
                    >
                        Profile
                    </span>
                    <span href="#" className="dashboard-link" onClick={handleLogoutClick}>
                        Logout
                    </span>
                </nav>
            </aside>

            {/* Overlay for Sidebar */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            {/* Main Content */}
            <div className="dashboard-main">{renderPage()}</div>

            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Confirm Logout</h3>
                        <p className="popup-field">Are you sure you want to logout?</p>
                        <div className="popup-actions">
                            <button className="popup-btn cancel" onClick={closeLogoutPopup}>
                                Cancel
                            </button>
                            <button className="popup-btn create" onClick={handleLogoutConfirm}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
