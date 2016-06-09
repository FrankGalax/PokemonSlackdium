module.exports = {
    randomChoice: function (arr) {
        var r = Math.random();
        return arr[Math.floor(r*arr.length)];
    }
};