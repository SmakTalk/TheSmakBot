const general = (client, channel, command, context) => {
    const args = command.split(' ');
    switch (args[0]) {
        case '$about':
            client.say(channel, `Hello! I am SmakTalk94's personal assistant! I'm a work-in-progress, so I can't do much at the moment.`);
            break;
        case '$back':
            (args.length > 1) ? client.say(channel, `Welcome back @${args[1]} <3`) : client.say(channel, `Welcome back @${context.displayName} <3`);
            break;
        case '$bot':
            client.say(channel, `Beep boop MrDestructoid`);
            break;
        case '$commands':
            client.say(channel, `Available commands: $about, $back, $bot, $channel, $hi, and $hug`);
            break;
        case '$hi':
            (args.length > 1) ? client.say(channel, `Hi @${args[1]} <3`) : client.say(channel, `Hi @${context.displayName} <3`);
            break;
        case '$hug':
            (args.length > 1) ? client.action(channel, `${context.displayName} gives a big, friendly hug to @${args[1]} (but only if @${args[1]} accepts)`) : client.say(channel, `gives a big, friendly hug to @${context.displayName}`);
            break;
        default:
            client.say(channel, `${context.displayName} Command not found`);
    }
};

module.exports = general;