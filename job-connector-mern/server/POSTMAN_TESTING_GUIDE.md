# Postman Testing Guide for Job Connector Authentication

## Prerequisites
1. Make sure your server is running on `http://localhost:5000`
2. Ensure MongoDB is running and connected
3. Have Postman installed

## Environment Variables Required
Create a `.env` file in the server directory with:
```
MONGODB_URI=mongodb://localhost:27017/job-connector
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

## Base URL
```
http://localhost:5000
```

## Authentication Endpoints

### 1. Health Check
**GET** `/api/health`
- **Purpose**: Verify server is running
- **Headers**: None required
- **Expected Response**: 
```json
{
  "message": "Server is running!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. User Registration
**POST** `/api/auth/register`
- **Purpose**: Register a new user
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- **Expected Response** (201):
```json
{
  "_id": "user_id_here",
  "email": "test@example.com",
  "role": "NewUser",
  "token": "jwt_token_here"
}
```
- **Error Cases**:
  - 400: Missing fields or user already exists
  - 500: Server error

### 3. User Login
**POST** `/api/auth/login`
- **Purpose**: Authenticate user and get token
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- **Expected Response** (200):
```json
{
  "_id": "user_id_here",
  "email": "test@example.com",
  "role": "NewUser",
  "isProfileComplete": false,
  "token": "jwt_token_here"
}
```
- **Error Cases**:
  - 401: Invalid credentials
  - 500: Server error

### 4. Get Current User (Protected Route)
**GET** `/api/auth/me`
- **Purpose**: Get current user data using JWT token
- **Headers**: 
  - `Authorization: Bearer YOUR_JWT_TOKEN_HERE`
- **Expected Response** (200):
```json
{
  "id": "user_id_here",
  "email": "test@example.com",
  "role": "NewUser",
  "isProfileComplete": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
- **Error Cases**:
  - 401: No token, invalid token, or user not found

## Testing Workflow

### Step 1: Health Check
1. Create a new GET request to `http://localhost:5000/api/health`
2. Send the request
3. Verify you get a successful response

### Step 2: Register a New User
1. Create a new POST request to `http://localhost:5000/api/auth/register`
2. Set headers: `Content-Type: application/json`
3. Set body (raw JSON):
```json
{
  "email": "student@test.com",
  "password": "testpassword123"
}
```
4. Send the request
5. **IMPORTANT**: Copy the `token` from the response - you'll need it for protected routes

### Step 3: Test Login
1. Create a new POST request to `http://localhost:5000/api/auth/login`
2. Set headers: `Content-Type: application/json`
3. Set body (raw JSON):
```json
{
  "email": "student@test.com",
  "password": "testpassword123"
}
```
4. Send the request
5. Verify you get a token in the response

### Step 4: Test Protected Route
1. Create a new GET request to `http://localhost:5000/api/auth/me`
2. Set headers: 
   - `Authorization: Bearer YOUR_TOKEN_FROM_STEP_2`
3. Send the request
4. Verify you get user data without password

### Step 5: Test Invalid Token
1. Use the same GET request to `/api/auth/me`
2. Set headers: `Authorization: Bearer invalid_token_here`
3. Send the request
4. Verify you get a 401 error

### Step 6: Test Missing Token
1. Use the same GET request to `/api/auth/me`
2. Remove the Authorization header
3. Send the request
4. Verify you get a 401 error

## Additional Test Cases

### Test Duplicate Registration
1. Try to register the same email again
2. Should get 400 error: "User already exists"

### Test Invalid Login
1. Try to login with wrong password
2. Should get 401 error: "Invalid credentials"

### Test Missing Fields
1. Try to register without email or password
2. Should get 400 error: "Please enter all fields"

## Postman Collection Setup

### Environment Variables in Postman
Create a Postman environment with:
- `base_url`: `http://localhost:5000`
- `auth_token`: (will be set automatically after login)

### Pre-request Script for Auto Token Management
Add this to your Postman collection's pre-request script:
```javascript
// Auto-set token from login response
if (pm.response && pm.response.json() && pm.response.json().token) {
    pm.environment.set("auth_token", pm.response.json().token);
}
```

### Authorization Setup
For protected routes, use:
- Type: Bearer Token
- Token: `{{auth_token}}`

## Common Issues and Solutions

### 1. Server Not Running
- **Error**: Connection refused
- **Solution**: Start server with `npm start` or `npm run server`

### 2. Database Connection Issues
- **Error**: Database connection failed
- **Solution**: Ensure MongoDB is running on localhost:27017

### 3. JWT Secret Missing
- **Error**: JWT secret not defined
- **Solution**: Create `.env` file with JWT_SECRET

### 4. CORS Issues
- **Error**: CORS policy blocking requests
- **Solution**: Server has CORS enabled, but ensure you're using the correct URL

### 5. Token Expired
- **Error**: Token failed verification
- **Solution**: Login again to get a new token

## Expected Response Times
- Health check: < 100ms
- Registration: < 500ms
- Login: < 300ms
- Protected routes: < 200ms

## Security Notes
- Tokens expire in 30 days (configurable)
- Passwords are hashed using bcrypt
- JWT tokens are signed with secret key
- Protected routes require Bearer token in Authorization header

## Next Steps After Authentication
Once authentication is working, you can test:
- Profile creation endpoints (`/api/profiles`)
- Job posting endpoints (`/api/jobs`)
- Application endpoints (when implemented)
