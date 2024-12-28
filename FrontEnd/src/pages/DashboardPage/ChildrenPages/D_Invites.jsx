import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function D_Invites() {
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
  const [invites, setInvites] = useState([]);
  const [projectDetails, setProjectDetails] = useState({});
  const [ownerData, setOwnerData] = useState('');
  const userId = JSON.parse(localStorage.getItem('user')).id;

  useEffect(() => {
    // Fetch user data to get invites
    axios.get(`${API_URL}/api/auth/${userId}`) // Use the new endpoint
      .then(response => {
        setInvites(response.data.invites);
        // Fetch project details for each invite
        response.data.invites.forEach(invite => {
          axios.get(`${API_URL}/api/project/${invite}`, {
            headers: {
              'user-id': userId // Send user ID in headers
            }
          })
            .then(projectResponse => {
              setProjectDetails(prevDetails => ({
                ...prevDetails,
                [invite.projectId]: projectResponse.data
              }));
              axios.get(`${API_URL}/api/auth/${projectResponse.data.owner}`)
                .then(response => { setOwnerData(response.data); })
                .catch(error => {
                  console.error("Error fetching user data:", error)
                  notifyB('Error fetching user data');
                });
            })
            .catch(error => {
              console.error("Error fetching project data:", error)
              notifyB('Error fetching project data');
            });
        });
      })
      .catch(error => {
        console.error("Error fetching user data:", error)
        notifyB('Error fetching user data');
      });
  }, [userId]);

  const handleJoinProject = (projectId) => {
    axios.post(`${API_URL}/api/project/joinProject/${userId}`)
      .then((response) => {
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error joining project:", error);
        notifyB("Failed to join project. Please try again.");
      })
    navigate(`/user/project/${projectId}`)
  };

  return (
    <div>
      <h2 className='invite'>Invitations</h2>
      {invites.length > 0 ? (
        <ul className="project-list">
          {invites.map(invite => {
            const project = projectDetails[invite.projectId];
            return (
              <li key={invite} className="project-item">
                {project ? (
                  <>
                    <span className='margin-btm-10px'>{project.projectName} ---- [ {ownerData.fullName} ] invited you to this project.</span>
                    <button onClick={() => handleJoinProject(invite)}>Join</button>
                  </>
                ) : (
                  <p>Loading details...</p>
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
