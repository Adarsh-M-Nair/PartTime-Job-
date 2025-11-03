const axios = require('axios');

async function testRegistration() {
    try {
        console.log('Testing user registration...');
        
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            email: 'test@example.com',
            password: 'password123',
            userType: 'student',
            name: 'John Doe'
        });
        
        console.log('✅ Registration successful!');
        console.log('Response:', response.data);
        
        // Test login
        console.log('\nTesting login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
        
        console.log('✅ Login successful!');
        console.log('User data:', loginResponse.data);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testRegistration();
