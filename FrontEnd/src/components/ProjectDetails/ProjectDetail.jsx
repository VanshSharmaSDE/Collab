import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from '@uiw/codemirror-theme-dracula';
import "./ProjectDetail.css";
import axios from "axios";

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


const ProjectDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("HTML");
  const [activeFile, setActiveFile] = useState("index.html");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/project/${id}`)
      .then((response) => {
        setProject(response.data);
        // Set files state if project.files exists
        if (response.data && response.data.files) {
          setFiles(response.data.files);
        }
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, [id]);

  const createNewFile = (newFileName) => {
    const fileExtension = newFileName.split('.').pop().toLowerCase();
    const fileType = fileExtension === 'html' ? 'html' :
      fileExtension === 'css' ? 'css' : 'javascript';

    setFiles(prev => ({
      ...prev,
      [fileType]: [
        ...prev[fileType],
        {
          fileName: newFileName,
          content: "" // Empty content for new file
        }
      ]
    }));
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

  const saveFileContent = () => {
    const fileType = activeTab.toLowerCase();
    const currentFile = files[fileType].find(file => file.fileName === activeFile);

    if (currentFile) {
      axios.put(`http://localhost:5000/api/project/${id}/updatefile`, {
        fileType,
        fileName: currentFile.fileName,
        content: currentFile.content
      })
        .then(response => {
          console.log("File content updated successfully:", response.data);
        })
        .catch(error => {
          console.error("Error updating file content:", error);
        });
    }
  };

  const saveAllFiles = () => {
    Object.keys(files).forEach(fileType => {
      files[fileType].forEach(file => {
        axios.put(`http://localhost:5000/api/project/${id}/updatefile`, {
          fileType,
          fileName: file.fileName,
          content: file.content
        })
          .then(response => {
            console.log(`File ${file.fileName} updated successfully:`, response.data);
          })
          .catch(error => {
            console.error(`Error updating file ${file.fileName}:`, error);
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
  };

  const showPreview = () => {
    const previewWindow = window.open();
    const combinedCode = `
      <html>
        <head>
          ${files.css.map(file => `<style>${file.content}</style>`).join('\n')}
        </head>
        <body>
          ${files.html.map(file => file.content).join('\n')}
          ${files.javascript.map(file => `<script>${file.content}</script>`).join('\n')}
        </body>
      </html>
    `;
    previewWindow.document.write(combinedCode);
    previewWindow.document.close();
  };


  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/user/Project');
  };

  const inviteUser = (userId) => {
    axios.post(`http://localhost:5000/api/project/${id}/invite`, { inviteUserId: userId })
      .then(response => {
        console.log("User invited successfully:", response.data);

        // Call the new API to add the project ID to the user's invites
        axios.post(`http://localhost:5000/api/project/${id}/add-invite`, { userId })
          .then(res => {
            console.log("Project added to user's invites:", res.data);
          })
          .catch(err => {
            console.error("Error adding project to user's invites:", err);
          });

        // Optionally update the project state to reflect the new invite
        setProject(prev => ({
          ...prev,
          invitedUsers: [...prev.invitedUsers, userId]
        }));
      })
      .catch(error => {
        console.error("Error inviting user:", error);
      });
  };


  return (
    <>
      {project ? (<div className="project-detail-container">
        <div className="project-detail-header">
          <h2><i className="ri-arrow-left-line" onClick={() => handleBackClick()}></i>{project.projectName}</h2>
          <div className="header-buttons">
            <button className="btn invite-btn" onClick={() => setIsInviteModalOpen(true)}>Invite</button>
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
      </div>) : (<>Loading</>)}
    </>
  );
};

export default ProjectDetail;
