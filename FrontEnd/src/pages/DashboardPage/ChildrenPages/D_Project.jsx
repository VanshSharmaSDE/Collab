import React, { useEffect, useState } from "react";
import "./D_Project.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const D_Project = () => {
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
  const [projects, setProjects] = useState([]); // To store created projects
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false); // Create popup visibility state
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); // Delete popup visibility state
  const [projectName, setProjectName] = useState(""); // Input field for project name
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Selected language option
  const [projectToDelete, setProjectToDelete] = useState(null); // Selected project for deletion

  // Options for language selection
  const languageOptions = [
    "HTML",
    "HTML,CSS",
    "HTML,JavaScript",
    "HTML,CSS,JavaScript",
  ];

  // Function to handle project creation
  const handleCreateProject = () => {
    if (projectName && selectedLanguage) {
      const languages = selectedLanguage;
      const userId = JSON.parse(localStorage.getItem("user")).id;

      // Make an API call to store the project in the database
      axios
        .post(`${API_URL}/api/project/create`, {
          projectName,
          userId,
          languages,
        })
        .then((response) => {
          // Handle success
          setProjects((prevProjects) => [...prevProjects, response.data]); // Append new project from the server
          setIsCreatePopupOpen(false); // Close the popup
          setProjectName(""); // Reset input
          setSelectedLanguage("");
          notifyA("Project created successfully!");
        })
        .catch((err) => {
          console.error("Error creating project:", err);
          alert("Failed to create project. Please try again.");
        });
    } else {
      notifyB("Please fill in all fields!");
    }
  };


  const handleDeleteProject = async () => {
    if (projectToDelete) {
      try {
        const response = await axios.delete(`${API_URL}/api/project/deleteproject/${projectToDelete}`);
        if (response.status === 200) {
          setProjects((prevProjects) =>
            prevProjects.filter((project) => project._id !== projectToDelete)
          );
          notifyA("Project deleted successfully!");
        }
      } catch (error) {
        // console.error("Error deleting project:", error);
        notifyB("Failed to delete project. Please try again.");
      } finally {
        setIsDeletePopupOpen(false);
        setProjectToDelete(null);
      }
    }
  };

  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    axios
      .post(`${API_URL}/api/project/${userId}`)
      .then((response) => setProjects(response.data))
      .catch((error) => {
        console.error("Error fetching projects:", error)
        notifyB("Failed to fetch projects. Please try again.")
      });
  }, []);

  const handleProjectClick = (id) => {
    navigate(`/user/project/${id}`);
  };

  return (
    <div className="project-container">
      {/* Top Header Section */}
      <div className="project-header">
        <h2>Your Projects</h2>
        <button className="create-btn" onClick={() => setIsCreatePopupOpen(true)}>
          + Create Project
        </button>
      </div>

      {/* Display Projects or No Project Message */}
      {projects.length === 0 ? (
        <div className="no-projects">
          <p>No project created yet, create one!</p>
        </div>
      ) : (
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project._id} className="project-item">
              <div onClick={() => handleProjectClick(project._id)}>
                <h3>{project.projectName}</h3>
                <p>Languages: {project.languages}</p>
              </div>
              <button
                className=""
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering project click
                  setProjectToDelete(project._id); // Set the project to delete
                  setIsDeletePopupOpen(true); // Open the delete confirmation popup
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Popup for Creating Project */}
      {isCreatePopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Create Project</h3>
            <div className="popup-field">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="popup-field">
              <label>Language Selection</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">Select Language</option>
                {languageOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="popup-actions">
              <button
                className="popup-btn cancel"
                onClick={() => setIsCreatePopupOpen(false)}
              >
                Cancel
              </button>
              <button className="popup-btn create" onClick={handleCreateProject}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for Deleting Project */}
      {isDeletePopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Delete Project</h3>
            <p className="margin-btm-20px">Are you sure you want to delete this project?</p>
            <div className="popup-actions">
              <button
                className="popup-btn cancel"
                onClick={() => {
                  setIsDeletePopupOpen(false);
                  setProjectToDelete(null);
                }}
              >
                Cancel
              </button>
              <button className="popup-btn delete" onClick={handleDeleteProject}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default D_Project;
