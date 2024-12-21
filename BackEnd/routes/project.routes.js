const router = require('express').Router();
const projectController = require('../controllers/project.controller');

router.post('/create', projectController.create);
router.post('/:userId', projectController.fetchProject);
router.get('/:projectId', projectController.getProjectById);
router.post('/:projectId/invite', projectController.invite);
router.put('/:projectId/updatefile', projectController.updateFileContent);
router.post('/:projectId/addfile', projectController.addFile);
router.delete('/:projectId/deletefile', projectController.deleteFile);
router.post('/:projectId/add-invite', projectController.addProjectToUserInvites);

module.exports = router;