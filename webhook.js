
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json()); // creates http server
let alert ={} ;



app.post('/', (req, res) => {
    alert = req.body;
    res.send("alert recieved !!");
    console.log("alert recieved !!");
});
app.get('/', (req, res) => {
    if(alert){
       res.send(alert);
       console.log(alerts);
       console.log("alert was sent !!");
    }

});

app.listen(3000, () => console.log('[blockchain] Webhook is listening'));