const authorizedUsers = require('../constants/authorized');

const channels = async (client, channel, command, context) => {
    const args = command.split(' ');
    if (args.length > 1 && authorizedUsers.includes(context.userName)) {
        switch(args[1]) {
            case 'add':
            case 'enter':
            case 'join':
                if (args[2]) {
                    await client.join(args[2]);
                    console.log(`Joined channel: ${args[2]}`);
                    console.log('------------');
                } else {
                    await client.say(channel, `${context.displayName} You forgot to enter a channel name FailFish`);
                }
                break;
            case 'list':
                const list = client.currentChannels;
                list.forEach((val, index, array) => {
                    array[index] = val.replace('#', '');
                });
                const listString = list.toString().split(',').join(', ');
                await client.say(channel, `List: ${listString}`);
                break;
            case 'leave':
            case 'part':
            case 'remove':
                if (args[2]) {
                    if (args[2].toLowerCase() === 'smaktalk94') {
                        await client.say(channel, `I'm sorry, ${context.displayName}. I'm afraid I can't do that MrDestructoid`);
                    } else {
                        const list = client.currentChannels;
                        if (list.includes('#' + args[2].toLowerCase())) {
                            client.part(args[2]);
                            console.log(`Partedd channel: ${args[2]}`);
                            console.log('------------');
                        }
                    }
                } else {
                    await client.say(channel, `${context.displayName} You forgot to enter a channel name FailFish`);
                }
                break;
        }
    } else {
        await client.say(channel, `Argument missing. Available arguments: add/enter/join, list, leave/part/remove`);
    }
};

module.exports = channels;