MathComponents.factory('MathSum', function (MathObject, Orderer, Logger, IDG) {
    var sum = function Sum(upperlimit, lowerlimit, content) {
        // inherits MathObject's methods and variables
        this.id = IDG.nextId();
        this.type = "Sum";
        
        this.upper = upperlimit;
        this.lower = lowerlimit;
        this.content = content; // bracketed?
        this.minussign = false;

        this.parent = null;
        this.order = 0;
        this.exponent = "";

        this.setExponent = function(exponent) {
            this.exponent = exponent;
        };

        this.setParent = function(MathComponent) {
            this.parent = MathComponent;
        }
        
        this.setOrder = function (order) {
            order++;
            this.order = order;
            Orderer.registerComponent(order, "Sum");
        }

        this.switchSign = function () {
            this.minussign = !this.minussign;
        };

        this.isEqual = function (MathObject) {
            if (MathObject.type === 'Sum') {
                throw("en jaksanut tehä");
                return this.upper === MathObject.firstprob && this.second === MathObject.secondtprob && this.type === MathObject.type;
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
        this.isSpecial = function () {
            return true;
        };

        this.isEmpty = function () {
            return this.content.length === 0;
        }

        this.includesVariable = function (Variable) {
            for (var i = 0; i < this.content.length; i++) {
                if (this.content[i].includesVariable(Variable)) {
                    return true;
                }
            }
            return false;
        };

        this.toOrder = function() {
            return "hah";
        }

        this.toLatex = function () {
            return "\\sum _{n=}^{i=}";            
            return "\\sum _{n=" + this.lower.toLatex() + "}^{i=" + this.upper.toLatex() + this.content.toLatex();
        }

        this.toString = function () {
            return "Sum[" + this.lower + ", " + this.upper + ", " + this.content + "]";
        }
    }
    return sum;
});