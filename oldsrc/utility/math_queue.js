Calculator.service('Queue', function() {
    this.queue = [];
    
    this.add = function(MathComponent) {
        this.queue.splice(0, 0, MathComponent);
    }
    
    this.addFromFirst = function(MathComponent, howmany) {
        this.queue.splice(howmany, 0, MathComponent);
    }
    
    this.next = function() {
        return this.queue.splice(0, 1)[0];
    }
    
    this.addAfterOrder = function(MathComponent, order) {
        
    }
});