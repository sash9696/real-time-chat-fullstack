# Real-Time Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Socket.IO, and MongoDB. Features include real-time messaging, user authentication, group chats, typing indicators, and more.

## Quick Links

- [Frontend Documentation](./client/README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Next-Gen Features Roadmap](./NEXTGEN_FEATURES.md)

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **User Authentication**: JWT-based authentication with Google OAuth support
- **Group Chats**: Create and manage group conversations
- **Typing Indicators**: See when users are typing
- **Message History**: Persistent message storage
- **User Profiles**: Customizable user profiles with avatars
- **Search Functionality**: Find users and messages
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd real-time-chat-app
```

### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:

```env
MONGO_DB_URL=mongodb://localhost:27017/chat-app
# OR for MongoDB Atlas:
# MONGO_DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

BASE_URL=http://localhost:5173
PORT=3000
SECRET=<your_jwt_secret_key_here>
```

### 4. Start the Application

```bash
# Start the server (from server directory)
cd server
npm start

# Start the client (from client directory, in a new terminal)
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication APIs

### Register User
```http
POST /register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "<your_password>",
  "profilePic": "https://example.com/avatar.jpg"
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "<your_password>",
    "profilePic": "https://example.com/avatar.jpg"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePic": "https://example.com/avatar.jpg"
  },
  "token": "<jwt_token_here>"
}
```

### Login User
```http
POST /login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "<your_password>"
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "<your_password>"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePic": "https://example.com/avatar.jpg"
  },
  "token": "<jwt_token_here>"
}
```

### Google OAuth Login
```http
POST /google
```

**Request Body:**
```json
{
  "credential": "<google_oauth_token_here>"
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:3000/google \
  -H "Content-Type: application/json" \
  -d '{
    "credential": "<google_oauth_token_here>"
  }'
```

---

## 💬 Chat APIs

### Get All Chats
```http
GET /api/chat
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Command:**
```bash
curl -X GET http://localhost:3000/api/chat \
  -H "Authorization: Bearer <your_jwt_token>"
```

**Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "chatName": "John Doe",
    "isGroup": false,
    "users": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePic": "https://example.com/avatar.jpg"
      }
    ],
    "latestMessage": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "message": "Hello!",
      "sender": "60f7b3b3b3b3b3b3b3b3b3b3"
    }
  }
]
```

### Create One-on-One Chat
```http
POST /api/chat
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "userId": "60f7b3b3b3b3b3b3b3b3b3b6"
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "60f7b3b3b3b3b3b3b3b3b3b6"
  }'
```

### Create Group Chat
```http
POST /api/chat/group
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Project Team",
  "users": ["60f7b3b3b3b3b3b3b3b3b3b6", "60f7b3b3b3b3b3b3b3b3b3b7"]
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:3000/api/chat/group \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Team",
    "users": ["60f7b3b3b3b3b3b3b3b3b3b6", "60f7b3b3b3b3b3b3b3b3b3b7"]
  }'
```

### Rename Group
```http
PUT /api/chat/rename
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "chatId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "chatName": "New Group Name"
}
```

**cURL Command:**
```bash
curl -X PUT http://localhost:3000/api/chat/rename \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "chatName": "New Group Name"
  }'
```

### Add User to Group
```http
PUT /api/chat/groupadd
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "chatId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "userId": "60f7b3b3b3b3b3b3b3b3b3b8"
}
```

**cURL Command:**
```bash
curl -X PUT http://localhost:3000/api/chat/groupadd \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b8"
  }'
```

### Remove User from Group
```http
PUT /api/chat/groupremove
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "chatId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "userId": "60f7b3b3b3b3b3b3b3b3b3b8"
}
```

**cURL Command:**
```bash
curl -X PUT http://localhost:3000/api/chat/groupremove \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b8"
  }'
```

---

## 💌 Message APIs

### Send Message
```http
POST /api/message
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "chatId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "message": "Hello, how are you?"
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:3000/api/message \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "message": "Hello, how are you?"
  }'
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b9",
  "sender": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePic": "https://example.com/avatar.jpg"
  },
  "message": "Hello, how are you?",
  "chatId": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "chatName": "John Doe",
    "isGroup": false,
    "users": [...]
  },
  "createdAt": "2023-07-20T10:30:00.000Z",
  "updatedAt": "2023-07-20T10:30:00.000Z"
}
```

### Get Messages for Chat
```http
GET /api/message/{chatId}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Command:**
```bash
curl -X GET http://localhost:3000/api/message/60f7b3b3b3b3b3b3b3b3b3b4 \
  -H "Authorization: Bearer <your_jwt_token>"
```

**Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b9",
    "sender": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePic": "https://example.com/avatar.jpg"
    },
    "message": "Hello, how are you?",
    "chatId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
]
```

---

## 🔌 Socket.IO Events

### Client to Server Events

#### Setup User
```javascript
socket.emit('setup', userData);
```
**Payload:**
```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "John Doe",
  "email": "john@example.com",
  "profilePic": "https://example.com/avatar.jpg"
}
```

#### Join Chat Room
```javascript
socket.emit('join room', chatId);
```

#### Send Message
```javascript
socket.emit('new message', messageData);
```

#### Typing Indicator
```javascript
socket.emit('typing', chatId);
socket.emit('stop typing', chatId);
```

### Server to Client Events

#### Connected
```javascript
socket.on('connected', () => {
  console.log('Socket connected successfully');
});
```

#### Message Received
```javascript
socket.on('message received', (newMessage) => {
  console.log('New message:', newMessage);
});
```

#### Typing Indicators
```javascript
socket.on('typing', () => {
  console.log('User is typing...');
});

socket.on('stop typing', () => {
  console.log('User stopped typing');
});
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  profilePic: String,
  bio: String,
  contacts: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Model
```javascript
{
  photo: String,
  chatName: String,
  isGroup: Boolean,
  users: [ObjectId],
  latestMessage: ObjectId,
  groupAdmin: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  sender: ObjectId (ref: User),
  message: String,
  chatId: ObjectId (ref: Chat),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Build the project
cd client
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend Deployment (Heroku)
```bash
# Create Heroku app
heroku create your-chat-app

# Set environment variables
heroku config:set MONGO_DB_URL=<your_mongodb_url>
heroku config:set BASE_URL=<your_frontend_url>
heroku config:set SECRET=<your_jwt_secret>

# Deploy
git push heroku main
```

---

## 🧪 Testing

### Test Server Connection
```bash
curl http://localhost:3000/test
```

### Test Authentication
```bash
# Register a user
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "<your_password>"
  }'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "<your_password>"
  }'
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

## 🔄 Changelog

### v1.0.0
- Initial release
- Real-time messaging with Socket.IO
- User authentication
- Group chat functionality
- Typing indicators
- Message persistence

---

**Happy Chatting! 🎉** 