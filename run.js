var net = require('net');
var vm = require('vm');
var fs = require('fs');
var auth = require('./auth');
require('./snippets');

var sandboxGen = function(nmud, user, params) {
    var environment = {
        'getConnectedUsers': function(){
            var connectedUsers = [];
            for(index in nmud.connections){
                connectedUsers.push(nmud.connections[index].socket.user.name);
            }
            return connectedUsers;
        },

        'echo': function(text) {
            user.socket.write(text + '\r\n'); 
        },

        'oecho': function(text) {
            for(index in nmud.connections) { 
                if(index != user.name) {
                    nmud.connections[index].socket.write(text + '\r\n');
                }
            }
        },

        'username': user.name
    };

    environment.p = params;
    return environment;
};

var NodeMUD = function() {
    this.db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

    // Not sure whether to put this here (allows reloading) or in gen_db, this 
    //  will do for now.
    this.loadCommands();

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
                    command = socket.user.commands[chunks[0]].code;
                } else if(this.db.rooms[0].commands.hasOwnProperty(chunks[0])) { // Global command room
                    command = this.db.rooms[0].commands[chunks[0]].code;
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

NodeMUD.prototype.loadCommands = function() {
    fs.readdir('./globals/', function(err, files) {
        var file;
        var command;
        for(var i=0;i<files.length;i++) {
            file = files[i];
            command = {
                "id": i,
                "name": file.split('.')[0],
                "code": fs.readFileSync('./globals/' + file, 'utf8')
            };

            this.db.commands.push(command);
            this.db.rooms[0].commands[command.name] = command;
        }
    }.bind(this));
};

NodeMUD.prototype.broadcast = function(text) {
    for(index in this.connections) {
        this.connections[index].socket.write('[' + text + ']\r\n');
    }
};

new NodeMUD();
