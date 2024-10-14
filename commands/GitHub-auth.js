const { Client, GatewayIntentBits } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const pogger = require('pogger');
require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./github-auth');

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

// ...

const commandUtils = require('./common/command-utils');

client.commands = new Map();

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  validationsPath: path.join(__dirname, 'validations'),
  testServer: '1270894006896951326',
});

// ...

app.use('/oauth', router);

// Command to send GitHub OAuth authorization URL as a message
client.on('interactionCreate', async interaction => {
  if (interaction.isCommand() && interaction.commandName === 'github') {
    await interaction.reply({
      content: "Please authenticate with GitHub by clicking this link: <https://localhost:3000/oauth/login>",
    });
  }

  if (interaction.isCommand() && interaction.commandName === 'githubcallback') {
    const code = interaction.options.getString('code');
    const state = interaction.options.getString('state');
    const githubAuthUrl = `https://localhost:3000/oauth/callback?code=${code}&state=${state}`;

    console.log(githubAuthUrl);
    await interaction.reply({
      content: 'You have been sent to the GitHub OAuth callback URL.',
    });
  }
});
