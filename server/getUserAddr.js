var http = require('http');

var currentAddr = '';
var server = http.createServer(function (req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });

    req.on('end', function() {
        console.log(req.method + body);
        res.writeHeader(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'    //解决跨域问题
        });
        if(req.method === 'POST'){
            currentAddr = body;
            res.write("");
            console.log("Current User addr is " + currentAddr);
        }
        if(req.method === 'GET'){
            res.write(currentAddr);
            console.log("Send addr " + currentAddr);
        }
        res.end();
    })
}).listen(3000);

console.log('server start at localhost:3000');