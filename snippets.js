String.prototype.chomp = function(raw_text) {
  return raw_text.replace(/(\n|\r)+$/, '');
}
