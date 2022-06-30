const smakapi = require('../api/smakapi');
const http = require('../constants/http');

module.exports = class Channels {
    path = '/channels';

    addChannel(channel) {}

    listChannels() {
        return smakapi(null, this.path, http.GET);
    }

    removeChannel(channel) {}
};