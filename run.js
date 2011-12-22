var net = require('net');
var vm = require('vm');

var sandboxGen = function(nmud, user, params) {
    var environment = {
        'say': function(text) {
            nmud.broadcast(text);        
        }
    };

    // TODO: don't add if they're functions or whatever
    environment.p = params;

    return environment;
};

var testUser = {
    'name': 'reality',
    'commands': {
        'test': "say(p[1] + p[2]);"
    },
    'socket': null
};

var NodeMUD = function() {
    this.connections = [];

    this.server = net.createServer(function(socket) {
        socket.write('Welcome to NodeMUD, bitches.\r\n');

        // Yeah multiple users is broke for now shut up
        testUser.socket = socket;
        socket.user = testUser;
        this.connections.push(testUser);

        socket.on('data', function(input) {
            var chunks = chomp(input.toString()).split(' ');
            if(socket.user.commands.hasOwnProperty(chunks[0])) {
                var sandbox = sandboxGen(this, socket.user, chunks);
                vm.runInNewContext(socket.user.commands[chunks[0]], sandbox);
            } 
        }.bind(this));
    }.bind(this));

    this.server.listen(1337, "64.30.136.166");
}

NodeMUD.prototype.broadcast = function(text) {
    for(index in this.connections) {
        this.connections[index].socket.write(text + '\r\n');
    }
}

new NodeMUD();

function chomp(raw_text) {
  return raw_text.replace(/(\n|\r)+$/, '');
}
