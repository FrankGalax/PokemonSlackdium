/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ______     ______     ______   __  __     __     ______
 /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
 \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
 \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
 \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/
 This is a sample Slack bot built with Botkit.
 This bot demonstrates many of the core features of Botkit:
 * Connect to Slack using the real time API
 * Receive messages based on "spoken" patterns
 * Reply to messages
 * Use the conversation system to ask questions
 * Use the built in storage system to store and retrieve information
 for a user.
 # RUN THE BOT:
 Get a Bot token from Slack:
 -> http://my.slack.com/services/new/bot
 Run your bot from the command line:
 token=<MY TOKEN> node slack_bot.js
 # USE THE BOT:
 Find your bot inside Slack to send it a direct message.
 Say: "Hello"
 The bot will reply "Hello!"
 Say: "who are you?"
 The bot will tell you its name, where it running, and for how long.
 Say: "Call me <nickname>"
 Tell the bot your nickname. Now you are friends.
 Say: "who am I?"
 The bot will tell you your nickname, if it knows one for you.
 Say: "shutdown"
 The bot will ask if you are sure, and then shut itself down.
 Make sure to invite your bot into other channels using /invite @<my bot>!
 # EXTEND THE BOT:
 Botkit has many features for building cool and useful bots!
 Read all about it here:
 -> http://howdy.ai/botkit
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var token = process.env.slackToken;

var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: token
}).startRTM();


controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message,
        ':robot_face: I am a bot named <@' + bot.identity.name +
        '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}


