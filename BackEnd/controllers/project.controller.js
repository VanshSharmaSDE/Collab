const Project = require("../models/project.model");
const User = require("../models/user.model");
const Notification = require('../models/notification.model')


exports.create = async (req, res) => {
  const { userId, projectName, languages } = req.body;

  try {

    // Convert the 'languages' string to an array using split
    const languagesArray = languages.split(',');
    console.log(languagesArray)

    const project = new Project({
      projectName,
      owner: userId,
      languages: languagesArray,
    });

    const savedProject = await project.save();

    // Add project to user's projects array
    await User.findByIdAndUpdate(userId, {
      $push: { projects: savedProject._id },
    });

    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get projects for a specific user
exports.fetchProject = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.params.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Invite a user to a project
exports.invite = async (req, res) => {
  const { projectId } = req.params;
  const { inviteUserId } = req.body;
  const projectOwner = await Project.findById(projectId).select('owner');

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $push: { invitedUsers: inviteUserId } },
      { new: true }
    );
    console.log(projectOwner.owner)
    const notification =  new Notification({
      recipient: inviteUserId,
      sender: projectOwner.owner,
      type: 'invite',
      message: `You have been invited to join project`
    });
    await notification.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific project by projectId
exports.getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update file content for a project
exports.updateFileContent = async (req, res) => {
  const { projectId } = req.params;
  const { fileType, fileName, content } = req.body;

  try {
    // Validate file type
    if (!['html', 'css', 'javascript'].includes(fileType.toLowerCase())) {
      return res.status(400).json({ error: "Invalid file type. Must be html, css, or javascript." });
    }

    // Construct the query to update the specific file content
    const updateQuery = {
      $set: {
        [`files.${fileType}.$[file].content`]: content
      }
    };

    // Define array filters to match the specific file by fileName
    const options = {
      arrayFilters: [{ "file.fileName": fileName }],
      new: true // Return the updated document
    };

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateQuery,
      options
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.json({
      message: "File content updated successfully",
      updatedFile: updatedProject.files[fileType].find(file => file.fileName === fileName)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new file to a project
exports.addFile = async (req, res) => {
  const { projectId } = req.params;
  const { fileType, fileName, content } = req.body;

  try {
    if (!['html', 'css', 'javascript'].includes(fileType.toLowerCase())) {
      return res.status(400).json({ error: "Invalid file type. Must be html, css, or javascript." });
    }

    // Use findOneAndUpdate instead of findById and manual save
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      { 
        $push: { 
          [`files.${fileType}`]: {
            fileName: fileName,
            content: content || ''
          }
        }
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(201).json({
      message: "File added successfully",
      updatedProject: updatedProject
    });

  } catch (err) {
    console.error("Error saving file:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a file from a project
exports.deleteFile = async (req, res) => {
  const { projectId } = req.params;
  const { fileType, fileName } = req.body;

  try {
    // Validate file type
    if (!['html', 'css', 'javascript'].includes(fileType.toLowerCase())) {
      return res.status(400).json({ error: "Invalid file type. Must be html, css, or javascript." });
    }

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Find the file index
    const fileIndex = project.files[fileType].findIndex(
      file => file.fileName === fileName
    );

    if (fileIndex === -1) {
      return res.status(404).json({
        error: `File ${fileName} not found in ${fileType} files.`
      });
    }

    // Remove the file
    project.files[fileType].splice(fileIndex, 1);

    // Save the updated project
    await project.save();

    res.json({
      message: "File deleted successfully",
      deletedFileName: fileName
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add invites user 
exports.addProjectToUserInvites = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { invites: projectId } }, // Use $addToSet to avoid duplicates
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "Project added to user's invites successfully.", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the project exists
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Delete the project
    await Project.findByIdAndDelete(id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { invitedUsers: userId }
      ]
    });

    const user = await User.findById(userId);

    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.active).length,
      pendingInvites: user.invites.length,
      totalCollaborators: projects.reduce(
        (acc, project) => acc + (project.invitedUsers?.length || 0), 0
      )
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchProjectsAndUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const { userId } = req.params;

    // Search projects
    const projects = await Project.find({
      $or: [
        { owner: userId },
        { invitedUsers: userId }
      ],
      projectName: { $regex: query, $options: 'i' }
    });

    // Search users using existing user model
    const users = await User.find({
      fullName: { $regex: query, $options: 'i' },
      _id: { $ne: userId }
    }).select('fullName profileImage');

    res.json({
      projects,
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinProject = async (req, res) => {
  const { userId } = req.params;
  await Notification.deleteOne({ recipient: userId, type: 'invite', message: `You have been invited to join project` });
  res.json({ message: "Notification deleted successfully" });
}
