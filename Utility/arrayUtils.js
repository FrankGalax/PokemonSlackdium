module.exports = {
    randomChoice: function(arr) {
        var r = Math.random();
        return arr[Math.floor(r*arr.length)];
    },
    where: function (arr, pred) {
        var res = [];
        for (var i in arr)
        {
            if (pred(arr[i]))
                res.push(arr[i])
        }
        return res;
    }
};