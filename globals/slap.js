var who = p.slice(1, 2);

if(who == username) {
    echo('You can\'t slap yourself!');
} else {
    if(isConnected(who)) {
        echo('You slap ' + who + ' with a fish!');
        oecho(username + ' slaps ' + who + ' with a fish!');
    } else {
        echo('No user online called ' + who);
    }
}
