# Postman Testing Guide for Job Connector Authentication

## Prerequisites

1. **Start the server**: Make sure your server is running on `http://localhost:5000`
2. **Environment Setup**: Create a `.env` file with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/job-connector
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d
   PORT=5000
   NODE_ENV=development
   ```
3. **MongoDB**: Ensure MongoDB is running locally

## Authentication Endpoints

### Base URL: `http://localhost:5000/api/auth`

---

## 1. Health Check (Optional)

**GET** `http://localhost:5000/api/health`

**Headers**: None required

**Expected Response**:
```json
{
    "message": "Server is running!",
    "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 2. User Registration

**POST** `http://localhost:5000/api/auth/register`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
    "email": "test@example.com",
    "password": "password123"
}
```

**Expected Response (Success - 201)**:
```json
{
    "_id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "role": "NewUser",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Response (Error - 400)**:
```json
{
    "message": "Please enter all fields"
}
```

**Expected Response (Error - 400)**:
```json
{
    "message": "User already exists"
}
```

---

## 3. User Login

**POST** `http://localhost:5000/api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
    "email": "test@example.com",
    "password": "password123"
}
```

**Expected Response (Success - 200)**:
```json
{
    "_id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "role": "NewUser",
    "isProfileComplete": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Response (Error - 401)**:
```json
{
    "message": "Invalid credentials"
}
```

---

## 4. Get Current User (Protected Route)

**GET** `http://localhost:5000/api/auth/me`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
```

**Expected Response (Success - 200)**:
```json
{
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "role": "NewUser",
    "isProfileComplete": false,
    "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**Expected Response (Error - 401)**:
```json
{
    "message": "Not authorized, no token"
}
```

**Expected Response (Error - 401)**:
```json
{
    "message": "Not authorized, token failed"
}
```

---

## Step-by-Step Testing Workflow

### Step 1: Test Server Health
1. Create a new GET request in Postman
2. Set URL to `http://localhost:5000/api/health`
3. Send the request
4. Verify you get a 200 response with server status

### Step 2: Register a New User
1. Create a new POST request in Postman
2. Set URL to `http://localhost:5000/api/auth/register`
3. Set Headers: `Content-Type: application/json`
4. Set Body (raw JSON):
   ```json
   {
       "email": "test@example.com",
       "password": "password123"
   }
   ```
5. Send the request
6. **Save the token** from the response for the next step

### Step 3: Test Login
1. Create a new POST request in Postman
2. Set URL to `http://localhost:5000/api/auth/login`
3. Set Headers: `Content-Type: application/json`
4. Set Body (raw JSON):
   ```json
   {
       "email": "test@example.com",
       "password": "password123"
   }
   ```
5. Send the request
6. **Save the token** from the response

### Step 4: Test Protected Route
1. Create a new GET request in Postman
2. Set URL to `http://localhost:5000/api/auth/me`
3. Set Headers:
   - `Authorization: Bearer YOUR_TOKEN_HERE`
   - `Content-Type: application/json`
4. Send the request
5. Verify you get user data back

### Step 5: Test Invalid Token
1. Use the same GET request to `/api/auth/me`
2. Set Authorization header to `Bearer invalid-token-here`
3. Send the request
4. Verify you get a 401 error

### Step 6: Test Missing Token
1. Use the same GET request to `/api/auth/me`
2. Remove the Authorization header completely
3. Send the request
4. Verify you get a 401 error

---

## Common Issues and Solutions

### Issue: "Server is not running"
**Solution**: Start the server with `npm run server` or `node index.js`

### Issue: "MongoDB connection failed"
**Solution**: Ensure MongoDB is running locally on port 27017

### Issue: "JWT_SECRET not defined"
**Solution**: Create a `.env` file with `JWT_SECRET=your-secret-key`

### Issue: "User already exists" during registration
**Solution**: Use a different email address or delete the existing user from the database

### Issue: "Invalid credentials" during login
**Solution**: Verify the email and password match what was used during registration

---

## Environment Variables Setup

Create a `.env` file in the server directory with:

```env
MONGODB_URI=mongodb://localhost:27017/job-connector
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

---

## Postman Collection Setup

### Creating a Postman Collection:

1. **Create New Collection**: "Job Connector API Tests"
2. **Add Environment Variables**:
   - `base_url`: `http://localhost:5000`
   - `token`: (will be set automatically after login)

3. **Create Requests**:
   - Health Check (GET)
   - Register User (POST)
   - Login User (POST)
   - Get Current User (GET)
   - Test Invalid Token (GET)

### Using Environment Variables in Postman:

- Use `{{base_url}}/api/auth/register` instead of full URL
- Use `{{token}}` in Authorization header: `Bearer {{token}}`

### Automating Token Setting:

In the Login request, add this to the "Tests" tab:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```

This will automatically set the token for subsequent requests.

---

## Testing Different Scenarios

### Test Case 1: Complete Registration Flow
1. Register with valid data → Should get 201 with token
2. Login with same credentials → Should get 200 with token
3. Get current user with token → Should get 200 with user data

### Test Case 2: Error Handling
1. Register without email → Should get 400
2. Register without password → Should get 400
3. Login with wrong password → Should get 401
4. Get current user without token → Should get 401

### Test Case 3: Duplicate Registration
1. Register user → Should get 201
2. Register same user again → Should get 400 "User already exists"

### Test Case 4: Token Validation
1. Login successfully → Get valid token
2. Use token in protected route → Should work
3. Use invalid token → Should get 401
4. Use expired token → Should get 401

---

## Expected Response Times

- Health Check: < 100ms
- Registration: 200-500ms
- Login: 200-500ms
- Protected Routes: 100-300ms

If responses are slower, check:
- Database connection
- Server performance
- Network latency
