String.prototype.chomp = function() {
  return this.replace(/(\n|\r)+$/, '');
}
