var fs = require('fs');
var db = {
    "globalCommands": {
    },
    "rooms": [
        {
            "name": "The Pub",
            "owner": "reality",
            "description": "It's a pub. It's not the fucking Cambrian. Maybe The Mill?"
        },
        {
            "name": "A Mother Fucking Terrarium",
            "owner": "reality",
            "description": "Here be turtles."
        }
    ],
    "aliases": {
    },
    "users": {
        "reality": {
            "name": "reality",
            "password": "turtles",
            "commands": {
                "test": "say(p[1] + p[2]);"
            },
            "location": 0,
            "socket": null
        }
    }
};

fs.writeFile('db.json', JSON.stringify(db, null, '    '));
console.log('Created new database file in db.json');
