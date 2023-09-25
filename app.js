require('dotenv').config();
const { RefreshingAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { ChatClient } = require('@twurple/chat');
const { EventSubWsListener } = require('@twurple/eventsub-ws');
const smakapi = require('./api/smakapi.js');
// const whisperChat = require('./api/twitchapi.js');
const command = require('./commands');
const Autochat = require('./constants/autochat.js');
const http = require('./constants/http.js');
let { greetedUsers, raiders } = require('./constants/users.js');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

global.messageFailed = false;

const main = async () => {
    const userId = process.env.USER_ID;
    const channels = {};
    let emoteOnlyMode = false;
    let followerOnlyMode = false;
    let subscriberOnlyMode = false;

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

    listener.onChannelRaidTo(userId, e => {
        raiders.push(e.raidingBroadcasterDisplayName);
    });

    listener.onStreamOffline(userId, e => {
        greetedUsers = {};
    });

    const client = new ChatClient({ authProvider, channels: [ process.env.CHANNEL_NAME ] });
    client.connect();

    // whisperChat(authProvider, client);

    client.onAuthenticationSuccess(() => {
        channels['#smaktalk94'] = true;
        console.log('Authentication successful!');
        console.log('------------');
    });

    client.onAuthenticationFailure((text, retryCount) => {
        console.log(text);
        console.log(retryCount);
        console.log('------------');
    });

    client.onJoin(async (channel, user) => {
        if (channel !== '#smaktalk94') {
            const channelUser = await apiClient.users.getUserByName(channel.substring(1));
            const channelSettings = await apiClient.chat.getSettings(channelUser.id);
            emoteOnlyMode = channelSettings.emoteOnlyModeEnabled;
            followerOnlyMode = channelSettings.followerOnlyModeEnabled;
            subscriberOnlyMode = channelSettings.subscriberOnlyModeEnabled;
            channels[channel] = !emoteOnlyMode && !followerOnlyMode && !subscriberOnlyMode;
            global.messageFailed = !channels[channel];
            const joinedChannel = channel.replace('#', '');
            command.auto(Autochat.JOINED, client, '#smaktalk94', joinedChannel);
        }
    });

    client.onJoinFailure((channel, reason) => {
        console.log(`Failed to join ${channel} for following reason:`);
        console.log(reason);
        console.log('------------');
    });
    
    client.onMessage(async (channel, user, text, msg) => {
        const context = msg.userInfo;
        const commandName = text.trim();

        if (context.displayName === 'TheSmakBot') { return; }
    
        if (commandName.startsWith('$')) {
            if (channels[channel]) {
                switch (commandName.split(' ')[0]) {
                    case '$channel':
                        command.channels(client, channel, commandName, context);
                        break;
                    case '$drawing':
                    case '$enter':
                        command.entries(client, channel, commandName, context);
                        break;
                    case '$raid':
                        command.raids(commandName);
                        break;
                    case '$streamer':
                        command.streamers(commandName);
                        break;
                    default:
                        command.general(client, channel, commandName, context);
                }
            } else {
                const helixUser = await apiClient.users.getUserByName(user);
                const mode = emoteOnlyMode ? 'emote-only' : followerOnlyMode ? 'follower-only' : 'subscriber-only';
                apiClient.whispers.sendWhisper(userId, helixUser.id, `${channel.substring(1)} has enabled ${mode} mode in their chat`);
            }
        }

        if (channel === '#smaktalk94' && context.displayName !== 'StreamElements' && context.displayName !== process.env.CHANNEL_NAME) {
            if (raiders.includes(context.displayName)) {
                command.auto(Autochat.RAIDER, client, channel, context.displayName);
            } else if (greetedUsers[context.displayName] !== 1) {
                command.auto(Autochat.FIRST, client, channel, context.displayName);
            }
        }
    });

    client.onMessageFailed((channel, reason) => {
        global.messageFailed = true;
        console.log(`Failed to message in ${channel.substring(1)}'s chat for following reason:`);
        console.log(reason);
        console.log('------------');
    });

    client.onPart((channel, user) => {
        const partedChannel = channel.replace('#', '');
        command.auto(Autochat.PARTED, client, '#smaktalk94', partedChannel);
    });

    client.onRitual((channel, user, ritualInfo, msg) => {
        if (channel === '#smaktalk94' && ritualInfo.ritualName === 'new_chatter') {
            command.auto(Autochat.NEW, client, channel, context.displayName);
        }
    });

    process.on('uncaughtException', error => {
        console.log(error);
        console.log('------------');
    });
};

main();