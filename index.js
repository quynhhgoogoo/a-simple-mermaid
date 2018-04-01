// # SimpleServer
// A simple chat bot server

var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var server = http.createServer(app);

app.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.send("Hi, I am your chatbot");
});

app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'gauismermaid') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

// when someone send messages to messenger bot
app.post('/webhook', function(req, res) {
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            if (message.message) {
                // if user send a message
                if (message.message.text) {
                    var text = message.message.text;
                    if (text == 'hi' || text == "hello") {
                        sendMessage(senderId, 'Hi cutie pie');
                    } else { sendMessage(senderId, "Sorry, I do not understand anything, quynhhgoogoo is stupid. She has not upadated for me :("); }
                }
            }
        }
    }

    res.status(200).send("OK");
});

// send informations to API
function sendMessage(senderId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: "EAAF2L3AUE7ABADK4tcPtG7q944uiM108ZC8Hp5EDLqQg9eJ8ohzDujzh7vJVqznUZAF0rNGAeXm84u7coN5Hmwa3febYKBu55LAUCTuzn5VLWscZBUkKBa3V5IPCyLDQXFBtLwoGF97zavHG0dUZBzFvkiKZAzNXKTzSSkZBPxAwZDZD",
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    });
}

function creativeBroadcastMessage(messageData) {
   request({
     url: 'https://graph.facebook.com/v2.11/me/message_creatives',
     qs: { 
		access_token:  "EAAF2L3AUE7ABADK4tcPtG7q944uiM108ZC8Hp5EDLqQg9eJ8ohzDujzh7vJVqznUZAF0rNGAeXm84u7coN5Hmwa3febYKBu55LAUCTuzn5VLWscZBUkKBa3V5IPCyLDQXFBtLwoGF97zavHG0dUZBzFvkiKZAzNXKTzSSkZBPxAwZDZD",
	 },
     method: 'POST',
     json: messageData     
   })
}