var express = require('express2.js');
var fs = require('fs');

express.use(express.bodyParser());

// get method
express.get('/', function(req, res){
    console.log('GET /')
    var html = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

// Post handling of data
express.post('/', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks');
});
