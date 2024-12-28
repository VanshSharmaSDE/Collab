// controllers/chat.controller.js
const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const users = await User.find({
            fullName: { $regex: query, $options: 'i' },
            _id: { $ne: req.params.userId }
        }).select('fullName profileImage');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.params.userId
        })
            .populate('participants', 'fullName profileImage')
            .populate('messages.sender', 'fullName profileImage');
            await Notification.deleteOne({ recipient: req.params.userId, type: 'message', message: `New message` });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrCreateChat = async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;

        let chat = await Chat.findOne({
            participants: { $all: [userId, otherUserId] }
        })
            .populate('participants', 'fullName profileImage')
            .populate('messages.sender', 'fullName profileImage');

        if (!chat) {
            chat = new Chat({
                participants: [userId, otherUserId],
                messages: []
            });
            await chat.save();
            chat = await chat.populate('participants', 'fullName profileImage');
        }

        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
