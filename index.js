var Botkit = require('botkit');
var os = require('os');
var pokedex = require('./model/pokedex.js');
var dictUtils = require('./Utility/dictUtils.js');

var token = process.env.slackToken;

var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: token
}).startRTM();

controller.hears(['walk'], 'direct_message,direct_mention,mention', function(bot, message) {
    try {
        var pokemon = dictUtils.randomChoice(pokedex.pokemons);

        var attachments = {
            'text': 'A wild ' + pokemon.name + ' has appeared!',
            'attachments': [
                {
                    'fallback': 'A wild ' + pokemon.name + ' has appeared!',
                    'image_url': pokemon.imageUrl,
                    'text': 'A wild ' + pokemon.name + ' has appeared!'
                }
            ]
        };
        bot.reply(message, attachments);
    }
    catch (ex) {
        bot.reply(message, ex.message);
    }
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


