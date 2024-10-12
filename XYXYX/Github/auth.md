const express = require('express');
const app = express();

const clientId = 'YOUR_CLIENT_ID'; // Replace with your GitHub Client ID
const redirectUri = 'YOUR_REDIRECT_URI'; // Replace with your redirect URI
const scopes = 'user'; // Scopes for the access you need

app.get('/login', (req, res) => {
  const authorizationUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
  res.redirect(authorizationUrl);
});

app.listen(3000, () => console.log('Server running on port 3000'));