MathComponents.factory("MathProbability", function(MathObject, Orderer, Logger, IDG) {
  var prob = function Probability(content) {
    // inherits MathObject"s methods and variables
    //MathObject.apply(this, arguments);
    this.id = IDG.nextId();

    this.type = "Probability";

    this.minussign = false;
    this.content = content;

    this.parent = null;
    this.order = 0;
    this.exponent = "";

    this.setExponent = function(exponent) {
      this.exponent = exponent;
    };

    this.setParent = function(MathComponent) {
      this.parent = MathComponent;
    }

    this.setOrder = function(order) {
      order++;
      this.order = order;
      Orderer.registerComponent(order, "Probability");
    };

    this.switchSign = function() {
      this.minussign = !this.minussign;
    };

    this.isEqual = function(MathObject) {
      if (MathObject.type === "Probability") {
        return this.first === MathObject.firstprob && this.second === MathObject.secondtprob && this.type === MathObject.type;
      }
      return false;
    };

    this.isTerm = function() {
      return false;
    };
    this.isOperation = function() {
      return false;
    };
    this.isBracketed = function() {
      return false;
    };
    this.isSpecial = function() {
      return true;
    };

    this.isEmpty = function() {
      return false;
    };

    this.includesVariable = function(Variable) {
      return first === Variable || second === Variable;
    };

    this.toSymbols = function() {
      var symbols = "";
      for (var i = 0; i < this.content.length; i++) {
        if (this.content[i].isSpecial()) {
          symbols += this.content[i].toString() + "-";
        } else if (this.content[i].isTerm()) {
          //if (this.content[i].containsComplement)
          symbols += "term-";
        }
      }
      if (symbols.length > 0) {
        symbols = symbols.substring(0, symbols.length - 1);
      }
      return symbols;
    };

    this.toOrder = function() {
      var latex = this.order + "P\\left(";
      for (var i = 0; i < this.content.length; i++) {
        latex += this.content[i].toOrder();
      }
      latex += "\\right)";
      return latex;
    };

    this.toLatex = function() {
      var latex = this.minussign ? "-" : "";
      latex += "P\\left(";
      for (var i = 0; i < this.content.length; i++) {
        //if (string.length===2) {
        latex += this.content[i].toLatex();
        //    } else {
        //        string += " " + this.content[i].toLatex();
        //    }
      }
      latex += "\\right)";
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
      var string = this.minussign ? "-" : "";
      string += "P(";
      for (var i = 0; i < this.content.length; i++) {
        if ((string.length === 3 && this.minussign) || (string.length === 2 && !this.minussign)) {
          string += this.content[i].toString();
        } else {
          string += " " + this.content[i].toString();
        }
      }
      string += ")";
      if (this.exponent) {
        string += "^{" + this.exponent.toString() + "}";
      }
      return string;
    }
  };
  return prob;
});
