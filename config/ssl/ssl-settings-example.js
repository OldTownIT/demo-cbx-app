import fs from 'fs';

const sslSettings = {
    key: fs.readFileSync('../openSSL/demo_ssl.key'),
    cert: fs.readFileSync('../openSSL/demo_ssl.crt'),
};

export default sslSettings;
