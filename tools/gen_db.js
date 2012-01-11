var fs = require('fs');
var db = {
    "rooms": [
        {
            "id": 0,
            "name": "Global Command Room",
            "owner": "root",
            "description": "It's where global commands go.",
            "commands": { }
        },
        {
            "id": 2,
            "name": "A Mother Fucking Terrarium",
            "owner": "reality",
            "description": "Here be turtles.",
            "commands": { }
        }
    ],
    "aliases": {
    },
    "commands": [
    ],
    "users": {
        "root": {
            "name": "root",
            "password": "",
            "commands": {
                "test": "say(p[1] + p[2]);"
            },
            "location": 0,
            "socket": null
        }
    }
};

if(process.argv[2] == undefined || process.argv[2] == null) {
    console.log('Please provide a root password in the command line arguments. Usage: "node tools/gen_db.js password"');
} else {
    db.users.root.password = process.argv[2];
    fs.writeFile('db.json', JSON.stringify(db, null, '    '));
    console.log('Created new database file in db.json');
}
