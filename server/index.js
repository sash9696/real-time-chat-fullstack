import express from "express";
import dotenv from "dotenv/config";
import userRoutes from "./routes/user.js";
import messageRoutes from './routes/message.js';
import chatRoutes from './routes/chat.js';
import mongoDBConnect from "./mongoDB/connection.js";
import cors from "cors";
import * as Server from 'socket.io';

const app = express();

const corsConfig = {
  origin: process.env.BASE_URL || "http://localhost:5173",
  credentials: true,
};

const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors(corsConfig));

app.use("/", userRoutes);

app.use("/api/message", messageRoutes);

app.use("/api/chat", chatRoutes);

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!", timestamp: new Date().toISOString() });
});

mongoDBConnect();

const server = app.listen(PORT, () => {
  console.log(`Server listening on PORT - ${PORT}`);
});


const io  = new Server.Server(server,{
  pingTimeout: 60000,
  cors:{
    origin: process.env.BASE_URL || "http://localhost:5173",
    credentials: true
  }
});


io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);
  
  socket.on('setup', (userData) => {
    console.log('userData',userData)
    socket.join(userData.id);
    socket.emit('connected');
  })

  socket.on('join room', (room) => {
    console.log('room',room)
    socket.join(room);
  })

  socket.on('typing', (room) => {
    console.log('typing',room)

    socket.in(room).emit('typing');
  })

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  })

  socket.on('new message', (newMessageRecieve) => {
    let newM = newMessageRecieve; // Already an object
    let chat = newM.chatId;
  
    console.log('newMessageRecieve', { chat, newM });
    console.log('Chat ID:', chat?._id);
    console.log('Chat users:', chat?.users);
    
    if (!chat?.users) {
      console.log('chat.users is not defined');
      return;
    }
  
    // Emit to the chat room instead of individual users
    console.log('Emitting message received to room:', chat._id);
    socket.in(chat._id).emit('message received', newMessageRecieve);
    
    // Also log the rooms this socket is in
    console.log('Socket rooms:', Array.from(socket.rooms));
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
})

// one tcp connection is open
//server can push whenever needed
//no repeated handshake 

//example of stock market price

// /stocks/ICIC


//Rest API => client will send GET /stocks/ICIC every 5 seconds - even if price doesnt change
//Long polling => Client sends req and waits. Server to hold it untile price changes. then client will sent another request

