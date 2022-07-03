const general = (client, target, command, context) => {
    const args = command.split(' ');
    switch (args[0]) {
        case '$about':
            client.say(target, `Hello! I am SmakTalk94's personal assistant! I'm a work-in-progress, so I can't do much at the moment.`);
            break;
        case '$back':
            (args.length > 1) ? client.say(target, `Welcome back ${args[1]} <3`) : client.say(target, `Welcome back ${context['display-name']} <3`);
            break;
        case '$bot':
            client.say(target, `Beep boop MrDestructoid`);
            break;
        case '$commands':
            client.say(target, `Available commands: $about, $back, $bot, $channel, $hi, and $hug`);
            break;
        case '$hi':
            (args.length > 1) ? client.say(target, `Hi ${args[1]} <3`) : client.say(target, `Hi ${context['display-name']} <3`);
            break;
        case '$hug':
            (args.length > 1) ? client.action(target, `${context['display-name']} gives a big, friendly hug to ${args[1]} (but only if ${args[1]} accepts)`) : client.say(target, `gives a big, friendly hug to ${context['display-name']}`);
            break;
        // default:
        //     client.say(target, `${context['display-name']} Command not found`);
    }
};

module.exports = general;