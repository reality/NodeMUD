var net = require('net');
var vm = require('vm');
var fs = require('fs');
var auth = require('./auth');
require('./snippets');

var sandboxGen = function(nmud, user, params) {
    var environment = {
        'say': function(text) {
            var verb = 'says';
            var modifier = text.substr(-1);
            if(modifier === '?') {
                verb = 'asks';
            } else if(modifier === '!') {
                verb = 'exclaims';
            }

            var output = user.name + ' ' + verb + ' "' + text + '"\r\n';

            for(index in nmud.connections) { // Room is scope when available
                nmud.connections[index].socket.write(output);
            }
        },
        'quit': function() {
            user.socket.write('Goodbye ' + user.name + '!\r\n');
            user.socket.end();
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
                var command = chunks[0];

                if(socket.user.commands.hasOwnProperty(chunks[0])) {
                    command = socket.user.commands[chunks[0]];
                } else if(this.db.globalCommands.hasOwnProperty(chunks[0])) {
                    command = this.db.globalCommands[chunks[0]]; 
                }

                try {
                    vm.runInNewContext(command, sandbox);
                } catch(err) {
                    socket.write('Error: ' + err + '\r\n');
                }
            }
        }.bind(this));

        socket.on('end', function() {
            if(socket.hasOwnProperty('user')) {
                socket.user.socket = null; 
                delete this.connections[socket.user.name];
                this.broadcast(socket.user.name + ' disconnected')
            }
        }.bind(this));
    }.bind(this));

    this.server.listen(1337, "0.0.0.0");
};

NodeMUD.prototype.broadcast = function(text) {
    for(index in this.connections) {
        this.connections[index].socket.write('[' + text + ']\r\n');
    }
};

new NodeMUD();
