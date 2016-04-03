OppiApp.service('IDG', function() {
  this.nextid = 0;

  this.nextId = function() {
    return this.nextid++;
  }
});
