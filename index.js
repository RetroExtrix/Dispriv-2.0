const express = require('express'); 
const app = express();
const axios = require('axios')
const fs = require('fs')
const bodyparser = require('body-parser');

const logger = require('./logger')

app.use(bodyparser.json());
app.use(express.static("public"))
app.listen(process.env.PORT || 80);

// dev notes: the 736686 file has strings for the site, ad39f9a23bdccaf76aed for the login screen strings

// NOTE FOR NOTPIES: make it so the code is in different files like
// oauth.js, guildmanager.js, websocket.js, etc.


fs.readdirSync(`${__dirname}/routes`).forEach(
    route => {
      if (route != "websocket.js")
        app.use(require(`${__dirname}/routes/${route.split('.')[0]}`))
      else
        require('./routes/websocket');
    }
)

logger.Log("Welcome to Dispriv! Server up and running!");