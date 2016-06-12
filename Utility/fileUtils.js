/**
 * Created by Francis on 2016-06-12.
 */
var fs = require('fs');

module.exports = {
    readFile: function(file, callback) {
        fs.readFile(file, "utf8", function(err, content) {
            var tab = [];
            var i=0;
            while (content.indexOf("\r\n")!=-1){
                tab[i] = [];
                var endOfLine = content.indexOf("\r\n");
                var line = content.substring(0,endOfLine);
                var j = 0;
                while (line.indexOf("|")!=-1) {
                    var endOfField = line.indexOf("|");
                    if (line.indexOf(".")==0) {
                        var k = 0;
                        tab[i][j] = [];
                        var subLine = line.substring(1,endOfField);
                        while (subLine.indexOf(".")!=-1) {
                            var endOfArrayField = subLine.indexOf(".");
                            tab[i][j][k] = subLine.substring(0, endOfArrayField);
                            k=k+1;
                            subLine = subLine.substring(endOfArrayField+1);
                        }
                    } else {
                        tab[i][j] = line.substring(0,endOfField);
                    }
                    line = line.substring(endOfField+1);
                    j=j+1;
                }
                content = content.substring(endOfLine+2);
                i=i+1;
            }
            callback(tab);
        });
    }
};