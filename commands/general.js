const general = async (client, channel, command, context) => {
    const args = command.split(' ');
    switch (args[0]) {
        case '$about':
            await about(client, channel);
            break;
        case '$back':
            await back(args, client, channel, context);
            break;
        case '$bot':
            await bot(client, channel);
            break;
        case '$commands':
            await commands(client, channel);
            break;
        case '$hi':
            await hi(args, client, channel, context);
            break;
        case '$hug':
            await hug(args, client, channel, context);
            break;
    }
};

const about = async (client, channel) =>{
    await client.say(channel, `Hello! I am SmakTalk94's personal assistant!`);
};

const back = async (args, client, channel, context) => {
    (args.length > 1) ? await client.say(channel, `Welcome back ${args[1]} <3`) : await client.say(channel, `Welcome back @${context.displayName} <3`);
};

const bot = async (client, channel) => {
    await client.say(channel, `Beep boop MrDestructoid`);
};

const commands = async (client, channel) => {
    await client.say(channel, `Available commands: $about, $back, $bot, $channel, $hi, and $hug`);
};

const hi = async (args, client, channel, context) => {
    (args.length > 1) ? await client.say(channel, `Hi ${args[1]} HeyGuys`) : await client.say(channel, `Hi @${context.displayName} HeyGuys`);
};

const hug = async (args, client, channel, context) => {
    if (args[1] && args[1].toLowerCase() === '@islandvibingpresents' || args[1].toLowerCase() === 'islandvibingpresents' || args[1].toLowerCase() === 'vibing') {
        await client.say(channel, 'This is totally broken. 🧁');
    } else {
        (args.length > 1) ? await client.action(channel, `${context.displayName} gives a big, friendly hug to ${args[1]} (but only if ${args[1]} accepts)`) : await client.action(channel, `gives a big, friendly hug to @${context.displayName}`);
    }
};

module.exports = general;