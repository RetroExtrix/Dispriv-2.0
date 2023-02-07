const express = require('express')
const app = express()
const fs = require('fs')
const crypto = require('crypto')
const Util = require('../logger');

const Database = require('@replit/database');
const db = new Database();

app.post('/api/*/auth/login', (req, res) => {
  var user = req.body.login;
  var pass = req.body.password;

  db.get(user + '.' + pass).then(userInfo => {
    // { token, userId, disabled }

    if (userInfo == null) {
      Util.GenAccountErrorLogin("DISPRIV_INVALID_PASS", "Your email or password is incorrect.", res, "all");
      return;
    }

    if (userInfo.disabled == true) {
      Util.GenAccountErrorLogin("DISPRIV_PERMANENTLY_DISABLED", "Your Dispriv account is disabled.", res, "all");
      return;
    }

    res.json({
      "token": userInfo.token
    });
  })
})



app.post('/api/*/auth/register', (req, res) => {
  if (!req.body.password || !req.body.username || !req.body.email)
  {
    Util.GenAccountErrorRegister("DISPRIV_NO_ARGUMENTS", "Please fill in all required fields.", res, "all");
    return;
  }
  var userId = req.body.username.replace(/ /g, '_');

  if (fs.existsSync(`./user/${userId}.json`)) {
    Util.GenAccountErrorRegister("DISPRIV_ACCOUNT_ALREADY_EXISTS", "A Dispriv account with this username already exists.", res, "username");
    return;
  }

  crypto.randomBytes(48, (err, buf) => {
    if (err) {
      Util.LogError(err);
      Util.GenAccountErrorRegister("DISPRIV_INTERNAL_ERROR", "There was an internal error. Please try again.", res, "all");
      return;
    }

    var token = buf.toString('hex');

    var settings = JSON.parse(fs.readFileSync('./assets/basic-account-settings.json').toString());

    db.set(req.body.email + "." + req.body.password, {
      "token": token,
      "userId": userId,
      "disabled": false
    });

    db.set(token, {
      "userId": userId,
      "settings": settings
    })

    var discriminator = Math.floor(1000 + Math.random() * 9000);

    fs.writeFileSync(`./user/${userId}.json`, JSON.stringify(
      {
        "user": {
          "id": userId,
          "username": req.body.username,
          "avatar": null,
          "discriminator": discriminator,
          "public_flags": 64,
          "flags": 64,
          "purchased_flags": 3,
          "premium_usage_flags": 5,
          "banner": null,
          "banner_color": null,
          "accent_color": null,
          "bio": "I'm a **Dispriv** user.",
          "locale": "en-US",
          "nsfw_allowed": true,
          "mfa_enabled": false,
          "premium_type": 2,
          "email": req.body.email,
          "verified": true,
          "phone": 696969696
        },
        "profilecard": {
          "user": {
            "id": userId,
            "username": req.body.username,
            "avatar": null,
            "discriminator": discriminator,
            "public_flags": 64,
            "flags": 64,
            "banner": null,
            "banner_color": null,
            "accent_color": null,
            "bio": "I'm a **Dispriv** user."
          },
          "connected_accounts": [],
          "premium_since": null,
          "premium_guild_since": null,
          "mutual_guilds": []
        },
        "friends": [
          {
            "id": userId + "|Dispriv",
            "type": 1,
            "nickname": null,
            "user": {
                "id": "Dispriv",
                "username": "Dispriv",
                "avatar": null,
                "discriminator": "0000",
                "public_flags": -7
            }
          }
        ],
        "settings": settings
      }, null, '\t'));

    res.json(
      {
        "token": token
      }
    );
  });
});

app.get('/api/*/users/@me', (req, res) => {
  var userInfo = db.get(req.headers.authorization);
  if (!userInfo) {
    Util.GenError(401, '401: Unauthorized.', res);
    return;
  }

  var userId = userInfo.userId;

  if (!fs.existsSync(`./user/${userId}.json`)) {
    Util.GenError(401, '401: Unauthorized.', res);
    console.log("no")
    return;
  }

  var rawUserData = fs.readFileSync(`./user/${userId}.json`);

  res.json(rawUserData.toString());
});

module.exports = app;