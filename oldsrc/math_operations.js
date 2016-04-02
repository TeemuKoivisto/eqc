Calculator.service('MathOperations', function (Orderer, Logger) {

    // this.getValue = function() {
        // return this.value;
    // }
    
    // this.setValue = function(value) {
        // this.value = value;
    // }
    
    // this.plusValue = function(value1, value2) {
        // value1 += value2;
        // return value1;
    // }
    
    // Only one used by CalculatorConverter binomialToFactorials
    this.minusValue = function(value1, value2) {
        var first = new Big(value1);
        var result = parseFloat(first.minus(value2));
        return result;
    }
    
    // this.multiplyValue = function(value) {
        // this.value *= value;
    // }
    
    // this.divideValue = function(value) {
        // this.value /= value;
    // }
    
    // this.powValue = function(value) {
        // this.value = Math.pow(this.value, value);
    // }
    
    // // Methods for big.js http://mikemcl.github.io/big.js/
    // this.getValue = function() {
        // return parseFloat(this.value.toString());
    // }
    
    // this.plusValue = function(value) {
        // this.value = this.value.add(value);
    // }
    
    // this.minusValue = function(value) {
        // this.value = this.value.minus(value);
    // }
    
    // this.multiplyValue = function(value) {
        // this.value = this.value.times(value);
    // }
    
    // this.divideValue = function(value) {
        // this.value = this.value.div(value);
    // }
    // // end
});
