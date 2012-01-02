var text = p.slice(1).join(' '); 

var verb = 'says';
var modifier = text.substr(-1);
if(modifier === '!' || modifier === '?' || modifier === '.') {
    if(modifier === '?') {
        verb = 'asks';
    } else if(modifier === '!') {
        verb = 'exclaims';
    }
} else {
    text += '.';
}

text = text.charAt(0).toUpperCase() + text.slice(1);

echo('You ' + verb.slice(0, -1) + ' "' + text + '"');
oecho(username + ' ' + verb + ' "' + text + '"');
