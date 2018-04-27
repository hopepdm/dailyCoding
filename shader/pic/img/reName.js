var fs = require('fs');
var path = require('path');

var dirPath = path.resolve(__dirname);

var files = [];
files = fs.readdirSync(dirPath);

files.forEach(function(file, index){
    if(file.match(/\.jpg$/i) || file.match(/\.png$/i)){
        fs.renameSync(path.resolve(__dirname,file), index + '.jpg', function(err){
            if(err){
                console.log('failed');
            }
        })
    }
})

