# Real-Time Chat App - Frontend Client

A modern React-based frontend for the real-time chat application, built with React 18, Redux Toolkit, Socket.IO, and Tailwind CSS.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery with Socket.IO
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Redux Toolkit for global state
- **User Authentication**: JWT-based auth with Google OAuth
- **Group Chats**: Create and manage group conversations
- **Typing Indicators**: Real-time typing status
- **Message History**: Persistent chat history
- **User Profiles**: Customizable profiles with avatars
- **Search Functionality**: Find users and messages
- **Emoji Support**: Built-in emoji picker
- **Modern UI**: Clean, intuitive interface

## 🛠️ Tech Stack

- **React 18** - UI framework with hooks
- **Redux Toolkit** - State management
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **Emoji Mart** - Emoji picker component
- **Axios** - HTTP client

## 📁 Project Structure

```
client/
├── public/
│   └── vite.svg
├── src/
│   ├── apis/                 # API service functions
│   │   ├── auth.js          # Authentication APIs
│   │   ├── chat.js          # Chat management APIs
│   │   └── message.js       # Message APIs
│   ├── assets/              # Static assets
│   │   └── react.svg
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components
│   │   │   ├── Contacts.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── NoContacts.jsx
│   │   │   ├── Skeletonloading.jsx
│   │   │   └── Typing.jsx
│   │   ├── profile/        # Profile-related components
│   │   │   └── InputEdit.jsx
│   │   ├── Group.jsx       # Group chat component
│   │   ├── MessageHistory.jsx # Message display
│   │   ├── Model.jsx       # Modal component
│   │   ├── Profile.jsx     # User profile
│   │   └── Search.jsx      # Search functionality
│   ├── pages/              # Page components
│   │   ├── Chat.jsx        # Main chat interface
│   │   ├── Home.jsx        # Home page
│   │   ├── Login.jsx       # Login page
│   │   └── Register.jsx    # Registration page
│   ├── redux/              # Redux store and slices
│   │   ├── activeUserSlice.js
│   │   ├── chatsSlice.js
│   │   ├── profileSlice.js
│   │   ├── searchSlice.js
│   │   └── store.js
│   ├── utils/              # Utility functions
│   │   └── index.js
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styles
│   ├── index.css           # Global styles
│   └── main.jsx            # App entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Environment Variables
Create a `.env` file in the client directory:
```env
VITE_SERVER_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📚 Component Documentation

---

## 🔐 Authentication Components

### Login Page (`pages/Login.jsx`)

**Purpose**: User authentication interface

**Features**:
- Email/password login
- Google OAuth integration
- Form validation
- Error handling

**Usage**:
```jsx
import Login from './pages/Login';

// In your router
<Route path="/login" element={<Login />} />
```

**Props**: None

**State**:
```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
```

### Register Page (`pages/Register.jsx`)

**Purpose**: User registration interface

**Features**:
- User registration form
- Password confirmation
- Profile picture upload
- Form validation

**Usage**:
```jsx
import Register from './pages/Register';

// In your router
<Route path="/register" element={<Register />} />
```

---

## 💬 Chat Components

### Chat Page (`pages/Chat.jsx`)

**Purpose**: Main chat interface with real-time messaging

**Features**:
- Real-time message display
- Socket.IO integration
- Typing indicators
- Message input with emoji support
- Auto-scroll to latest messages

**Usage**:
```jsx
import Chat from './pages/Chat';

// Pass active user as prop
<Chat activeUser={currentUser} className="chat-container" />
```

**Props**:
```javascript
{
  activeUser: {
    id: string,
    name: string,
    email: string,
    profilePic: string,
    bio: string
  },
  className: string
}
```

**State Management**:
```javascript
const [message, setMessage] = useState('');
const [messages, setMessages] = useState([]);
const [socketConnected, setSocketConnected] = useState(false);
const [typing, setTyping] = useState(false);
const [isTyping, setIsTyping] = useState(false);
const [loading, setLoading] = useState(false);
const [showPicker, setShowPicker] = useState(false);
```

