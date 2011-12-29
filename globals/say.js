var text = p.slice(1).join(' ');  

var verb = 'says';
var modifier = text.substr(-1);
if(modifier === '?') {
    verb = 'asks';
} else if(modifier === '!') {
    verb = 'exclaims';
}

var output = ' ' + verb + ' "' + text + '"\r\n';
echo('You' + output);
oecho(user.name + output);
