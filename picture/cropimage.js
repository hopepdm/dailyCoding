var path = require('path');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});

gm('/test.jpg')
.resize(4096)
.stream(function(err, stdout, stderr) {
    gm(stdout)
    .crop(70, 70, 100, 100)
    .write('/ters1.jpg', function(err) {
        if(err) throw err;
    });
});