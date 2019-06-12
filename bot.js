let Discord = require('discord.io')
let logger = require('winston')
let axios = require('axios')
const dotenv = require('dotenv');

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
    colorize: true
})

logger.level = 'debug'

dotenv.config();

let isLive = false
let liveCheckMade = false

let streamApiBaseUrl = `https://api.twitch.tv/kraken/streams/`
let twitchUser = process.env.TWITCH_USER
let twitchUserID = process.env.TWITCH_USER_ID
let notificationChannelID = process.env.DISCORD_NOTIFICATION_CHANNEL_ID
let twitchClientID = process.env.TWITCH_CLIENT_ID
let discordToken = process.env.DISCORD_TOKEN
let streamUrl = streamApiBaseUrl + twitchUserID
let twitchUrl = `https://www.twitch.tv/${twitchUser}`
// TODO: Make these configurable, but allow environment variable expansion without using eval
let liveNotificationMessage = `Hey @here! ${twitchUser} is live! Check her out at ${twitchUrl}`
let liveMessage = `${twitchUser} is live at ${twitchUrl}`
let streamEndMessage = 'The stream has ended for now'
let offlineMessage = `${twitchUser} is currently offline`

// Initialize Discord Bot
let bot = new Discord.Client({
    token: discordToken,
    autorun: true
})

function checkLiveStatus() {
    if (!liveCheckMade) {
        liveCheckMade = true
        axios.get(
            streamUrl,
            {
                params: {
                    'client_id': twitchClientID
                }
            }
        )
            .then(response => {
                liveCheckMade = false

                if (response.data.stream != null && !isLive) {
                    logger.info('Streamer is live')
                    bot.sendMessage({
                        to: notificationChannelID,
                        message: liveNotificationMessage,
                    })
                    isLive = true
                }
                else if (response.data.stream == null && isLive) {
                    logger.info('Streamer has gone offline')
                    bot.sendMessage({
                        to: notificationChannelID,
                        message: streamEndMessage,
                    })
                    isLive = false
                }
            })
            .catch(error => {
                liveCheckMade = false
                logger.error(error);
            })
    }
}

bot.on('ready', function (evt) {
    logger.info('Connected')
    logger.info(`Logged in as: ${evt}`)
    logger.info(evt)
    logger.info(bot.username + ' - (' + bot.id + ')')
    setInterval(checkLiveStatus, 5000);
})

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        let args = message.substring(1).split(' ')
        let cmd = args[0]

        args = args.splice(1)
        switch (cmd) {
            case 'test':
                bot.sendMessage({
                    to: channelID,
                    message: `Testing`,
                })
                break;
            case 'live':
                handleLiveCmd(user, userID, channelID, message, evt)
                break
            // Just add any case commands if you want to..
        }
    }
})

function handleLiveCmd(user, userID, channelID, message, evt) {
    logger.info(`Live ${message}`)
    axios.get(
        streamUrl,
        {
            params: {
                'client_id': twitchClientID
            }
        }
    )
        .then(response => {
            if (response.data.stream != null) {
                bot.sendMessage({
                    to: channelID,
                    message: liveMessage,
                })
            }
            else {
                bot.sendMessage({
                    to: channelID,
                    message: offlineMessage,
                })
            }
        })
        .catch(error => {
            logger.error(error);
        })
}