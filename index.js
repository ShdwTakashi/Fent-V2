const { Client, GatewayIntentBits, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const pogger = require('pogger');
require('dotenv').config();

// GITHUB SHIT
const axios = require('axios');
const express = require('express');
const app = express();

const clientId = 'ClientID'; // Replace with your GitHub Client ID
const clientSecret = 'WayramISdumb'; // Replace with your GitHub Client Secret
const redirectUri = 'http://localhost:3000/callback'; // Replace with your redirect URI
const scopes = 'user'; // Scopes for the access you need

// Route to initiate GitHub OAuth flow
app.get('/login', (req, res) => {
  const authorizationUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
  res.redirect(authorizationUrl);
});

// Route to handle GitHub OAuth callback

// Route to handle GitHub OAuth callback
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

// GITHUB SHIT

const token = process.env.token;
const ALLOWED_SERVER_IDS = ['1195005537734119516', '1270894006896951326']; // Allowed Server IDs

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildIntegrations,
    
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});



// Initialize commands map
client.commands = new Map();

// Initialize the CommandHandler from djs-commander
new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  validationsPath: path.join(__dirname, 'validations'),
  testServer: '1270894006896951326',
});

// Log commands to verify they are loaded
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('Loaded commands:', Array.from(client.commands.keys()));
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  // Check if the interaction originated from the allowed servers
  if (!ALLOWED_SERVER_IDS.includes(interaction.guild.id)) {
    console.log("This is a Cloud one Bot only! Refrain from any new modification's. If you're a Developer of Cloud One or Are apart of a project, Please proceed.");
    return interaction.reply({ content: 'This is a Cloud One bot only! Refrain from any new modifications. If you\'re a developer of Cloud One or are part of a project, please proceed.', ephemeral: true });
  }

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command found for ${interaction.commandName}`);
    return interaction.reply({ content: 'Unknown command.', ephemeral: true });
  }

  try {
    await command.run(interaction);
  } catch (error) {
    console.error('Interaction Error:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error executing the command.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error executing the command.', ephemeral: true });
    }
  }
});

client.login(token).catch(error => {
  pogger.error('[CRASH]', 'Failed to login: ' + error);
});
// ShdwTakahi was here lol