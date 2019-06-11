var Discord = require('discord.io')
var logger = require('winston')
var axios = require('axios')
var auth = require('./auth.json')
const dotenv = require('dotenv');

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
    colorize: true
})

logger.level = 'debug'

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
})

dotenv.config();

var isLive = false

var streamApiBaseUrl = `https://api.twitch.tv/kraken/streams/`
var twitchUser = process.env.TWITCH_USER
var twitchUserID = process.env.TWITCH_USER_ID
var notificationChannelID = process.env.NOTIFICATION_CHANNEL_ID
var twitchClientID = process.env.TWITCH_CLIENT_ID
var streamUrl = streamApiBaseUrl + twitchUserID
var twitchUrl = `https://www.twitch.tv/${twitchUser}`
var liveNotificationMessage = `Hey @everyone! ${twitchUser} is live! Check her out at ${twitchUrl}`
var liveMessage = `Hi @everyone! ${twitchUser} is live! Check her out at ${twitchUrl}`
var streamEndMessage = `${twitchUser} is live at ${twitchUrl}`
var offlineMessage = `${twitchUser} is currently offline`

function checkLiveStatus() {
    axios.get(
        streamUrl,
        {
            params: {
                'client_id': twitchClientID
            }
        }
    )
        .then(response => {
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
            logger.error(error);
        })
}

bot.on('ready', function (evt) {
    logger.info('Connected')
    logger.info(`Logged in as: ${evt}`)
    logger.info(evt)
    logger.info(bot.username + ' - (' + bot.id + ')')
    setInterval(checkLiveStatus, 5);
})

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ')
        var cmd = args[0]

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