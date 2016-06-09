module.exports = {
    randomChoice: function (dict) {
        var result;
        var count = 0;
        for (var prop in dict)
            if (Math.random() < 1/++count)
                return dict[prop];
        return null;
    }
};