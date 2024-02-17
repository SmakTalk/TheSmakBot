const general = async (client, channel, command, context) => {
    const args = command.split(' ');
    switch (args[0]) {
        case '$about':
            await client.say(channel, `Hello! I am SmakTalk94's personal assistant!`);
            break;
        case '$back':
            (args.length > 1) ? await client.say(channel, `Welcome back ${args[1]} <3`) : await client.say(channel, `Welcome back @${context.displayName} <3`);
            break;
        case '$bot':
            await client.say(channel, `Beep boop MrDestructoid`);
            break;
        case '$commands':
            await client.say(channel, `Available commands: $about, $back, $bot, $channel, $hi, and $hug`);
            break;
        case '$hi':
            (args.length > 1) ? await client.say(channel, `Hi ${args[1]} HeyGuys`) : await client.say(channel, `Hi @${context.displayName} HeyGuys`);
            break;
        case '$hug':
            if (args[1] && args[1].toLowerCase() === '@islandvibingpresents' || args[1].toLowerCase() === 'islandvibingpresents') {
                await client.say(channel, 'This is totally broken. 🧁');
            } else {
                (args.length > 1) ? await client.action(channel, `${context.displayName} gives a big, friendly hug to ${args[1]} (but only if ${args[1]} accepts)`) : await client.action(channel, `gives a big, friendly hug to @${context.displayName}`);
            }
            break;
    }
};

module.exports = general;