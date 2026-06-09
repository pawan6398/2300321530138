const axios = require("axios");

async function Log(stack, level, packageName, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwYXdhbnZlcm1hMjExNDUyOTZAZ21haWwuY29tIiwiZXhwIjoxNzgwOTkyMzkyLCJpYXQiOjE3ODA5OTE0OTIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyMzliMDljZC1iY2YyLTQwNDYtOWNiNS0yZDkwMWMwNGFkOTkiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJwYXdhbiB2ZXJtYSIsInN1YiI6ImRhMWVjMDc4LWM3NmItNGYwZC1iZDQ5LTVhODhkZWM5NDI0MyJ9LCJlbWFpbCI6InBhd2FudmVybWEyMTE0NTI5NkBnbWFpbC5jb20iLCJuYW1lIjoicGF3YW4gdmVybWEiLCJyb2xsTm8iOiIyMzAwMzIxNTMwMTM4IiwiYWNjZXNzQ29kZSI6ImNYdXFodCIsImNsaWVudElEIjoiZGExZWMwNzgtYzc2Yi00ZjBkLWJkNDktNWE4OGRlYzk0MjQzIiwiY2xpZW50U2VjcmV0IjoiSlpieG1SZkNoVGJKQlNQWiJ9.mADdFEJIWWHFvC4ti07EeMdht1Lca7dzIc4e-iRPryw",
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Log sent:", response.data);

  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Message:", error.message);
  }
}

module.exports = Log;