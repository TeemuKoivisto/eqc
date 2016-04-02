var MathComponents = angular.module('MathComponents', []);

MathComponents.factory('MathObject', function(IDG) {
    var mathobject = function MathObject() {
        this.type = "uninitiliazed MathObject";
        this.test = "teststring from mathobject";
//        this.log = [];
//        this.testlog = [];
        this.id = IDG.nextId();
        this.order = -1;
        this.minussign = false;
        this.reduced = false;
        this.exponent = "";

        this.setType = function(name) {
            this.type = name;
        };
        
        var throwError = function(functionName) {
            throw(this.type + " hasn't implemented " + functionName + " yet");
        };
        
// here are all the common methods between math objects
        this.setOrder = function(depth) {
            throwError("setOrder");
        };
        this.setExponent = function(exponent) {
            this.exponent = exponent;
        };
        this.returnContentList = function () {
            // returns MathObject's content in a list of MathObjects
            throwError("returnContentList");
            return MathObjectList;
        };
        this.switchSign = function() {
            // reverses positive to negative and vice versa
            throwError("switchSign");
        };
        this.isEqual = function(MathObject) {
            throwError("isEqual");
            return booleann;
        };
        this.isTerm = function() {
            throwError("isTerm");
            return booleann;
        };
        this.isOperation = function() {
            throwError("isOperation");
            return booleann;
        };
        this.isBracketed = function() {
            throwError("isBracketed");
            return booleann;
        };
        this.isSpecial = function() {
            throwError("isSpecial");
            return booleann;
        };
        this.isEmpty = function() {
            throwError("isEmpty");
            return booleann;
        }
        this.includesVariable = function(Variable) {
            throwError("includesVariable");
            return booleann;
        };
        this.toLatex = function() {
            throwError("toLatex");
            return stringg;
        }
    }
    return mathobject;
})