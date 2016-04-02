MathComponents.factory('MathFactorial', function (MathObject, Orderer, Logger, IDG) {
    // var factorial = function Factorial(variable, value, exponent) {
    var factorial = function Factorial(component) {
        this.id = IDG.nextId();
        this.type = "Factorial";

        this.component = component;
        
        // this.variable = variable;
        // this.value = new Big(value);
        // this.exponent = exponent;
        this.minussign = false;

        this.parent = null;
        
        // hasExponent?
        this.containsExponent = function() {
            return false;
            // return (this.exponent && this.exponent.length!==0);
        };

        this.setParent = function(MathComponent) {
            this.parent = MathComponent;
        }
        
        this.setOrder = function(order) {
            order++;
            this.order = order;
            Orderer.registerComponent(order, "Factorial");
            this.component.setOrder(order);
            this.component.setParent(this);
            // if (exponent && exponent.length !== 0) {
                // Orderer.registerComponent(order, "Exponent");
                // this.exponent.setOrder(order);
                // this.exponent.setParent(this);
            // }
        };

        this.returnContentList = function () {
            var list = [];
            list.push(this);
            return list;
        };

        this.switchSign = function () {
            this.component.switchSign();
            this.minussign = !this.minussign;
        };

        this.isEqual = function (MathObject) {
            if (MathObject.type === "Factorial") {
                return this.component.isEqual(MathObject.component);
            }
            return false;
        };

        this.isTerm = function () {
            return false;
        };
        this.isOperation = function () {
            return false;
        };
        this.isBracketed = function () {
            return false;
        };
        this.isSpecial = function() {
            return true;
        };

        this.isEmpty = function() {
            return this.component.isEmpty();
        };

        this.includesVariable = function (Variable) {
            return this.component.includesVariable(Variable);
        };

        this.toOrder = function() {
            throw('factorial toOrder not finished')
            var latex = this.order + "!"; 
            if (this.exponent) {
                latex += "^{";
                latex += this.exponent.toOrder();
                latex += "}";
            }
            return latex;
        };

        this.toLatex = function() {
            return this.component.toLatex() + '!';
        };

        this.toString = function() {
            return this.component.toString() + '!';
        };
    };

    return factorial;
});