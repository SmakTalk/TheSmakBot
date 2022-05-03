const general = function general(command, user) {
    const args = command.split(' ');
    switch (args[0]) {
        case '$about':
            return `Hello! I am SmakTalk94's personal assistant! I'm a work-in-progress, so I can't do much at the moment.`;
        case '$back':
            return (args.length > 1) ? `Welcome back ${args[1]} <3` : ``;
        case '$bot':
            return `Beep boop MrDestructoid`;
        case '$hi':
            return (args.length > 1) ? `Hi ${args[1]} <3` : `Hi ${user} <3`;
        case '$hug':
            return (args.length > 1) ? `/me ${user} gives a big, friendly hug to ${args[1]} (but only if ${args[1]} accepts)` : `/me gives a big, friendly hug to ${user}`;
        default:
            return `${user} Command not found`;
    }
}

module.exports = general;