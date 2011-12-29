var fs = require('fs');
var db = {
    "globalCommands": {
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
            "socket": null
        }
    }
};

fs.writeFile('db.json', JSON.stringify(db, null, '    '));
console.log('Created new database file in db.json');
