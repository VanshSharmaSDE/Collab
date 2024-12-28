// middleware/projectAuth.middleware.js
const Project = require('../models/project.model');

const verifyProjectAccess = async (req, res, next) => {
    const userId = req.headers['user-id'];
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user is the owner or an invited user
        if (project.owner.toString() === userId || project.invitedUsers.includes(userId)) {
            return next();
        }

        return res.status(403).json({ message: 'Access denied' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = verifyProjectAccess;
