require('dotenv').config();
const tmi = require('tmi.js');

const options = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ],
    connection: {
        port: process.env.PORT || 443
    }
};

const client = new tmi.client(options);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();

function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
  
    const commandName = msg.trim();
  
    if (commandName === '!dice') {
        const num = rollDice();
        client.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandName} command`);
    } else if (commandName === '!hello') {
        client.say(target, `Hello! I am SmakTalk94's personal assistant! I'm a work-in-progress, so I can't do much at the moment. In fact, all I can do is print this message.`);
        console.log(`* Executed ${commandName} command`);
    } else {
        console.log(`* Unknown command ${commandName}`);
    }
}

function rollDice () {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}