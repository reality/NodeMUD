var fs = require('fs');
var db = {
    "globalCommands": {
        "say": "say(p.slice(1).join(' '));"
        "quit": "quit();"
        "slap": "slap(p.slice(1, 2));"
    },
    "adminCommands": {
        "kick": "kick(p.slice(1, 2));"
    },
    "aliases": {
    },
    "users": {
        "reality": {
            "name": "reality",
            "password": "turtles",
            "commands": {
                "test": "say(p[1] + p[2]);"
            },
            "socket": null,
            "admin": true
        }
        "newb": {
            "name": "newb",
            "password": "winning",
            "commands": {
                "test": "say(p[1] + p[2]);"
            },
            "socket": null,
            "admin": true
        }
        "foo": {
            "name": "foo",
            "password": "bar",
            "commands": {
                "test": "say(p[1] + p[2]);"
            },
            "socket": null,
            "admin": false
        }
    }
};

fs.writeFile('db.json', JSON.stringify(db, null, '    '));
console.log('Created new database file in db.json');
