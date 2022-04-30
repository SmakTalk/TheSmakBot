const general = function general(command, user) {
    const args = command.split(' ');
    switch (args[0]) {
        case '$about':
            return `Hello! I am SmakTalk94's personal assistant! I'm a work-in-progress, so I can't do much at the moment.`;
        case '$hi':
            return (args.length > 1) ? `Hi ${args[1]} <3` : `Hi ${user} <3`;
        default:
            return `Command not found`;
    }
}

module.exports = general;