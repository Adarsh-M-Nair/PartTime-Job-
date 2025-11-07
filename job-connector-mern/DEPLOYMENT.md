# Deployment Guide

This guide will help you deploy the Job Connector MERN application to Vercel (frontend) and Render (backend).

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **MongoDB Atlas Account** - For cloud database (recommended) or use Render's MongoDB service

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster
2. Create a database user and get your connection string
3. Your connection string will look like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/job-connector?retryWrites=true&w=majority
   ```

### Step 2: Deploy to Render

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service**
   - **Name**: `job-connector-api` (or any name you prefer)
   - **Root Directory**: `server` (important!)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

3. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string-here
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   JWT_EXPIRE=30d
   PORT=10000
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
   **Note**: You'll update `FRONTEND_URL` after deploying the frontend.

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://job-connector-api.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. Make sure your code is pushed to GitHub

### Step 2: Deploy to Vercel

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: `client` (click "Edit" and set to `client`)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `build` (auto-filled)

3. **Set Environment Variables**
   Click "Environment Variables" and add:
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
   ```
   Replace `your-render-backend-url` with your actual Render backend URL.

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL (e.g., `https://job-connector.vercel.app`)

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable with your Vercel URL:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Render will automatically redeploy with the new environment variable

---

## Part 3: Verify Deployment

1. **Test Backend**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"message":"Server is running!","timestamp":"..."}`

2. **Test Frontend**
   - Visit your Vercel URL
   - Try registering a new user
   - Try logging in
   - Test job posting and application features

---

## Troubleshooting

### Backend Issues

- **Database Connection Error**: 
  - Verify `MONGODB_URI` is correct
  - Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Render)
  - Ensure database user has proper permissions

- **CORS Errors**:
  - Verify `FRONTEND_URL` matches your Vercel URL exactly
  - Check that CORS middleware is properly configured

- **Environment Variables Not Working**:
  - Restart the service after adding environment variables
  - Check variable names match exactly (case-sensitive)

### Frontend Issues

- **API Connection Errors**:
  - Verify `REACT_APP_API_URL` is set correctly
  - Check that backend is running and accessible
  - Ensure API URL ends with `/api`

- **Build Failures**:
  - Check build logs in Vercel dashboard
  - Ensure all dependencies are in `package.json`
  - Verify Node.js version compatibility

---

## Environment Variables Summary

### Backend (Render)
- `NODE_ENV=production`
- `MONGODB_URI=your-mongodb-connection-string`
- `JWT_SECRET=your-secret-key`
- `JWT_EXPIRE=30d`
- `PORT=10000`
- `FRONTEND_URL=https://your-vercel-app.vercel.app`

### Frontend (Vercel)
- `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`

---

## Additional Notes

- **Free Tier Limitations**:
  - Render free tier services spin down after 15 minutes of inactivity
  - First request after spin-down may take 30-60 seconds
  - Consider upgrading for production use

- **Custom Domains**:
  - Both Vercel and Render support custom domains
  - Update environment variables if you use custom domains

- **Database Options**:
  - MongoDB Atlas (recommended for production)
  - Render also offers MongoDB as a service
  - Update `MONGODB_URI` accordingly

---

## Quick Reference

- **Render Backend URL**: `https://your-service.onrender.com`
- **Vercel Frontend URL**: `https://your-app.vercel.app`
- **Health Check**: `https://your-backend-url.onrender.com/api/health`

Good luck with your deployment! 🚀

