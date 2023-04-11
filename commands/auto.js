const { greetedUsers, raiders } = require('../constants/users.js');

const auto = (condition, client, channel, user) => {
    switch (condition) {
        case 'new':
            client.say(channel, `Welcome in @${user} <3`);
            greetedUsers[user] = 1;
            break;
        case 'first':
            client.say(channel, `Hello @${user} HeyGuys`);
            greetedUsers[user] = 1;
            break;
        case 'raider':
            client.say(channel, `Thank you so much for the raid @${user}! We really appreciate you bringing your community here!`);
            const index = raiders.indexOf(user);
            raiders.splice(index, 1);
            greetedUsers[user] = 1;
            break;
    }
};

module.exports = auto;