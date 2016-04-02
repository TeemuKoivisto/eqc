OppiApp.service('IDG', function () {
    this.nextid = 0;
    
    //this.setId = function(MathObject) {
    //    MathObject.id = this.nextid;
    //    this.nextid++;
    //};
    
    this.nextId = function() {
        return this.nextid++;
    }
});