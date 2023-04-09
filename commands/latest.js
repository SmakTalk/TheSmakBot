const http = require('../constants/http.js');
const smakapi = require('../api/smakapi.js');

const latest = async (client, target, commandName, context) => {
    const streamerName = (commandName.split(' ')[1].charAt(0) === '@') ? commandName.split(' ')[1].substring(1).toLowerCase() : commandName.split(' ')[1].toLowerCase();
    const latestStr = await smakapi(`/music-streamers?streamer=${streamerName}`, http.GET);
    client.say(target, `${context['display-name']} ${latestStr}`);
};

module.exports = latest;