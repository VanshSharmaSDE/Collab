// routes/project.routes.js
const router = require('express').Router();
const projectController = require('../controllers/project.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const verifyProjectAccess = require('../middleware/projectAuth.middleware');

router.post('/create', projectController.create);
router.post('/:userId', projectController.fetchProject);
router.get('/:projectId', verifyProjectAccess, projectController.getProjectById);
router.post('/:projectId/invite', projectController.invite);
router.put('/:projectId/updatefile', projectController.updateFileContent);
router.post('/:projectId/addfile', projectController.addFile);
router.delete('/:projectId/deletefile', projectController.deleteFile);
router.post('/:projectId/add-invite', projectController.addProjectToUserInvites);
router.delete('/deleteproject/:id', projectController.deleteProject);
router.get('/dashboard-stats/:userId', projectController.getDashboardStats);
router.get('/search/:userId', projectController.searchProjectsAndUsers);
router.post('/joinProject/:userId', projectController.joinProject);


module.exports = router;
