require('dotenv').config();
const tmi = require('tmi.js');

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
    if (self) { return; } // Ignore messages from the bot
  
    const commandName = msg.trim();

    if (commandName.startsWith('$')) {
        if (commandName === '$about') {
            client.say(target, `Hello! I am SmakTalk94's personal assistant! I'm a work-in-progress, so I can't do much at the moment. In fact, all I can do is print this message.`);
            console.log(`* Executed ${commandName} command`);
        }
    }
}

function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}