const auto = (condition, client, channel, user) => {
    if (condition === 'new') {
        client.say(channel, `Welcome in @${user} <3`);
    }
};

module.exports = auto;