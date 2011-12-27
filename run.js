var net = require('net');
var vm = require('vm');
var fs = require('fs);
var auth = require('./auth');
require('./snippets');

var sandboxGen = function(nmud, user, params) {
    var environment = {
        'say': function(text) {
            nmud.broadcast(text);
        }
    };

    environment.p = params;

    return environment;
};

var NodeMUD = function() {
    this.db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
    this.connections = { };

    this.server = net.createServer(function(socket) {
        socket.write('Welcome to NodeMUD, bitches.\r\n');
        auth.get(this, socket).execute();

        socket.on('data', function(input) {
            var chunks = input.toString().chomp().split(' ');
            if(socket.hasOwnProperty('callback') && socket.callback !== undefined && socket.callback !== null) {
                socket.callback(socket, input, chunks);
            } else {
                var sandbox = sandboxGen(this, socket.user, chunks);
                if(socket.user.commands.hasOwnProperty(chunks[0])) {
                    try {
                        vm.runInNewContext(socket.user.commands[chunks[0]], sandbox);
                    } catch(err) {
                        socket.write('Error: ' + err + '\r\n');
                    }
                } else {
                    try {
                        vm.runInNewContext(chunks[0], sandbox);
                    } catch(err) {
                        socket.write('Error: ' + err + '\r\n');
                    }
                }
            }
        }.bind(this));

        socket.on('end', function() {
            if(socket.hasOwnProperty('user')) {
                socket.user.socket = null; 
                delete this.connections[socket.user.name];
            }
        }.bind(this));
    }.bind(this));

    this.server.listen(1337, "0.0.0.0");
};

NodeMUD.prototype.broadcast = function(text) {
    for(index in this.connections) {
        this.connections[index].socket.write(text + '\r\n');
    }
};

new NodeMUD();
