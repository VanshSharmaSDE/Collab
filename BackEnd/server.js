// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const chatRoutes = require('./routes/chat.routes');
const path = require("path");
const http = require('http');
const { Server } = require('socket.io');
const Chat = require('./models/chat.model');
const Project = require('./models/project.model');
const notificationsRoutes = require('./routes/notification.routes');
const Notification = require('./models/notification.model');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create HTTP server
const server = http.createServer(app);
const projectRooms = new Map();

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: `${process.env.CLIENT_URL}`,
    methods: ["GET", "POST"]
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationsRoutes);

// Connect to database
connectDB();

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  // console.log('User connected:', socket.id);

  socket.on('user_connected', (userId) => {
    connectedUsers.set(userId, socket.id);
  });


  socket.on('send_message', async ({ chatId, message, senderId, receiverId }) => {
    try {
      // console.log('Message received:', { chatId, message, senderId, receiverId });

      const chat = await Chat.findById(chatId);
      if (chat) {
        const newMessage = {
          sender: senderId,
          content: message,
          timestamp: new Date()
        };

        chat.messages.push(newMessage);
        await chat.save();

        const notification = new Notification({
          recipient: receiverId,
          sender: senderId,
          type: 'message',
          message: `New message`
        });
        await notification.save();

        // Populate the sender information for the new message
        const populatedChat = await Chat.findById(chatId)
          .populate('messages.sender', 'fullName profileImage')
          .populate('participants', 'fullName profileImage');

        const populatedMessage = populatedChat.messages[populatedChat.messages.length - 1];

        // Send to both receiver and sender
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', {
            chatId,
            message: populatedMessage,
            chat: populatedChat // Send the entire updated chat
          });
        }

        // Always emit back to sender
        socket.emit('receive_message', {
          chatId,
          message: populatedMessage,
          chat: populatedChat // Send the entire updated chat
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});


io.on('connection', (socket) => {
  // console.log('User connected:', socket.id);

  socket.on('join_project', ({ projectId, userId }) => {
    socket.join(projectId);

    if (!projectRooms.has(projectId)) {
      projectRooms.set(projectId, new Set());
    }
    projectRooms.get(projectId).add(userId);

    // Broadcast updated user list to all clients in the project
    io.to(projectId).emit('project_user_update', Array.from(projectRooms.get(projectId)));
  });

  socket.on('project_code_change', ({ projectId, userId, fileType, fileName, content }) => {
    // Broadcast to all clients in the project except sender
    socket.to(projectId).emit('project_code_update', {
      fileType,
      fileName,
      content,
      userId
    });
  });

  socket.on('leave_project', ({ projectId, userId }) => {
    socket.leave(projectId);

    if (projectRooms.has(projectId)) {
      projectRooms.get(projectId).delete(userId);
      if (projectRooms.get(projectId).size === 0) {
        projectRooms.delete(projectId);
      } else {
        io.to(projectId).emit('project_user_update', Array.from(projectRooms.get(projectId)));
      }
    }
  });

  socket.on('disconnect', () => {
    // Clean up user from all project rooms they were in
    projectRooms.forEach((users, projectId) => {
      users.forEach(userId => {
        if (socket.rooms.has(projectId)) {
          users.delete(userId);
          if (users.size === 0) {
            projectRooms.delete(projectId);
          } else {
            io.to(projectId).emit('project_user_update', Array.from(users));
          }
        }
      });
    });
  });
});


app.get('/', (req, res) => {
  res.send("Server Working");
});

const PORT = process.env.PORT || 5000;
// Change this line from app.listen to server.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
