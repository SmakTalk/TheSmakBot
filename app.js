require('dotenv').config();
const tmi = require('tmi.js');
const command = require('./commands');
const whisperChat = require('./api/twitchapi');

const options = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
};

const client = new tmi.client(options);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();

whisperChat(client);

async function onMessageHandler (target, context, msg, self) {
    if (self) { return; }
  
    const commandName = msg.trim();

    if (commandName.startsWith('$')) {
        switch (commandName.split(' ')[0]) {
            case '$channel':
                command.channels(client, target, commandName, context);
                break;
            case '$enter':
                command.entries(client, target, commandName, context);
                break;
            case '$latest':
                await command.latest(client, target, commandName, context);
                break;
            case '$raid':
                command.raids(commandName);
                break;
            case '$drawing':
                command.entries(client, target, commandName, context);
                break;
            case '$streamer':
                command.streamers(commandName);
                break;
            default:
                command.general(client, target, commandName, context);
        }
    }
}

function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}