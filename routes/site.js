const express = require('express')
const app = express()
const fs = require('fs')
const axios = require('axios')

// endpoints here

app.get('/', (req, res) => res.send(fs.readFileSync("./files/main.html").toString())) 

app.get('/login', (req, res) => res.send(fs.readFileSync("./files/login.html").toString())) 

app.get('/register', (req, res) => res.send(fs.readFileSync("./files/login.html").toString()))




module.exports = app;