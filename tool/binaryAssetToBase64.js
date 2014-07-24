var fs = require('fs');

var src = null;
var out = null;
var assetName = null;

var argv = process.argv;
for (var i = 0; i < argv.length; i++) {
    if (argv[i] === '-s' || argv === '--src') {
        src = argv[i + 1];
    } else if (argv[i] === '-o' || argv === '--out') {
        out = argv[i + 1];
    } else if (argv[i] === '-n' || argv === '--name') {
        assetName = argv[i + 1];
    } else if (argv[i] === '--assetName') {
        src = argv[i + 1];
        var p = src.split('/');
        var f = p[p.length - 1].split(".");
        var n = f[f.length - 2];

        out = n + ".js";
        assetName = p[p.length - 1];
    }
}

if (src === null || out === null || assetName === null) {
    console.log("node binaryAssetToBase64.js -s [sourceFile] -o [outputFile] -n [assetName]");
    process.exit();
}

var data = fs.readFileSync(src);
var base64 = new Buffer(data).toString('base64');

fs.writeFileSync(out, 'var BINARY_ASSETS = BINARY_ASSETS || {};\nBINARY_ASSETS["' + assetName + '"] = "' + base64 + '";');
