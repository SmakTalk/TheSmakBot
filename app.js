require('dotenv').config();
const { RefreshingAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { ChatClient } = require('@twurple/chat');
const { EventSubWsListener } = require('@twurple/eventsub-ws');
const smakapi = require('./api/smakapi.js');
// const whisperChat = require('./api/twitchapi.js');
const command = require('./commands');
const Autogreet = require('./constants/autogreet.js');
const http = require('./constants/http.js');
let { greetedUsers, raiders } = require('./constants/users.js');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const main = async () => {
    const userId = process.env.USER_ID;

    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async (userId, newTokenData) => await smakapi('/token', http.POST, newTokenData)
        }
    );
    authProvider.addUser(userId, JSON.parse(await smakapi('/token', http.GET)), ['chat']);
    const apiClient = new ApiClient({ authProvider });

    const listener = new EventSubWsListener({ apiClient });
    listener.start();

    const client = new ChatClient({ authProvider, channels: [ process.env.CHANNEL_NAME ] });

    client.connect();

    // whisperChat(authProvider, client);

    client.onMessage(async (channel, user, text, msg) => {
        if (user === 'thesmakbot') { return; }
      
        const context = msg.userInfo;
        const commandName = text.trim();
    
        if (commandName.startsWith('$')) {
            switch (commandName.split(' ')[0]) {
                case '$channel':
                    command.channels(client, channel, commandName, context);
                    break;
                case '$enter':
                    command.entries(client, channel, commandName, context);
                    break;
                case '$raid':
                    command.raids(commandName);
                    break;
                case '$drawing':
                    command.entries(client, channel, commandName, context);
                    break;
                case '$streamer':
                    command.streamers(commandName);
                    break;
                default:
                    command.general(client, channel, commandName, context);
            }
        }

        if (user !== 'StreamElements') {
            if (raiders.includes(context.displayName)) {
                command.auto(Autogreet.RAIDER, client, channel, context.displayName);
            } else if (greetedUsers[context.displayName] !== 1) {
                command.auto(Autogreet.FIRST, client, channel, context.displayName);
            }
        }
    });

    client.onRitual((channel, user, ritualInfo, msg) => {
        if (ritualInfo.ritualName === 'new_chatter') {
            command.auto(Autogreet.NEW, client, channel, context.displayName);
        }
    });

    client.onAuthenticationSuccess(() => {
        console.log('Authentication successful!');
    });

    client.onAuthenticationFailure((text, retryCount) => {
        console.log(text);
        console.log(retryCount);
        console.log('------------');
    });

    listener.onStreamOffline(userId, e => {
        greetedUsers = {};
    });

    listener.onChannelRaidTo(userId, e => {
        raiders.push(e.raidingBroadcasterDisplayName);
    });
};

main();