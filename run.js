var net = require('net');

var server = net.createServer(function(socket) {
    socket.write("Welcome to NodeMud, bitches.\r\n");
 });

server.listen(1337, "64.30.136.166");
