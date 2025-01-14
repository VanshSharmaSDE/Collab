import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from '@uiw/codemirror-theme-dracula';
import "./ProjectDetail.css";
import axios from "axios";
import io from 'socket.io-client';
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";

const NewFileModal = ({ isOpen, onClose, onSubmit, fileType }) => {
  const [fileName, setFileName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const fileExtension = fileType === "HTML" ? ".html" :
      fileType === "CSS" ? ".css" : ".js";
    const newFileName = fileName.endsWith(fileExtension) ? fileName : fileName + fileExtension;
    onSubmit(newFileName);
    setFileName("");
    onClose();
  };

  if (!isOpen) return null;

  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New {fileType} File</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder={`Enter file name (e.g., new${fileType === "HTML" ? ".html" :
              fileType === "CSS" ? ".css" : ".js"})`}
          />
          <div className="modal-buttons">
            <button type="submit" className="btn create-btn">Create</button>
            <button type="button" className="btn cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InviteModal = ({ isOpen, onClose, onInvite }) => {
  const [userId, setUserId] = useState("");

  const handleInvite = () => {
    onInvite(userId);
    setUserId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Invite User</h3>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
        />
        <div className="modal-buttons">
          <button type="button" className="btn cancel-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="btn invite-btn" onClick={handleInvite}>Invite</button>
        </div>
      </div>
    </div>
  );
};

const API_URL = import.meta.env.VITE_API_BASE_URL;
const socket = io(`${API_URL}`);

