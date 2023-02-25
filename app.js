require('dotenv').config();
const { RefreshingAuthProvider } = require('@twurple/auth');
const { ChatClient } = require('@twurple/chat');
const smakapi = require('./api/smakapi.js');
const whisperChat = require('./api/twitchapi.js');
const command = require('./commands');
const http = require('./constants/http.js');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const tokenData = async () => {
    return JSON.parse(await smakapi('/token', http.GET));
};

const authProvider = async () => {
    const auth = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async newTokenData => await smakapi('/token', http.POST, newTokenData)
        }
    );
    await auth.addUserForToken(tokenData);
    return auth;
};

const client = new ChatClient({ authProvider, channels: [ process.env.CHANNEL_NAME ] });

client.connect();

whisperChat(authProvider, client);

client.onMessage(async (channel, user, text, msg) => {
    if (user === 'TheSmakBot') { return; }
  
    const commandName = text.trim();

    if (commandName.startsWith('$')) {
        switch (commandName.split(' ')[0]) {
            case '$channel':
                command.channels(client, channel, commandName, user);
                break;
            case '$enter':
                command.entries(client, channel, commandName, user);
                break;
            case '$latest':
                await command.latest(client, channel, commandName, user);
                break;
            case '$raid':
                command.raids(commandName);
                break;
            case '$drawing':
                command.entries(client, channel, commandName, user);
                break;
            case '$streamer':
                command.streamers(commandName);
                break;
            default:
                command.general(client, channel, commandName, user);
        }
    }
});

function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}