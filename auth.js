var auth = function(socket) {

    var stages = {
        'getUsername': function() {
            var username = chunks[0];
            if(this.db.users.hasOwnProperty(username)) {
                socket.username = username;
                socket.write('Password: \r\n'); 
                socket.callback = stages.getPassword;
            } else {
                socket.write('Username not recognised. Type a valid ' +
                    'username or \'new\' for a new user:\r\n');
            }       
        },

        'getPassword': function() {
            var password = chunks[0];
            if(this.db.users[socket.username].password === password) {
                this.db.users[socket.username].socket = socket;
                socket.user = this.db.users[socket.username];
                this.connections.push(socket.user);
                socket.write('You are now logged in! Welcome, ' + socket.user.name + '\r\n');
                socket.callback = null;
            } else {
                socket.write('Incorrect password, try again:\r\n');
            }
        }
    }

    return {
        'execute': function() {
            socket.write('Username (or \'new\'): \r\n');
            socket.callback = stages.getUsername;
        }
    };
};

exports.get = function(socket) {
    return auth(socket);
}
