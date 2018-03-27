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
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
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
                        sendMessage(senderId, "a simple mermaid " + 'Hi cutie pie');
                    } else { sendMessage(senderId, "a simple mermaid " + "Sorry, I do not understand anything"); }
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
            access_token: "mã_truy_cập_trang",
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