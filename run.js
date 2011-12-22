var net = require('net');

var sockets = [];

var server = net.createServer(function(socket) {
    sockets.push(socket);
    console.log(sockets);
    socket.write("Welcome to NodeMud, bitches.\r\n");
});

server.on('data', function(data) {
    for(index in sockets) {
        sockets[index].write(data);
    }
});

server.listen(1337, "64.30.136.166");
