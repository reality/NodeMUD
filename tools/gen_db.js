var fs = require('fs');
var db = {
    "globalCommands": {
        "quit": "quit();"
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
        },
        "newb": {
            "name": "newb",
            "password": "winning",
            "commands": {
                "test": "say(p[1] + p[2]);"
            },
            "socket": null
        }
        "foo": {
            "name": "foo",
            "password": "bar",
            "commands": {
                "test": "say(p[1] + p[2]);"
            },
            "socket": null
        }
    }
};

fs.writeFile('db.json', JSON.stringify(db, null, '    '));
console.log('Created new database file in db.json');
