const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');

router.post('/', notificationController.createNotification);
router.get('/:userId', notificationController.getNotifications);
router.put('/:notificationId/read', notificationController.markAsRead);

module.exports = router;
