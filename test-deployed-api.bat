@echo off
echo Testing deployed API at https://email-module.vercel.app/api/send-email
echo.

curl -X POST https://email-module.vercel.app/api/send-email ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"subject\":\"Test from deployed API\",\"message\":\"This is a test message to verify the deployed API is working correctly.\"}"

echo.
echo Test completed!
