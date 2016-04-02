MathComponents.factory('MathBinomial', function (MathObject, Orderer, Logger, IDG) {
    var binomial = function Binomial(upper, lower) {
        // inherits MathObject's methods and variables
        this.id = IDG.nextId();
        this.type = "Binomial";

        // both upper and lower are MATHCOMPONENTS FOR FUCKS SAKE
        this.upper = upper;
        this.lower = lower;
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
            Orderer.registerComponent(order, "Binomial");
            this.upper.setOrder(order);
            this.upper.setParent(this);
            this.lower.setOrder(order);
            this.lower.setParent(this);
        };

        this.switchSign = function () {
            this.minussign = !this.minussign;
        };

        this.isEqual = function (MathObject) {
            if (MathObject.type === 'Binomial') {
                return (this.upper.isEqual(MathObject.upper) && this.lower.isEqual(MathObject.lower) && this.exponent.isEqual(MathObject.exponent));
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
            return this.upper.isEmpty() && this.lower.isEmpty();
        };

        this.includesVariable = function (Variable) {
            return this.upper.includesVariable(Variable) ? true : this.lower.includesVariable(Variable);
        };

        this.toOrder = function() {
            var latex = this.order + "bi\\binom{";
            latex += this.upper.toOrder();
            latex += "}{";
            latex += this.lower.toOrder();
            if (this.exponent) {
                latex += "}^{";
                latex += this.toOrder();
                latex += "}";
            } else {
                latex += "}";
            }
            return latex;
        };

        this.toLatex = function () {
            var latex = "\\binom{";
            if (this.upper.isBracketed()) {
                latex += this.upper.toLatexWithoutBrackets();
            } else {
                latex += this.upper.toLatex();
            }
            latex += "}{";
            if (this.lower.isBracketed()) {
                latex += this.lower.toLatexWithoutBrackets();
            } else {
                latex += this.lower.toLatex();
            }
            if (this.exponent) {
                latex += "}^{";
                if (this.exponent.isBracketed()) {
                    latex += this.exponent.toLatexWithoutBrackets();
                } else {
                    latex += this.toLatex();
                }
                latex += "}";
            } else {
                latex += "}";
            }
            return latex;
        };

        this.toString = function () {
            return "Binomial[" + this.upper + "," + this.lower + "]";
        }
    };
    return binomial;
});