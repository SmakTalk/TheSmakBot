require('dotenv').config();
const https = require('https');

const smakapi = function smakapi(data, path, method) {
    if (data) {
        const data = JSON.stringify(data);
    }

    const options = {
        hostname: process.env.API_URL,
        path: path,
        method: method,
        headers: {
            'Secret': process.env.SECRET
        }
    };

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    if (data) {
        req.write(data);
    }
    req.end();
};

module.exports = smakapi;