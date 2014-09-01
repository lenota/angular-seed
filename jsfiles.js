var fs = require('fs');
//"./dist/scripts/"
function jsfiles(dir) {
    var files = [], allfiles = fs.readdirSync(dir);

    for (var i in allfiles) {
        var current = allfiles[i];
        if (current.indexOf(".min.js") == -1 && current.indexOf(".js", current.length - 3) != -1) {
            files.push(current)
        }
    }
    return files;
}
exports.jsfiles = jsfiles;