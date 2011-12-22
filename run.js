var net = require('net');

var connections = [];

var server = net.createServer(function(socket) {
    connections.push(socket);
    socket.write('Welcome to NodeMUD, bitches.\r\n');

    socket.on('data', function(data) {
        for(index in connections) {
            connections[index].write(data);
        }
    });
});

server.listen(1337, "64.30.136.166");
