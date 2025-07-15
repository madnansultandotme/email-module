const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Test data
const testData = {
  "name": "John Doe",
  "email": "ats7531331@gmail.com",
  "subject": "Test Contact Form",
  "message": "This is a test message from the contact form. If you receive this, the email system is working correctly!"
};

// Test function
async function testEmailAPI() {
  try {
    console.log('🧪 Testing email API...');
    console.log('📤 Sending test email with data:', testData);
    
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', result);
    
    if (response.ok) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Email failed to send');
    }
    
  } catch (error) {
    console.error('🚨 Error testing email API:', error);
  }
}

// Run the test
testEmailAPI();
