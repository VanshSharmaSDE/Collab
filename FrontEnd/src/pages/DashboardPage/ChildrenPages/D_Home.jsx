
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './D_Home.css';
import { useNavigate } from 'react-router-dom';

function D_Home() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingInvites: 0,
    totalCollaborators: 0
  });

  const navigate = useNavigate();

  const handleProjectClick = (projectId) => {
    navigate(`/user/project/${projectId}`);
  };

  const currentUser = JSON.parse(localStorage.getItem("user")).id;

  const notifyError = (e) => toast.error(e, {
    style: {
      borderRadius: '10px',
      background: '#21262d',
      color: '#fff',
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user's projects using your existing endpoint
        const projectsResponse = await axios.post(
          `${API_URL}/api/project/${currentUser}`
        );

        // Fetch user data using your existing endpoint
        const userResponse = await axios.get(
          `${API_URL}/api/auth/${currentUser}`
        );

        // Calculate statistics from the responses
        setStats({
          totalProjects: projectsResponse.data.length,
          activeProjects: projectsResponse.data.filter(p => p.active).length,
          pendingInvites: userResponse.data.invites.length,
          totalCollaborators: projectsResponse.data.reduce(
            (acc, project) => acc + (project.invitedUsers?.length || 0), 0
          )
        });

      } catch (error) {
        notifyError('Error fetching dashboard data');
      }
    };

    fetchDashboardData();
  }, [currentUser.id]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    users: [],
    projects: []
  });
  const [showResults, setShowResults] = useState(false);

  // Add search handler function
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await axios.get(
          `${API_URL}/api/project/search/${currentUser}?query=${query}`
        );
        // console.log('Search results:', response.data);
        setSearchResults({
          projects: response.data.projects,
          users: response.data.users
        });
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error); // Add this to debug
        notifyError('No Projects or Users found');
      }
    } else {
      setSearchResults({ users: [], projects: [] });
      setShowResults(false);
    }
  };

  const profileImage = localStorage.getItem("profileImage");

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notifications/${currentUser}`);
        const notificationsWithUsernames = await Promise.all(response.data.map(async (notification) => {
          const userResponse = await axios.get(`${API_URL}/api/auth/${notification.sender}`);
          return {
            ...notification,
            username: userResponse.data.fullName
          };
        }));
        setNotifications(notificationsWithUsernames);
      } catch (error) {
        toast.error('Error fetching notifications');
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;


  return (
    <>
      <div className="dashboard-search-notification-profile">
        <div className="dashboard-search">
          <i className="ri-search-eye-line"></i>
          <input
            type="text"
            placeholder='Search Projects...'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {showResults && (searchResults.projects.length > 0 || searchResults.users.length > 0) && (
            <div className="search-results-d">
              {searchResults.projects.length > 0 && (
                <div className="search-section">
                  <h4>Projects</h4>
                  {searchResults.projects.map(project => (
                    <div key={project._id} className="search-result-item" onClick={() => handleProjectClick(project._id)}>
                      <i className="ri-folder-line"></i>
                      <span>{project.projectName}</span>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.users.length > 0 && (
                <div className="search-section">
                  <h4>Users</h4>
                  {searchResults.users.map(user => (
                    <div key={user._id} className="search-result-item">
                      <img src={user.profileImage || "https://via.placeholder.com/40"} alt={user.fullName} />
                      <span>{user.fullName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="dashboard-notification-profile">
          <div className="dashboard-notification" onClick={handleNotificationClick}>
            <i className="ri-notification-3-line"></i>
            {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
          </div>
          {showNotifications && (
            <div className="notification-list">
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map(notification => (
                  <div key={notification._id} className={`notification-item ${notification.isRead ? '' : 'unread'}`}>
                    <p>{notification.message} from {notification.username}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-header">
        <h1>Hi, Welcome back</h1>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="ri-projector-line"></i>
          </div>
          <div className="stat-info">
            <h2>Total Projects: </h2>
            <p>{stats.totalProjects}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="ri-character-recognition-fill"></i>
          </div>
          <div className="stat-info">
            <h2>Active Projects: </h2>
            <p>{stats.activeProjects}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="ri-pass-pending-fill"></i>
          </div>
          <div className="stat-info">
            <h2>Pending Invites: </h2>
            <p>{stats.pendingInvites}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="ri-layout-masonry-line"></i>
          </div>
          <div className="stat-info">
            <h2>Total Collaborators: </h2>
            <p>{stats.totalCollaborators}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3><i className="ri-git-commit-line"></i> Updated Project Structure</h3>
          <div className="chart-placeholder"></div>
        </div>
        <div className="chart-card">
          <h3><i className="ri-bar-chart-box-ai-line"></i> Collaborator Stats</h3>
          <div className="chart-placeholder"></div>
        </div>
      </div>
    </>
  )
}

export default D_Home
