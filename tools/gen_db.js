var fs = require('fs');
var db = {
    "globalCommands": {
        "say": "say(p.slice(1).join(' '));"
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
