var Botkit = require('botkit');
var os = require('os');
var express = require('express');

var pokedex = require('./model/pokedex.js');
var arrayUtils = require('./Utility/arrayUtils.js');
var dictUtils = require('./Utility/dictUtils.js');

var teamController = require('./controller/teamController.js');

var token = process.env.slackToken;

var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: token
}).startRTM();

controller.hears(['walk'], 'direct_message,direct_mention,mention', function(bot, message) {
    try {
        var team = teamController.getTeam(controller, message);
        var allWildPokemons = arrayUtils.where(pokedex.pokemons, function (p) { return p.wild; });
        var wildPokemon = arrayUtils.randomChoice(allWildPokemons);

        bot.startConversation(message, function(err, convo) {

            var attachments = {
                'text': 'A wild ' + wildPokemon.name + ' has appeared!',
                'attachments': [
                    {
                        'fallback': 'A wild ' + wildPokemon.name + ' has appeared!',
                        'image_url': wildPokemon.imageUrl
                    }
                ]
            };
            convo.say(attachments);

            var throwPokeball = function(response, convo) {
                var r = Math.random();
                if (r < wildPokemon.catchRate) {
                    pokemonCaught(response, convo);
                }
                else {
                    convo.say(arrayUtils.randomChoice([
                        "Oh no! The Pokémon broke free!",
                        "Aww! It appeared to be caught!",
                        "Aargh! Almost had it!",
                        "Gah! It was so close, too!"
                    ]));
                    convo.repeat();
                }
                convo.next();
            };

            var pokemonCaught = function (response, convo) {
                try {
                    var addParams = {
                        id:message.user
                    };
                    for (var i = 0 ; i < team.length ; ++i) {
                        addParams["poke" + (i+1)] = team[i].id;
                    }
                    addParams["poke" + (team.length+1)] = wildPokemon.id;
                    controller.storage.users.save(addParams, function (err) {
                        if (err) {
                            convo.say(err);
                        }
                    });
                    convo.say("Gotcha! " + wildPokemon.name + " was caught!");
                    convo.next();
                }
                catch (ex) {
                    convo.say((message == null) + " " + ex.message);
                    convo.next();
                }
            };

            convo.ask('You can [throw] a pokeball or [run]',[
                {
                    pattern: 'throw',
                    callback: function(response,convo) {
                        throwPokeball(response, convo);
                        convo.next();
                    }
                },
                {
                    pattern: 'run',
                    callback: function(response,convo) {
                        convo.say('You ran away.');
                        convo.next();

                    }
                },
                {
                    default: true,
                    callback: function(response,convo) {
                        convo.repeat();
                        convo.next();
                    }
                }
            ]);
        });
    }
    catch (ex) {
        bot.reply(message, ex.message);
    }
});

controller.hears(['debug'], 'direct_message,direct_mention,mention', function(bot, message) {
    try {
        controller.storage.users.get(message.user, function (err, userData) {
            if (userData) {
                bot.reply(message, JSON.stringify(userData));
            }
            else {
                bot.reply(message, "no data");
            }
        });
    }
    catch (ex) {
        bot.reply(message, ex.message);
    }
});

controller.hears(['show team'], 'direct_message,direct_mention,mention', function(bot, message) {
    try {
        var pokemons = teamController.getTeam(controller, message);
        if (pokemons.length == 0) {
            bot.reply(message, "no data");
        }
        else {
            bot.reply(message, JSON.stringify(pokemons));
        }
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

var app = express();

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('App listening on port ' + port);
});


