import React, { useEffect, useState } from "react";
import "./D_Project.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const D_Project = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]); // To store created projects
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility state
  const [projectName, setProjectName] = useState(""); // Input field for project name
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Selected language option

  // Options for language selection
  const languageOptions = [
    "HTML",
    "CSS",
    "JavaScript",
    "HTML,CSS",
    "HTML,JavaScript",
    "HTML,CSS,JavaScript",
  ];

  // Function to handle project creation
  const handleCreateProject = () => {
    if (projectName && selectedLanguage) {
      
      const languages = selectedLanguage;

      // Make an API call to store the project in the database
      axios
        .post("http://localhost:5000/api/project/create", {
          projectName,userId,languages
        })
        .then((response) => {
          // Handle success
          setProjects((prevProjects) => [...prevProjects, response.data]); // Append new project from the server
          setIsPopupOpen(false); // Close the popup
          setProjectName(""); // Reset input
          setSelectedLanguage("");
          alert("Project created successfully!");
        })
        .catch((err) => {
          console.error("Error creating project:", err);
          alert("Failed to create project. Please try again.");
        });
    } else {
      alert("Please fill in all fields!");
    }
  };


  const handleProjectClick = (id) => {
    navigate(`/user/project/${id}`);
  };

  const userId = JSON.parse(localStorage.getItem('user')).id;
  useEffect(() => {
    axios
      .post(`http://localhost:5000/api/project/${userId}`)
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div className="project-container">
      {/* Top Header Section */}
      <div className="project-header">
        <h2>Your Projects</h2>
        <button className="create-btn" onClick={() => setIsPopupOpen(true)}>
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
            <li key={project._id} className="project-item"
              onClick={() => handleProjectClick(project._id)}>
              <div>
                <h3>{project.projectName}</h3>
                <p>Languages: {project.languages}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Popup for Creating Project */}
      {isPopupOpen && (
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
              <button className="popup-btn cancel" onClick={() => setIsPopupOpen(false)}>
                Cancel
              </button>
              <button className="popup-btn create" onClick={handleCreateProject}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default D_Project;
