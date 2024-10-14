const { Client, IntentsBitField, } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

const clientId = "ClientID"; //  GitHub Client ID
const clientSecret = "ClientSecret"; //  GitHub Client Secret
const redirectUri = "http://localhost:3000/callback"; // Your redirect URI

// Assuming this is your main bot file
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages] });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify-github")
    .setDescription("Verify your GitHub account"),

  async run(interaction) {
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user&state=${state}`;

    const embed = new EmbedBuilder()
      .setTitle("GitHub Verification")
      .setDescription(
        `Please log in to your GitHub account to verify: [${oauthUrl}](${oauthUrl})`,
      )
      .setColor("#4078c0"); // GitHub's color

    // Send the initial reply with the verification link
    await interaction.reply({ embeds: [embed], ephemeral: true });

    // Set up a message collector to wait for the user's GitHub code
    const filter = (response) => response.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (message) => {
      const code = message.content.trim();

      try {
        // Exchange the authorization code for an access token
        const tokenResponse = await axios.post(
          "https://github.com/login/oauth/access_token",
          null,
          {
            params: {
              client_id: clientId,
              client_secret: clientSecret,
              code: code,
              redirect_uri: redirectUri,
            },
            headers: {
              accept: "application/json",
            },
          },
        );

        const accessToken = tokenResponse.data.access_token;

        // Fetch the GitHub user data
        const userResponse = await axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });

        const githubUser = userResponse.data;

        // Notify the user of the successful verification
        await interaction.followUp({
          content: `Successfully verified! GitHub Username: ${githubUser.login}`,
          ephemeral: true,
        });
      } catch (error) {
        // Notify the user of any errors during verification
        await interaction.followUp({
          content: "There was an error during the GitHub verification process.",
          ephemeral: true,
        });
      }
      collector.stop(); // Stop the collector once the code is processed
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        interaction.followUp({
          content: "GitHub verification timed out.",
          ephemeral: true,
        });
      }
    });
  },
};