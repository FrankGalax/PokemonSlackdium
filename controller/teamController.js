var pokedex = require('./model/pokedex.js');

module.exports = {
    getTeam: function(controller, message) {
        var pokemons = [];
        controller.storage.users.get(message.user, function (err, userData) {
            if (userData) {
                for (var i = 1 ; i <= 6 ; ++i) {
                    var attr = "poke" + i;
                    if (userData[attr])
                        pokemons.push(pokedex.pokemons[userData[attr] - 1]);
                }
            }
        });
        return pokemons;
    }
};