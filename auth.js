var auth = function(nmud, socket) {
    var username;

    var login = {
        'getUsername': function(socket, data, chunks) {
            var name = chunks[0];
            if(name === 'new') {
                socket.write('What username would you like?\r\n');
                socket.callback = newUser.getUsername;
            } else if(nmud.db.users.hasOwnProperty(name)) {
                username = name;
                socket.callback = login.getPassword;
                socket.write('Password: \r\n'); 
            } else {
                socket.write('Username not recognised. Type a valid ' +
                    'username or \'new\' for a new user:\r\n');
            }       
        },

        'getPassword': function(socket, data, chunks) {
            var password = chunks[0];
            if(nmud.db.users[username].password === password) {
                nmud.db.users[username].socket = socket;
                socket.user = nmud.db.users[username];
                nmud.connections.push(socket.user);
                socket.callback = null;
                socket.write('You are now logged in! Welcome, ' + socket.user.name + '\r\n');
            } else {
                socket.write('Incorrect password, try again:\r\n');
            }
        }
    }

    var newUser = {
        'getUsername': function(socket, data, chunks) {
            var name = chunks[0];
            if(nmud.db.users.hasOwnProperty(name)) {
                socket.write('That username is already taken. Try again:\r\n');
            } else {
                username = name;
                socket.callback = newUser.getPassword;
                socket.write('Now choose a password (Note: It\'s transmitted and stored as plain text at the moment so don\'t' +
                            'use anything interesting):\r\n');
            }
        },

        'getPassword': function(socket, data, chunks) {
            var password = chunks[0];
            nmud.db.users[username] = {
                'name': username,
                'password': password,
                'commands': {},
                'socket': socket
            };
            socket.user = nmud.db.users[username];
            nmud.connections.push(socket.user);
            socket.callback = null;
            socket.write('You are now registered! Welcome, ' + socket.user.name + '\r\n');
            console.log(nmud.db.users);
        }
    };

    return {
        'execute': function() {
            socket.callback = login.getUsername;
            socket.write('Username (or \'new\'): \r\n');
        }
    };
};

exports.get = function(nmud, socket) {
    return auth(nmud, socket);
}
