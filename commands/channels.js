const authorizedUsers = require('../constants/authorized');

const channels = async (client, channel, command, context) => {
    const args = command.split(' ');
    if (args.length > 1 && authorizedUsers.includes(context.userName)) {
        const target = formatChannel(args[2]);
        switch(args[1]) {
            case 'add':
            case 'enter':
            case 'join':
                joinChannel(target, client, channel, context);
                break;
            case 'list':
                listChannels(client, channel);
                break;
            case 'leave':
            case 'part':
            case 'remove':
                partChannel(target, client, channel, context);
                break;
        }
    } else {
        await client.say(channel, `Argument missing. Available arguments: add/enter/join, list, leave/part/remove`);
    }
};

const formatChannel = (channel) => {
    if (channel) {
        return (channel.startsWith('@')) ? channel.substring(1) : channel;
    }
};

const joinChannel = async (target, client, channel, context) => {
    if (target) {
        await client.join(target);
        console.log(`Joined channel: ${target}`);
        console.log('------------');
    } else {
        await client.say(channel, `${context.displayName} You forgot to enter a channel name FailFish`);
    }
};

const listChannels = async (client, channel) => {
    const list = client.currentChannels;
    list.forEach((val, index, array) => {
        array[index] = val.replace('#', '');
    });
    const listString = list.toString().split(',').join(', ');
    await client.say(channel, `List: ${listString}`);
};

const partChannel = async (target, client, channel, context) => {
    if (target) {
        if (target.toLowerCase() === 'smaktalk94') {
            await client.say(channel, `I'm sorry, ${context.displayName}. I'm afraid I can't do that MrDestructoid`);
        } else {
            const list = client.currentChannels;
            if (list.includes('#' + target.toLowerCase())) {
                client.part(target);
                console.log(`Parted channel: ${target}`);
                console.log('------------');
            } else if ('all' === target.toLowerCase()) {
                let listStr = list[0].replace('#', '');
                list.forEach((val) => {
                    if (val !== '#smaktalk94') {
                        listStr += ', ' + val.replace('#', '');
                        client.part(val);
                    }
                });
                console.log(`Parted channels: ${listStr}`);
                console.log('------------');
            }
        }
    } else {
        await client.say(channel, `${context.displayName} You forgot to enter a channel name FailFish`);
    }
};

module.exports = channels;