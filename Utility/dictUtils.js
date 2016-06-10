module.exports = {
    randomChoice: function (dict) {
        var attrs = [];
        for (var attr in dict)
            attrs.push(attr);
        var r = Math.random();
        return dict[attrs[Math.floor(r*attrs.length)]];
    }
};