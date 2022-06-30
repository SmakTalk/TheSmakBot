require('dotenv').config();
const https = require('https');

const smakapi = (data, path, method) => {
    return new Promise((resolve, reject) => {
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
            let chunk = '';
            console.log(`statusCode: ${res.statusCode}`);
    
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
    
        if (data) {
            req.write(data);
        }
        req.end();
    });
};

module.exports = smakapi;