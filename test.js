const {createServer} = require('http');

createServer((req, res) => req.pipe(res)).listen(5000);
