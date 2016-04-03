MathComponents.factory("MathSymbol", function(MathObject, IDG) {
  var symbol = function Symbol(command) {

    this.id = IDG.nextId();
    this.type = "Symbol";

    // import name from latex commands???
    this.command = command;

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

    this.toOrder = function() {
      return 0 + this.toLatex();
    }

    this.toLatex = function() {
      var latex = "\\" + this.command;
      if (/^[a-zA-Z]/.test(this.command.charAt(this.command.length - 1))) {
        latex += " ";
      }
      return latex;
    };

    this.toString = function() {
      return this.command;
    }
  };
  return symbol;
});
