const Channels = require('./channels');

const general = (client, target, command, context) => {
    const channels = new Channels();
    const args = command.split(' ');
    switch (args[0]) {
        case '$about':
            chatMessage(client, target, `Hello! I am SmakTalk94's personal assistant! I'm a work-in-progress, so I can't do much at the moment.`);
            break;
        case '$add':
            (context['username'] === 'smaktalk94') ? chatMessage(client, target, channels.addChannel(args[1])) : chatMessage(client, target, ``);
            break;
        case '$back':
            (args.length > 1) ? chatMessage(client, target, `Welcome back ${args[1]} <3`) : chatMessage(client, target, ``);
            break;
        case '$bot':
            chatMessage(client, target, `Beep boop MrDestructoid`);
            break;
        case '$commands':
            chatMessage(client, target, `Available commands: $about, $back, $bot, $hi, $hug, and $list`);
            break;
        case '$hi':
            (args.length > 1) ? chatMessage(client, target, `Hi ${args[1]} <3`) : chatMessage(client, target, `Hi ${context['display-name']} <3`);
            break;
        case '$hug':
            (args.length > 1) ? chatMessage(client, target, `/me ${context['display-name']} gives a big, friendly hug to ${args[1]} (but only if ${args[1]} accepts)`) : chatMessage(client, target, `/me gives a big, friendly hug to ${context['display-name']}`);
            break;
        case '$list':
            (context['username'] === 'smaktalk94') ? channels.listChannels().then(list => chatMessage(client, target, `List: ${list}`)) : chatMessage(client, target, ``);
            break;
        default:
            chatMessage(client, target, `${context['display-name']} Command not found`);
    }
};

const chatMessage = (client, target, message) => {
    client.say(target, message);
};

module.exports = general;