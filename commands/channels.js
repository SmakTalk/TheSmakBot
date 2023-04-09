const authorizedUsers = require('../constants/authorized');

const channels = (client, target, command, context) => {
    const args = command.split(' ');
    if (args.length > 1) {
        switch(args[1]) {
            case 'add':
            case 'enter':
            case 'join':
                if (authorizedUsers.includes(context.userName)) {
                    if (args[2]) {
                        client.join(args[2]).then((val) => {
                            const joinedChannel = val[0].replace('#', '');
                            client.say(target, `I have joined ${joinedChannel}`);
                        });
                    } else {
                        client.say(target, `${context.displayName} You forgot to enter a channel name FailFish`);
                    }
                }
                break;
            case 'list':
                if (authorizedUsers.includes(context.userName)) {
                    const list = client.getChannels();
                    list.forEach((val, index, array) => {
                        array[index] = val.replace('#', '');
                    });
                    const listString = list.toString().split(',').join(', ');
                    client.say(target, `List: ${listString}`);
                }
                break;
            case 'leave':
            case 'part':
            case 'remove':
                if (authorizedUsers.includes(context.userName)) {
                    if (args[2]) {
                        const list = client.getChannels();
                        if (list.includes('#' + args[2].toLowerCase())) {
                            client.part(args[2]).then((val) => {
                                const partedChannel = val[0].replace('#', '');
                                client.say(target, `I have left ${partedChannel}`);
                            });
                        }
                    } else {
                        client.say(target, `${context.displayName} You forgot to enter a channel name FailFish`);
                    }
                }
                break;
        }
    } else {
        client.say(target, `Argument missing. Available arguments: add/enter/join, list, leave/part/remove`);
    }
};

module.exports = channels;