**Socket Events**:
```javascript
// Client to Server
socket.emit('setup', activeUser);
socket.emit('join room', chatId);
socket.emit('new message', messageData);
socket.emit('typing', chatId);
socket.emit('stop typing', chatId);

// Server to Client
socket.on('connected', () => {});
socket.on('message received', (message) => {});
socket.on('typing', () => {});
socket.on('stop typing', () => {});
```

### MessageHistory Component (`components/MessageHistory.jsx`)

**Purpose**: Display chat messages with proper formatting

**Features**:
- Message bubble layout
- Sender/receiver distinction
- Avatar display
- Message grouping
- Auto-scroll

**Usage**:
```jsx
import MessageHistory from '../components/MessageHistory';

<MessageHistory messages={messages} />
```

**Props**:
```javascript
{
  messages: Array<{
    _id: string,
    sender: {
      _id: string,
      name: string,
      profilePic: string
    },
    message: string,
    createdAt: string
  }>
}
```

### Typing Component (`components/ui/Typing.jsx`)

**Purpose**: Display typing indicator animation

**Usage**:
```jsx
import Typing from '../components/ui/Typing';

{isTyping && <Typing width="100" height="100" />}
```

**Props**:
```javascript
{
  width: string,
  height: string
}
```

---

## 👥 User Management Components

### Profile Component (`components/Profile.jsx`)

**Purpose**: User profile management interface

**Features**:
- Profile information display
- Edit profile functionality
- Avatar upload
- Bio editing

**Usage**:
```jsx
import Profile from '../components/Profile';

<Profile user={currentUser} onUpdate={handleProfileUpdate} />
```

### Search Component (`components/Search.jsx`)

**Purpose**: User and message search functionality

**Features**:
- Real-time search
- User filtering
- Search results display

**Usage**:
```jsx
import Search from '../components/Search';

<Search onUserSelect={handleUserSelect} />
```

---

## 🎨 UI Components

### Loading Component (`components/ui/Loading.jsx`)

**Purpose**: Loading spinner for async operations

**Usage**:
```jsx
import Loading from '../components/ui/Loading';

{loading && <Loading />}
```

### Contacts Component (`components/ui/Contacts.jsx`)

**Purpose**: Display user contacts list

**Usage**:
```jsx
import Contacts from '../components/ui/Contacts';

<Contacts contacts={userContacts} onContactSelect={handleSelect} />
```

### NoContacts Component (`components/ui/NoContacts.jsx`)

**Purpose**: Empty state for contacts

**Usage**:
```jsx
import NoContacts from '../components/ui/NoContacts';

{contacts.length === 0 && <NoContacts />}
```

---

## 🔄 State Management (Redux)

### Store Configuration (`redux/store.js`)

**Purpose**: Redux store setup with Redux Toolkit

```javascript
import { configureStore } from '@reduxjs/toolkit';
import activeUserReducer from './activeUserSlice';
import chatsReducer from './chatsSlice';
import profileReducer from './profileSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    activeUser: activeUserReducer,
    chats: chatsReducer,
    profile: profileReducer,
    search: searchReducer,
  },
});
```

### Active User Slice (`redux/activeUserSlice.js`)

**Purpose**: Manage current user state

```javascript
import { createSlice } from '@reduxjs/toolkit';

const activeUserSlice = createSlice({
  name: 'activeUser',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = activeUserSlice.actions;
export default activeUserSlice.reducer;
```

### Chats Slice (`redux/chatsSlice.js`)

**Purpose**: Manage chat conversations

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChats } from '../apis/chat';

