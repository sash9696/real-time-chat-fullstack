# 🚀 Deployment Guide

This guide covers deploying your real-time chat application using a single repository approach.

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway/Render/Heroku account (for backend)
- MongoDB Atlas account (for database)

## 🏗️ Repository Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `real-time-chat-app`
3. Make it public or private (your choice)
4. **Don't** initialize with README (we already have one)

### 2. Push Your Code

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/real-time-chat-app.git

# Push to GitHub
git push -u origin main
```

## 🌐 Frontend Deployment (Vercel)

### 1. Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `real-time-chat-app` repository

### 2. Configure Frontend Settings

**Build Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Environment Variables:**
```env
VITE_SERVER_URL=https://your-backend-url.railway.app
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

### 3. Deploy

Click "Deploy" and Vercel will build and deploy your frontend.

## 🔧 Backend Deployment (Railway)

### 1. Connect to Railway

1. Go to [Railway](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `real-time-chat-app` repository

### 2. Configure Backend Settings

**Service Settings:**
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
```env
MONGO_DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
BASE_URL=https://your-frontend-url.vercel.app
PORT=3000
SECRET=<your_super_secret_jwt_key_here>
```

### 3. Deploy

Railway will automatically deploy your backend and provide a URL.

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Set up database access (username/<password>)
4. Set up network access (allow all IPs: 0.0.0.0/0)

### 2. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add this to your backend environment variables

## 🔄 Update Environment Variables

### Frontend (Vercel)
After backend deployment, update your frontend environment variables:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Update `VITE_SERVER_URL` and `VITE_SOCKET_URL` with your backend URL

### Backend (Railway)
Update your backend environment variables:

1. Go to your Railway project dashboard
2. Navigate to Variables tab
3. Add/update the environment variables

## 🧪 Test Your Deployment

### 1. Test Frontend
- Visit your Vercel URL
- Try logging in/registering
- Check if the app loads properly

### 2. Test Backend
```bash
# Test your backend API
curl https://your-backend-url.railway.app/test
```

### 3. Test Socket Connection
- Open browser console on your frontend
- Check for socket connection logs
- Try sending a message

## 🔧 Alternative Deployment Options

### Backend Alternatives

#### Render
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set root directory to `server`
5. Use environment variables

#### Heroku
1. Go to [Heroku](https://heroku.com)
2. Create new app
3. Connect GitHub repo
4. Set buildpack to Node.js
5. Configure environment variables

### Frontend Alternatives

#### Netlify
1. Go to [Netlify](https://netlify.com)
2. Import from Git
3. Set build command: `cd client && npm run build`
4. Set publish directory: `client/dist`

## 🐛 Troubleshooting

### Common Issues

#### Frontend Can't Connect to Backend
- Check environment variables in Vercel
- Ensure backend URL is correct
- Verify CORS settings in backend

#### Socket Connection Fails
- Check if backend is running
- Verify socket URL in frontend
- Check browser console for errors

#### Database Connection Issues
- Verify MongoDB Atlas connection string
- Check network access settings
- Ensure username/<password> are correct

### Debug Commands

```bash
# Check if backend is running
curl https://your-backend-url.railway.app/test

# Check environment variables
echo $MONGO_DB_URL
echo $BASE_URL

# Check logs
# Vercel: Dashboard → Functions → View Function Logs
# Railway: Dashboard → Deployments → View Logs
```

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in your project
- Monitor frontend performance
- Track user interactions

### Railway Monitoring
- Check Railway dashboard for backend metrics
- Monitor API response times
- Track error rates

## 🔄 Continuous Deployment

### Automatic Deployments
Both Vercel and Railway will automatically deploy when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployment will trigger
```

### Manual Deployments
You can also trigger manual deployments from the respective dashboards.

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Database connected and tested
- [ ] Frontend connects to backend
- [ ] Socket.IO working
- [ ] Authentication working
- [ ] Messages sending/receiving
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Security measures in place

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review deployment logs
3. Verify environment variables
4. Test locally first
5. Check GitHub issues for similar problems

---

**Happy Deploying! 🎉** 