const ProjectDetail = () => {
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

  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("HTML");
  const [activeFile, setActiveFile] = useState("index.html");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [files, setFiles] = useState({
    html: [
      {
        fileName: "index.html",
        content: "<h1>Hello World</h1>"
      }
    ],
    css: [
      {
        fileName: "style.css",
        content: "body { font-family: Arial; }"
      }
    ],
    javascript: [
      {
        fileName: "script.js",
        content: "console.log('Hello World');"
      }
    ]
  });
  const [project, setProject] = useState();
  const userId = JSON.parse(localStorage.getItem('user')).id;
  const currentuser = userId;
  useEffect(() => {
    axios
      .get(`${API_URL}/api/project/${id}`, {
        headers: {
          'user-id': userId // Send user ID in headers
        }
      })
      .then((response) => {
        setProject(response.data);
        // Set files state if project.files exists
        if (response.data && response.data.files) {
          setFiles(response.data.files);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error)
        notifyB("Error fetching projects");
      });
  }, [id]);

  const createNewFile = (newFileName) => {
    const fileExtension = newFileName.split('.').pop().toLowerCase();
    const fileType = fileExtension === 'html' ? 'html' :
      fileExtension === 'css' ? 'css' : 'javascript';
  
    const newFile = {
      fileName: newFileName,
      content: "" // Empty content for new file
    };
  
    setFiles(prev => ({
      ...prev,
      [fileType]: [
        ...prev[fileType],
        newFile
      ]
    }));
  
    axios.post(`${API_URL}/api/project/${id}/addfile`, {
      fileType,
      fileName: newFileName,
      content: newFile.content
    }, {
      headers: {
        'user-id': userId
      }
    })
      .then(response => {
        console.log("New file created successfully:", response.data);
        notifyA("New file created successfully");
      })
      .catch(error => {
        notifyB("Error creating new file");
      });
  
    setActiveTab(fileType === 'javascript' ? 'JavaScript' : fileType.toUpperCase());
    setActiveFile(newFileName);
  };
  

  const handleFileContent = (content, fileType) => {
    if (fileType === 'html') {
      const cssLinks = Array.from(content.matchAll(/<link[^>]*href=["'](.+?)["'][^>]*>/g));
      const jsLinks = Array.from(content.matchAll(/<script[^>]*src=["'](.+?)["'][^>]*>/g));

      cssLinks.forEach(([_, href]) => {
        if (href.endsWith('.css') &&
          !files.css.some(file => file.fileName === href)) {
          setFiles(prev => ({
            ...prev,
            css: [
              ...prev.css,
              {
                fileName: href,
                content: "/* Generated from HTML link */"
              }
            ]
          }));
        }
      });

      jsLinks.forEach(([_, src]) => {
        if (src.endsWith('.js') &&
          !files.javascript.some(file => file.fileName === src)) {
          setFiles(prev => ({
            ...prev,
            javascript: [
              ...prev.javascript,
              {
                fileName: src,
                content: "// Generated from HTML script tag"
              }
            ]
          }));
        }
      });
    }

    updateContent(content);
  };


  useEffect(() => { 
    // Join project room when component mounts
    socket.emit('join_project', { projectId: id, userId });

    // Listen for project-specific updates
    socket.on('project_user_update', (users) => {
      setOnlineUsers(users);
      notifyA(`${users.length} users online`);
    });

    socket.on('project_code_update', ({ fileType, fileName, content }) => {
      // console.log('Received code update:', { fileType, fileName, content });
      notifyA("Code updated successfully by another user");
      setFiles(prev => ({
        ...prev,
        [fileType]: prev[fileType].map(file =>
          file.fileName === fileName ? { ...file, content } : file
        )
      }));
    });

    return () => {
      socket.emit('leave_project', { projectId: id, userId });
      socket.off('project_user_update');
      socket.off('project_code_update');
    };
  }, [id, userId]);

  // Update the save function
  const saveFileContent = () => {
    const fileType = activeTab.toLowerCase();
    const currentFile = files[fileType].find(file => file.fileName === activeFile);

    if (currentFile) {
      // Emit the code change first for immediate update
      socket.emit('project_code_change', {
        projectId: id,
        userId,
        fileType,
        fileName: currentFile.fileName,
        content: currentFile.content
      });

      // Then save to database
      axios.put(`${API_URL}/api/project/${id}/updatefile`, {
        fileType,
        fileName: currentFile.fileName,
        content: currentFile.content
      }, {
        headers: {
          'user-id': userId
        }
      })
        .then(response => {
          // console.log("File content updated successfully:", response.data);
          notifyA("File content updated successfully");
        })
        .catch(error => {
          // console.error("Error updating file content:", error);
          notifyB("Error updating file content");
        });
    }
  };


  const saveAllFiles = () => {
    Object.keys(files).forEach(fileType => {
      files[fileType].forEach(file => {
        // First emit the code change for immediate update
        socket.emit('project_code_change', {
          projectId: id,
          userId,
          fileType,
          fileName: file.fileName,
          content: file.content
        });

        // Then save to database
        axios.put(`${API_URL}/api/project/${id}/updatefile`, {
          fileType,
          fileName: file.fileName,
          content: file.content
        }, {
          headers: {
            'user-id': userId
          }
        })
          .then(response => {
            notifyA(`File ${file.fileName} updated successfully`);
          })
          .catch(error => {
            notifyB(`Error updating file ${file.fileName}`);
          });
      });
    });
  };



  const getCurrentContent = () => {
    const fileType = activeTab.toLowerCase();
    const currentFile = files[fileType].find(file => file.fileName === activeFile);
    return currentFile ? currentFile.content : "";
  };

  const updateContent = (newContent) => {
    const fileType = activeTab.toLowerCase();
    setFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].map(file =>
        file.fileName === activeFile
          ? { ...file, content: newContent }
          : file
      )
    }));
    // Emit code changes to the preview window
    socket.emit("live_preview_update", {
      projectId: id,
      html: files.html.map(file => file.content).join("\n"),
      css: files.css.map(file => file.content).join("\n"),
      javascript: files.javascript.map(file => file.content).join("\n"),
    });
  };

  let previewWindow = null;

  const showPreview = () => {
    if (!previewWindow || previewWindow.closed) {
      previewWindow = window.open("", "LivePreview", "width=800,height=600");
      previewWindow.document.write("<html><head></head><body></body></html>");
      previewWindow.document.close();
    }
    updatePreview();
  };

  useEffect(() => {
    socket.on("live_preview_update", ({ html, css, javascript }) => {
      if (previewWindow && !previewWindow.closed) {
        const combinedCode = `
          <html>
            <head>
              <style>${css}</style>
            </head>
            <body>
              ${html}
              <script>${javascript}</script>
            </body>
          </html>
        `;
        previewWindow.document.open();
        previewWindow.document.write(combinedCode);
        previewWindow.document.close();
      }
    });

    return () => {
      socket.off("live_preview_update");
    };
  }, []);

  const updatePreview = () => {
    if (previewWindow && !previewWindow.closed) {
      const combinedCode = `
        <html>
          <head>
            <style>${files.css.map(file => file.content).join("\n")}</style>
          </head>
          <body>
            ${files.html.map(file => file.content).join("\n")}
            <script>${files.javascript.map(file => file.content).join("\n")}</script>
          </body>
        </html>
      `;
      previewWindow.document.open();
      previewWindow.document.write(combinedCode);
      previewWindow.document.close();
    }
  };

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/user/Project');
  };

  const inviteUser = (userId) => {
    axios.post(`${API_URL}/api/project/${id}/invite`, { inviteUserId: userId })
      .then(response => {
        // console.log("User invited successfully:", response.data);
        notifyA("User invited successfully");

        // Call the new API to add the project ID to the user's invites
        axios.post(`${API_URL}/api/project/${id}/add-invite`, { userId })
          .then(res => {
            // console.log("Project added to user's invites:", res.data);
            // notifyA("Project added to user's invites");
          })
          .catch(err => {
            // console.error("Error adding project to user's invites:", err);
            notifyB("Error adding project to user's invites");
          });

        // Optionally update the project state to reflect the new invite
        setProject(prev => ({
          ...prev,
          invitedUsers: [...prev.invitedUsers, userId]
        }));
      })
      .catch(error => {
        // console.error("Error inviting user:", error);
        notifyB("Error inviting user");
      });
  };

  const [onlineUserName, setOnlineUserName] = useState();
  useEffect(() => {
    onlineUsers.map(userId => {
      if (userId !== currentuser) {
        axios.get(`${API_URL}/api/auth/${userId}`,)
          .then(res => {
            setOnlineUserName(res.data.fullName);
            notifyA(`${res.data.fullName} is Joined the project`);
          })
          .catch(err => {
            // console.error("Error adding project to user's invites:", err);
            notifyB("Error fetching user name");
          });
      }
    })
  }, [onlineUsers])


  return (
    <>
      {project ? (<div className="project-detail-container">
        <div className="project-detail-header">
          <h2><i className="ri-arrow-left-line" onClick={() => handleBackClick()}></i>{project.projectName}</h2>
          <div className="header-buttons">
            {project.owner === userId && (<button className="btn invite-btn" onClick={() => setIsInviteModalOpen(true)}>Invite</button>)}
            <button className="btn save-btn" onClick={saveFileContent}>
              Save
            </button>
            <button className="btn save-btn" onClick={saveAllFiles}>
              Save All
            </button>
            <button className="btn new-file-btn" onClick={() => setIsModalOpen(true)}>
              New File
            </button>
            <button className="btn preview-btn" onClick={showPreview}>
              Show Preview
            </button>
          </div>
        </div>

        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={inviteUser}
        />

        <NewFileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={createNewFile}
          fileType={activeTab}
        />

        {/* Online user section  */}
        <div className="online-users">
          <h3> Online Users ({onlineUsers.length})</h3>
          <ul>
            {onlineUsers.map(userId => (
              <li key={userId} className="online-user">
                {userId === currentuser ? 'You' : onlineUserName}
                <span className="online-indicator"></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="tab-buttons">
          {project.languages.map((lang) => (
            <button
              key={lang}
              className={`tab-btn ${activeTab === lang ? "active" : "dimmed"}`}
              onClick={() => {
                setActiveTab(lang);
                const fileType = lang.toLowerCase();
                setActiveFile(files[fileType][0].fileName);
              }}
            >
              {lang}
            </button>
          ))}
        </div>



        <div className="file-selector">
          <select
            value={activeFile}
            onChange={(e) => setActiveFile(e.target.value)}
          >
            {files[activeTab.toLowerCase()].map(file => (
              <option key={file.fileName} value={file.fileName}>
                {file.fileName}
              </option>
            ))}
          </select>
        </div>

        <div className="code-editor">
          {activeTab === "HTML" && (
            <CodeMirror
              value={getCurrentContent()}
              extensions={[html()]}
              onChange={(content) => handleFileContent(content, 'html')}
              theme={dracula}
            />
          )}
          {activeTab === "CSS" && (
            <CodeMirror
              value={getCurrentContent()}
              extensions={[css()]}
              onChange={updateContent}
              theme={dracula}
            />
          )}
          {activeTab === "JavaScript" && (
            <CodeMirror
              value={getCurrentContent()}
              extensions={[javascript()]}
              onChange={updateContent}
              theme={dracula}
            />
          )}
        </div>
      </div>) : <Loader></Loader>}
    </>
  );
};

export default ProjectDetail;
