MathComponents.factory('MathTerm', function (MathObject, Orderer, Logger, IDG) {
    var term = function Term(variable, value, exponent) {
        // inherits MathObject's methods and variables
        this.id = IDG.nextId();
        this.type = "Term";

        this.variable = variable;
        this.value = new Big(value);
        this.exponent = exponent;
        this.minussign = false;

        this.parent = null;
        
        this.isComplex = false;
        this.complexValue = null; // MathTerm??
        
        this.toggleComplex = function() {
            this.isComplex = !this.isComplex;
        }
        
        // hasExponent?
        this.containsExponent = function() {
            return (this.exponent && this.exponent.length!==0);
        };

        this.getPossibleExponentValue = function() {
            if (this.exponent) {
                if (this.exponent.isTerm()) {
                    return this.exponent.getValue();
                } else {
                    return 9999;
                }
            } else {
                return 1;
            }
        };

        this.compareToTermExponents = function(FirstT, SecondT) {
            if (FirstT.variable.length > SecondT.variable.length) {
                return -1;
            } else if (SecondT.variable.length > FirstT.variable.length) {
                return 1;
            } else {
                var first = FirstT.getPossibleExponentValue();
                var sec = SecondT.getPossibleExponentValue();
                if (first > sec) {
                    return -1;
                } else if (sec > first) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };
        
        // Methods for big.js http://mikemcl.github.io/big.js/
        this.getValue = function() {
            return parseFloat(this.value.toString());
        }
        
        this.setValue = function(value) {
            this.value = new Big(value);
        }
        
        this.plusValue = function(value) {
            this.value = this.value.add(value);
        }
        
        this.minusValue = function(value) {
            this.value = this.value.minus(value);
        }
        
        this.multiplyValue = function(value) {
            this.value = this.value.times(value);
        }
        
        this.divideValue = function(value) {
            this.value = this.value.div(value);
        }
        
        this.powValue = function(value) {
			var power = parseFloat(value.toString());
			// checks for integer, uses Big for only integer exponentation
			// such as 0.1^6 for precision
			if (power === parseInt(power)) {
				this.value = this.value.pow(parseFloat(value.toString()));
			} else {
				this.value = new Big(Math.pow(this.getValue(), parseFloat(value.toString())));
			}
            // this.value = this.value.pow(parseFloat(value.toString()));
        }
        // end
        
        this.setParent = function(MathComponent) {
            this.parent = MathComponent;
        }
        
        this.setOrder = function(order) {
            // this.order = order;
            if (this.exponent && this.exponent.length !== 0) {
                // order++;
                // this.order = order;
                // Orderer.registerComponent(order, "Term");
                
                order++;
                Orderer.registerComponent(order, "Exponent"); // no reason to register terms unless they have exponents??
                this.exponent.order = order;
                this.exponent.setOrder(order);
                this.exponent.setParent(this);
            }
        };

        this.returnContentList = function () {
            var list = [];
            list.push(this);
            return list;
        };

        this.checkSign = function() {
            if (this.getValue() > 0 && this.minussign) {
                this.minussign = false;
            } else if (this.getValue() < 0 && !this.minussign) {
                this.minussign = true;
            }
        };

        this.switchSign = function () {
            this.multiplyValue(-1);
            this.checkSign();
        };

        this.isEqual = function (MathObject) {
            if (MathObject.isTerm()) {
                console.log("whats this stuff " +  this.value + " === " + MathObject.value + " && " + this.variable  + " === " + MathObject.variable + " && " + this.exponent + " === " + MathObject.exponent);
                return this.getValue() === MathObject.getValue() && this.variable === MathObject.variable && this.exponent === MathObject.exponent;
            }
            return false;
        };

        this.isTerm = function () {
            return true;
        };
        this.isOperation = function () {
            return false;
        };
        this.isBracketed = function () {
            return false;
        };
        this.isSpecial = function() {
            return false;
        };
        
        this.isEmpty = function() {
            return this.getValue()===0;
        };
        
        this.getVariables = function() {
            var variables = [];
            for(var c = 0; c < this.variable.length; c++) {
                variables.push(this.variable.charAt(c));
            }
            return variables;
        }
        
        this.includesVariable = function (Variable) {
            return this.variable === Variable && this.variablevalue !== 0;
        };

        this.toOrder = function() {
            var latex = this.order + "t";
            if (this.exponent) {
                latex += "^{";
                latex += this.exponent.toOrder();
                latex += "}";
            }
            return latex;
        };

        this.toLatex = function() {
            var latex = "";
            var val = this.getValue();
            if (!this.variable) {
                latex += val;
            } else if (val === 1 && this.variable) {
                latex += this.variable;
            } else if (val === -1 && this.variable) {
                latex += "-" + this.variable;
            } else {
                latex += val + this.variable;
            }
            if (this.exponent) {
                latex += "^{";
                if (this.exponent.isBracketed()) {
                    latex += this.exponent.toLatexWithoutBrackets();
                } else {
                    latex += this.exponent.toLatex();
                }
                latex += "}";
            }
            return latex;
        };

        this.toString = function() {
            var latex = "";
            var val = this.getValue();
            if (!this.variable) {
                latex += val;
            } else if (val === 1 && this.variable) {
                latex += this.variable;
            } else if (val === -1 && this.variable) {
                latex += "-" + this.variable;
            } else {
                latex += val + this.variable;
            }
            if (this.containsExponent()) {
                latex += "^{";
                if (this.exponent.isBracketed()) {
                    latex += this.exponent.toString();
                } else {
                    latex += this.exponent.toString();
                }
                latex += "}";
            }
            return latex;
        };
    };

    return term;
});