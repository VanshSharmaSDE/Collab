const Project = require("../models/project.model");
const User = require("../models/user.model");

// Create a new project
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

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $push: { invitedUsers: inviteUserId } },
      { new: true }
    );
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
    // Validate file type
    if (!['html', 'css', 'javascript'].includes(fileType.toLowerCase())) {
      return res.status(400).json({ error: "Invalid file type. Must be html, css, or javascript." });
    }

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Check if file with same name already exists
    if (project.files[fileType].some(file => file.fileName === fileName)) {
      return res.status(400).json({
        error: `File with name ${fileName} already exists in ${fileType} files.`
      });
    }

    // Add new file
    const newFile = {
      fileName: fileName,
      content: content || '' // Use empty string if no content provided
    };

    project.files[fileType].push(newFile);

    // Save the updated project
    const updatedProject = await project.save();

    res.status(201).json({
      message: "File added successfully",
      newFile: newFile
    });

  } catch (err) {
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
