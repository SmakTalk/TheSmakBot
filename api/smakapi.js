require('dotenv').config();
const https = require('https');

const smakapi = (path, method, data = null) => {
    return new Promise((resolve, reject) => {
        const reqData = (data) ? JSON.stringify(data) : null;

        const options = {
            hostname: process.env.API_URL,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Secret': process.env.SECRET
            }
        };

        const req = https.request(options, (res) => {
            let chunk = '';
    
            res.on('data', (d) => {
                chunk += d;
            });

            res.on('end', () => {
                try {
                    resolve(chunk);
                } catch (e) {
                    reject(e.message);
                }
            });
        });
    
        req.on('error', (error) => {
            reject(error);
        });
    
        if (reqData) {
            req.write(reqData);
        }
        req.end();
    });
};

module.exports = smakapi;