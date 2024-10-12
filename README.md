![Archive Dev (2)](https://github.com/user-attachments/assets/e1c676a2-7a89-478c-a59f-28be1197e3e8)

# Overview
This is a Discord bot that allows users to authenticate themselves using their GitHub accounts. This bot can be used to create a community of developers, provide privileged access to resources, or simply verify user identities.

# Features
- GitHub Authentication: Users can authenticate themselves using their GitHub credentials.
- User Profiles: Users can view their GitHub profiles within the bot.
- Role Management: Assign roles to users based on their GitHub permissions.
# Getting Started
## Prerequisites
- A Discord bot account with the applications.commands permission.
- A GitHub API token with the repo permission.
- A server with the bot role.
## Installation
- Clone this repository: git clone https://github.com/[ShdwTakashi]/Fent-V2
- Install the required packages: npm install or pip install
- Create a .env file with your bot token, GitHub OAuth app, and Discord guild ID.
- Run the bot:
  ```
  node .
  ```
# Configuration
## .env

```
token= "Discord bot Token"

CloudOne= "The Server that you're testing it on"

ClientID = "OAuth App Cliend ID"

ClientSecret = "OAuth App Client Secret"
```

# Usage
Once the bot is running, users can authenticate with their GitHub accounts using the following command: 
```
\verify-github
```
After authenticating, users will be granted a discord Role that gives full access to the server in question.

## Commands
- \verify-github`: Authenticate with GitHub account
- \profile`: View GitHub profile
- \github role set`: Set a role for a user based on their GitHub permissions
##  Security
- GitHub API Token: The githubToken in .env is used to authenticate with the GitHub API. Make sure to keep this token secure.
- Discord Bot Token: The botToken in .env is used to authenticate with the Discord API. Make sure to keep this token secure.
## FAQ
- How do I get a GitHub Oauth token?: Go to your GitHub account settings, click on Developer settings, and scroll down to Oauth Apps.
- How do I get a Discord bot token?: Go to Discord Developer Portal, Select your bot, copy the Discord Token.
## Troubleshooting
- If you encounter any issues while running the bot, make sure to check the console logs for any error messages.
- If you need further assistance, please create an issue on this repository.
## License
This bot is released under the Apache License 2.0.

