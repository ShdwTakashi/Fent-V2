const axios = require('axios');
const express = require('express');
const app = express();

const clientId = 'YOUR_CLIENT_ID'; // Replace with your GitHub Client ID
const clientSecret = 'YOUR_CLIENT_SECRET'; // Replace with your GitHub Client Secret

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for access token
    const response = await axios.post('https://github.com/login/oauth/access_token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      },
      headers: {
        accept: 'application/json',
      },
    });

    const accessToken = response.data.access_token;

    // Get user data from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const user = userResponse.data;

    // Process the user data (e.g., store in database, notify Discord bot, etc.)
    res.send(`Hello, ${user.login}! Your GitHub authentication was successful.`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during authentication');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));