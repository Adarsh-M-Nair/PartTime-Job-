# Environment Variables Reference

## Frontend (Vercel)

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

**Note**: Replace `your-backend-url` with your actual Render backend URL.

---

## Backend (Render)

Add these in Render Dashboard → Your Service → Environment:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-connector?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important Notes**:
- `MONGODB_URI`: Get this from MongoDB Atlas after creating your cluster
- `JWT_SECRET`: Generate a long, random string (e.g., use `openssl rand -base64 32`)
- `FRONTEND_URL`: Update this after deploying frontend to Vercel
- `PORT`: Render uses port 10000 by default for free tier

---

## Local Development

### Frontend (.env in `client/` folder)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env in `server/` folder)
```
MONGODB_URI=mongodb://localhost:27017/job-connector
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

