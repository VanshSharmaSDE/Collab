import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function D_Invites() {
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [projectDetails, setProjectDetails] = useState({});
  const userId = JSON.parse(localStorage.getItem('user')).id;

  useEffect(() => {
    // Fetch user data to get invites
    axios.get(`http://localhost:5000/api/auth/${userId}`) // Use the new endpoint
      .then(response => {
        setInvites(response.data.invites);
        // Fetch project details for each invite
        response.data.invites.forEach(invite => {
          axios.get(`http://localhost:5000/api/project/${invite}`)
            .then(projectResponse => {
              setProjectDetails(prevDetails => ({
                ...prevDetails,
                [invite.projectId]: projectResponse.data
              }));
            })
            .catch(error => console.error("Error fetching project data:", error));
        });
      })
      .catch(error => console.error("Error fetching user data:", error));
  }, [userId]);

  const handleJoinProject = (projectId) => {
    // axios.post(`http://localhost:5000/api/project/${projectId}/join`, { userId })
    //   .then(response => {
    //     console.log("Joined project successfully:", response.data);
    //     // Optionally update the invites state to remove the joined project
    //     setInvites(invites.filter(invite => invite.projectId !== projectId));
    //   })
    //   .catch(error => console.error("Error joining project:", error));
    navigate(`/user/project/${projectId}`)
  };

  return (
    <div>
      <h2>Invitations</h2>
      {invites.length > 0 ? (
        <ul className="project-list">
          {invites.map(invite => {
            const project = projectDetails[invite.projectId];
            return (
              <li key={invite} className="project-item">
                {project ? (
                  <>
                    <p>{project.projectName} - {project.ownerName} invited you to this project.</p>
                    <button onClick={() => handleJoinProject(invite)} className='btn'>Join</button>
                  </>
                ) : (
                  <p>Loading project details...</p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className='project-list'>No invitations at the moment.</p>
      )}
    </div>
  );
}

export default D_Invites;
