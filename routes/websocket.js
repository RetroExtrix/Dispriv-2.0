const wsthing = require('ws');

// what the dog doin
const wss = new wsthing.Server({ port: 6969 });

module.exports = wss;