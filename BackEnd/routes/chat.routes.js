// routes/chat.routes.js
const router = require('express').Router();
const chatController = require('../controllers/chat.controller');

router.get('/search/:userId', chatController.searchUsers);
router.get('/:userId', chatController.getChats);
router.get('/:userId/:otherUserId', chatController.getOrCreateChat);

module.exports = router;