export const fetchChatsAsync = createAsyncThunk(
  'chats/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchChats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    activeChat: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(c => c._id === chatId);
      if (chat) {
        chat.latestMessage = message;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveChat, addMessage } = chatsSlice.actions;
export default chatsSlice.reducer;
```

---

## 🔌 API Integration

### Authentication API (`apis/auth.js`)

```javascript
import axios from 'axios';

const API = (token) => {
  return axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const register = async (userData) => {
  try {
    const response = await axios.post('http://localhost:3000/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:3000/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const googleAuth = async (credential) => {
  try {
    const response = await axios.post('http://localhost:3000/google', { credential });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Chat API (`apis/chat.js`)

```javascript
import axios from 'axios';

const API = (token) => {
  return axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchChats = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await API(token).get('/api/chat');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createChat = async (userId) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await API(token).post('/api/chat', { userId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createGroupChat = async (groupData) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await API(token).post('/api/chat/group', groupData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Message API (`apis/message.js`)

```javascript
import axios from 'axios';

const API = (token) => {
  return axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendMessage = async (messageData) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await API(token).post('/api/message', messageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchMessages = async (chatId) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await API(token).get(`/api/message/${chatId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

---

## 🎨 Styling with Tailwind CSS

### Custom Classes

The application uses Tailwind CSS with custom utility classes:

```css
/* Custom scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Message bubbles */
.message-bubble {
  @apply max-w-[60%] px-4 py-2 rounded-lg text-sm font-medium break-words;
}

.message-sent {
  @apply bg-green-600 text-white ml-auto rounded-br-none;
}

.message-received {
  @apply bg-gray-200 text-gray-800 rounded-bl-none;
}
```

### Responsive Design

```jsx
// Mobile-first responsive classes
<div className="w-full md:w-1/2 lg:w-1/3">
  <div className="p-4 md:p-6 lg:p-8">
    <h1 className="text-lg md:text-xl lg:text-2xl">
      Responsive Title
    </h1>
  </div>
</div>
```

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

```env
# Development
VITE_SERVER_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

# Production
VITE_SERVER_URL=https://your-api-domain.com
VITE_SOCKET_URL=https://your-api-domain.com
```

### Code Structure Guidelines

1. **Components**: Use functional components with hooks
2. **State Management**: Use Redux Toolkit for global state
3. **Styling**: Use Tailwind CSS utility classes
4. **API Calls**: Centralize in `apis/` directory
5. **Error Handling**: Implement proper error boundaries
6. **Loading States**: Show loading indicators for async operations

---

## 🧪 Testing

### Component Testing

```javascript
import { render, screen } from '@testing-library/react';
import Chat from '../pages/Chat';

test('renders chat interface', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  };
  
  render(<Chat activeUser={mockUser} />);
  expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
});
```

### Redux Testing

```javascript
import { configureStore } from '@reduxjs/toolkit';
import chatsReducer from '../redux/chatsSlice';

test('should handle initial state', () => {
  const store = configureStore({
    reducer: { chats: chatsReducer }
  });
  
  const state = store.getState().chats;
  expect(state.chats).toEqual([]);
  expect(state.activeChat).toBeNull();
});
```

---

## 🚀 Deployment

### Build for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# The built files will be in the dist/ directory
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify (drag and drop dist/ folder)
```

---

## 🔍 Performance Optimization

### Code Splitting

```javascript
// Lazy load components
import { lazy, Suspense } from 'react';

const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./components/Profile'));

// Wrap with Suspense
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>
```

### Memoization

```javascript
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const filteredMessages = useMemo(() => {
  return messages.filter(msg => msg.chatId === activeChatId);
}, [messages, activeChatId]);

// Memoize callbacks
const handleSendMessage = useCallback((message) => {
  socket.emit('new message', message);
}, [socket]);
```

---

## 🐛 Debugging

### Redux DevTools

```javascript
// Enable Redux DevTools in development
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
```

### Socket.IO Debugging

```javascript
// Enable Socket.IO debugging
const socket = io('http://localhost:3000', {
  debug: true
});

// Listen for connection events
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

---

## 📱 Mobile Optimization

### Touch Interactions

```javascript
// Handle touch events for mobile
const handleTouchStart = (e) => {
  // Touch start logic
};

const handleTouchEnd = (e) => {
  // Touch end logic
};
```

### Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

## 🔒 Security Considerations

### Input Validation

```javascript
// Sanitize user inputs
const sanitizeInput = (input) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### XSS Prevention

```javascript
// Use React's built-in XSS protection
const message = userInput; // React automatically escapes this
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy Coding! 🎉**
