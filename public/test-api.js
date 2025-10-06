// API Connection Test
// Run this in browser console on your Vercel site to test API connection

const testAPI = async () => {
  const API_URL = 'https://attendance-back-byl9.onrender.com';
  
  console.log('🧪 Testing API Connection...');
  
  try {
    // Test 1: Basic server status
    console.log('1️⃣ Testing server status...');
    const statusResponse = await fetch(`${API_URL}/`);
    const statusData = await statusResponse.json();
    console.log('✅ Server Status:', statusData);
    
    // Test 2: Auth status endpoint
    console.log('2️⃣ Testing auth status...');
    const authResponse = await fetch(`${API_URL}/api/auth/status`);
    const authData = await authResponse.json();
    console.log('✅ Auth Status:', authData);
    
    // Test 3: Login test
    console.log('3️⃣ Testing login endpoint...');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@islamiccollege.edu',
        password: 'admin123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login Test Successful:', loginData);
      return true;
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login Test Failed:', errorData);
      return false;
    }
    
  } catch (error) {
    console.error('❌ API Connection Failed:', error);
    return false;
  }
};

// Auto-run test
testAPI().then(success => {
  if (success) {
    console.log('🎉 All API tests passed! Your connection is working.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above.');
  }
});

// Manual test functions
window.testLogin = async (email, password) => {
  try {
    const response = await fetch('https://attendance-back-byl9.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log('Login Result:', data);
    return data;
  } catch (error) {
    console.error('Login Error:', error);
  }
};

console.log('📋 Test functions loaded:');
console.log('• testAPI() - Run full API test');
console.log('• testLogin(email, password) - Test specific login');
console.log('• Example: testLogin("admin@islamiccollege.edu", "admin123")');