require('dotenv').config();
const http = require('../constants/http.js');
const { PubSubClient } = require('@twurple/pubsub');
const smakapi = require('./smakapi.js');

const whisperChat = async (authProvider, client, api) => {
    const userId = process.env.USER_ID;
    const pubSubClient = new PubSubClient({ authProvider });
    let trivia;

    pubSubClient.onWhisper(userId, async (message) => {
        if (message.text !== undefined && message.senderDisplayName === 'SmakTalk94') {
            const messageArr = message.text.split(/: (.*)/s);
            if (messageArr[0] && messageArr[1]) {
                switch (messageArr[0]) {
                    case 'set channel':
                        if (client.currentChannels.includes(messageArr[0])) {
                            client.say(messageArr[0], messageArr[1]);
                        } else {
                            api.whispers.sendWhisper(userId, 499005819, `I have not joined ${messageArr[0].slice(1)}'s chat`);
                        }
                        break;
                    case 'brb':
                        if (messageArr[1] === 'start') {
                            trivia = JSON.parse(await smakapi(`/trivia`, http.GET));
                            client.say('#smaktalk94', 'Hey chat! The streamer has stepped away for now, so it\'s time for BRB Movie Trivia!');
                            setTimeout(() => client.say('#smaktalk94', `Question: ${trivia["Question"]}`), 5000);
                        } else if (messageArr[1] === 'stop' && trivia) {
                                client.say('#smaktalk94', `Answer: ${trivia["Answer"]}`);
                                trivia = null;
                        }
                        break;
                }
            }
        }
    });

    pubSubClient.onListenError((handler, error, userInitiated) => {
        console.log(error);
    });
};

module.exports = whisperChat;