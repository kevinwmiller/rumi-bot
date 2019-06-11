# Overview
Rumi-Bot is a simple discord bot created for lilylefae. It currently has support for notifying discord members when Lily starts and ends her stream.

A !live command is also provided to allow users to check the current status of the stream

# Requirements

## Easier Preferred Method
- docker
- docker-compose
## Slightly More Annoying Method (May Need for Windows Computers if You Are Not Running a Recent Version of Windows 10)
  - node 12
    - If on Linux, use your distro's package manager
    - nvm is a useful tool to manage node version
  - If on Windows
    - Download the current node version from https://nodejs.org/en/download/current/
  - forever
    - ```npm i -g forever```
## Both Methods
- Twitch Account
- Discord Account

# Setup

- Clone this repository to the location and machine that will host the bot
- SSH
  - ```git clone git@github.com:kevinwmiller/rumi-bot.git```
- HTTPS
  - ```git clone https://github.com/kevinwmiller/rumi-bot.git```

## Environment Configuration

- Create a file called .env in the root of the project
- Note: If you are on a Windows machine, you may have difficulties creating a file that starts with a dot
- To create this file on windows, open a command prompt in the project root
  - Open Windows Explorer to the project root, and press Alt + d
  - This should highlight the Windows Explorer path at the top
  - Type "cmd" and press enter
  - A black window should appear
  - ```echo.> .env```
  - This should create the .env file and you can edit it using a normal text editor (Such as notepad)
- Add the following environnment variables and the appropriate values that correspond to your Twitch and Discord accounts

```env
TWITCH_USER=
TWITCH_USER_ID=
TWITCH_CLIENT_ID=
DISCORD_TOKEN=
DISCORD_NOTIFICATION_CHANNEL_ID=
```

### TWITCH_USER

This value is the username of your Twitch account

### TWITCH_USER_ID

This value is the ID associated with your Twitch account. You can download a [browser addon](https://chrome.google.com/webstore/detail/twitch-username-and-user/laonpoebfalkjijglbjbnkfndibbcoon?hl=en-US) to display the ID associated with a username.

### TWITCH_CLIENT_ID

This value is required to check the status of the stream.
- Go to https://dev.twitch.tv/docs/api/, and follow the Setup instructions to create a Twitch application. Copy the client ID and use it for the TWITCH_CLIENT_ID value.

### DICORD_TOKEN
- Go to discordapp.com/developers/applications/me, login, and create a new discord bot
- Go into the Bot tab on the left, and in the "Build-A-Bot" section, click "Reveal" to get your bot's authorization token. Do not share this with anyone or put it under version control.
- Use this ID for the DISCORD_TOKEN value.

### DISCORD_NOTIFICATION_CHANNEL_ID

- This value is the ID of the channel that broadcast notifications will be sent to. Broadcast notifications include global messages that are sent when the stream has started or stopped.
- Go to discordapp.com, open User Settings -> Appearance -> Enable Developer Mode.
- Right click on the Discord text channel that you want the notifications to be sent to and press "Copy ID".
- Use this value for DISCORD_NOTIFICATION_CHANNEL_ID

# Starting the Bot

- Open a command prompt in the project root

## Easier Preferred Method
- ```docker-compose up -d```

## Slightly More Annoying Method (May Need for Windows Computers if You Are Not Running a Recent Version of Windows 10)
- ```forever start bot.js```

# To Stop Rumi-Bot
- Open a command prompt in the root of the project directory
- If using docker:
  - ```docker-compose stop``` if using docker-compose
- If using forever:
  - ```forever list``` to find the process ID
  - ```forever stop <PID>```
    - Alternatively, you can use ```forever stopall``` to stop all processes running with forever.
      - If you only have the bot running, this is simpler

# Ensure the Bot is Running
- Open discord, and type ```!test``` in the chat window. The bot should respond with "Testing". If you see this message, then everything is working as expected.

# Troubleshooting

- If the bot is offline, ensure your Discord Token is correct. Make sure there are no quotes around the values in the .env file
