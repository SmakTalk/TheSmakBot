const { greetedUsers, raiders } = require('../constants/users.js');

const auto = async (condition, client, channel, user) => {
    switch (condition) {
        case 'new':
            await client.say(channel, `Welcome in @${user} <3`);
            greetedUsers[user] = 1;
            break;
        case 'first':
            await client.say(channel, `Hi @${user} HeyGuys`);
            greetedUsers[user] = 1;
            break;
        case 'raider':
            await client.say(channel, `Thank you so much for the raid @${user}! We really appreciate you bringing your community here!`);
            const index = raiders.indexOf(user);
            raiders.splice(index, 1);
            greetedUsers[user] = 1;
            break;
        case 'joined':
            await client.say(channel, `I have joined ${user}`);
            break;
        case 'parted':
            await client.say(channel, `I have left ${user}`);
            break;
    }
};

module.exports = auto;