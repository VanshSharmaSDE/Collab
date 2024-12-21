import React, { useState , useEffect } from "react";
import "./Dashboard.css";
import D_Home from "./ChildrenPages/D_Home";
import D_Project from "./ChildrenPages/D_Project";
import D_Invites from "./ChildrenPages/D_Invites";
import D_Chats from "./ChildrenPages/D_Chats";
import D_Profile from "./ChildrenPages/D_Profile";
const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("Dashboard"); // Track active page

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

    // Function to change active page
    const changePage = (page) => {
        setActivePage(page);
        closeSidebar(); // Close sidebar after clicking span link
        window.history.pushState(null, null, "/user/" + page)
    };

    // Function to dynamically render components
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
                        src="https://images.unsplash.com/photo-1731505103716-7ee6fa96dee5?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Profile"
                        className="profile-img"
                    />
                    <div className="profile-name">Vansh Sharma</div>
                </div>
                <nav className="dashboard-nav">
                    <span
                        href="#"
                        className={`dashboard-link ${activePage === "Dashboard" ? "active" : ""}`}
                        onClick={() => changePage("Dashboard")}
                    >
                        Dashboard
                    </span>
                    <span
                        href="#"
                        className={`dashboard-link ${activePage === "Project" ? "active" : ""}`}
                        onClick={() => changePage("Project")}
                    >
                        Project
                    </span>
                    <span
                        href="#"
                        className={`dashboard-link ${activePage === "Invites" ? "active" : ""}`}
                        onClick={() => changePage("Invites")}
                    >
                        Invites
                    </span>
                    <span
                        href="#"
                        className={`dashboard-link ${activePage === "Chats" ? "active" : ""}`}
                        onClick={() => changePage("Chats")}
                    >
                        Chats
                    </span>
                    <span
                        href="#"
                        className={`dashboard-link ${activePage === "Profile" ? "active" : ""}`}
                        onClick={() => changePage("Profile")}
                    >
                        Profile
                    </span>
                    <span href="#" className="dashboard-link" onClick={() => console.log("Logout")}>
                        Logout
                    </span>
                </nav>
            </aside>

            {/* Overlay for Sidebar */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            {/* Main Content */}
            <div className="dashboard-main">{renderPage()}</div>
        </div>
    );
};

export default Dashboard;
