var text = p.slice(1).join(' ');  

var verb = 'says';
var modifier = text.substr(-1);
if(modifier === '?') {
    verb = 'asks';
} else if(modifier === '!') {
    verb = 'exclaims';
}

echo('You ' + verb.slice(0, -1) + ' "' + text + '"');
oecho(username + ' ' + verb + ' "' + text + '"');
