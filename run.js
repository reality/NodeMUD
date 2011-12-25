var net = require('net');
var vm = require('vm');
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

var testUser = {
    };

var NodeMUD = function() {
    this.db = {
        'users': {
            'reality': {
                'name': 'reality',
                'password': 'turtles',
                'commands': {
                    'test': "say(p[1] + p[2]);"
                },
                'socket': null
            }
        }
    };

    this.connections = [];

    this.server = net.createServer(function(socket) {
        socket.write('Welcome to NodeMUD, bitches.\r\n');
        socket.write('Username (or \'new\'): \r\n');

        socket.on('data', function(input) {
            var chunks = input.toString().chomp().split(' ');
            if(socket.user !== undefined) {
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
            } else {
                if(socket.username === undefined) {
                    var username = chunks[0];
                    if(this.db.users.hasOwnProperty(username)) {
                        socket.username = username;
                        socket.write('Password: \r\n'); 
                    } else {
                        socket.write('Username not recognised. Type a valid ' +
                            'username or \'new\' for a new user:\r\n');
                    }
                } else {
                    var password = chunks[0];
                    if(this.db.users[socket.username].password === password) {
                        this.db.users[socket.username].socket = socket;
                        socket.user = this.db.users[socket.username];
                        this.connections.push(socket.user);
                        socket.write('You are now logged in! Welcome, ' + socket.user.name + '\r\n');
                    } else {
                        socket.write('Incorrect password, try again:\r\n');
                    }
                }
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
