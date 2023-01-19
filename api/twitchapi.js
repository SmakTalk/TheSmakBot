require('dotenv').config();
const http = require('../constants/http.js');
const smakapi = require('./smakapi.js');
const https = require('https');
const { RefreshingAuthProvider } = require('@twurple/auth');
const { PubSubClient } = require('@twurple/pubsub');

const whisperChat = async (client) => {
    const authProvider = await twitchAuth();

    const pubSubClient = new PubSubClient();
    const userId = await pubSubClient.registerUserListener(authProvider);

    await pubSubClient.onWhisper(userId, async (message) => {
        if (message.text !== undefined && message.senderDisplayName === 'SmakTalk94') {
            const messageArr = message.text.split(/: (.*)/s);
            const target = await getTarget(messageArr[0]);
            const list = client.getChannels();
            if (list.includes(target)) {
                client.say(target, messageArr[1]);
            } else {
                const message = `I have not joined ${target.slice(1)}'s chat`;
                const tokenObj = await authProvider._doGetAccessToken();
                sendWhisper(message, tokenObj.accessToken);
            }
        }
    });
};

const twitchAuth = async () => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const tokenData = JSON.parse(await smakapi('/token', http.GET));

    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async newTokenData => await smakapi('/token', http.POST, newTokenData)
        },
        tokenData
    );

    return authProvider;
};

const getTarget = async (alias) => {
    let target = await smakapi(`/target?alias=${alias}`, http.GET);
    if (!target) {
        target = '#' + alias.toLowerCase();
    }
    return target;
};

const sendWhisper = async (message, token, userId = 499005819) => {
    const data = JSON.stringify({
        'message': message
    });

    const options = {
        hostname: 'api.twitch.tv',
        path: `/helix/whispers?from_user_id=791543393&to_user_id=${userId}`,
        method: http.POST,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Client-Id': process.env.CLIENT_ID,
            'Content-Type': 'application/json'
        }
    };

    const req = https.request(options, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(data);
    req.end();
};

module.exports = whisperChat;