require('dotenv').config();
const tmi = require('tmi.js');
const command = require('./commands');

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

function onMessageHandler (target, context, msg, self) {
    if (self) { return; }
  
    const commandName = msg.trim();

    if (commandName.startsWith('$') && context.username === 'smaktalk94') {
        switch (commandName.split(' ')[0]) {
            case '$raid':
                command.raids(commandName);
                break;
            case '$streamer':
                command.streamers(commandName);
                break;
            default:
                command.general(commandName);
        }
        // if (commandName === '$about') {
        //     client.say(target, `Hello! I am SmakTalk94's personal assistant! I'm a work-in-progress, so I can't do much at the moment. In fact, all I can do is print this message.`);
        //     console.log(`* Executed ${commandName}`);
        // }
    }
}

function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}