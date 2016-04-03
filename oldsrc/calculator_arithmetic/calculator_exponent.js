Calculator.service("CalculatorExponent", function(CalculatorUtil, CalculatorSum, MathSymbol, MathTerm, MathOperation, MathFactorial, Orderer, Logger) {

  this.options = {
    reduceFractions: true,
    "showBracketsAfterReducingIntoOneTerm": false
  };

  this.calculate = function(Location, MathObject) {
    Logcal.start("CalculatorExponent calculate: Location " + Location + " MathObject " + MathObject);
    //var locationType = Object.prototype.toString.call(Location) === "[object Array]" ? "Equation" : Location.type;
    if (MathObject.type === "Term") {
      this.reduceTermsExponent(Location, MathObject);
      //} else if (MathObject.type === "Operation") {
      //    this.reduceOperationExponent(Location, MathObject);
    } else if (MathObject.type === "Bracketed") {
      this.reduceBracketedsExponent(Location, MathObject);
    }
    Logcal.end("FROM CalculatorExponent calculate: Location " + Location + " MathObject " + MathObject);
  };

  this.reduceTermsExponent = function(Location, Term) {
    Logcal.start("reduceTermExponent: Location " + Location + " Term " + Term);
    if (Term.exponent.isTerm()) {

    } else if (Term.exponent.isBracketed()) {
      CalculatorSum.sumList(Term.exponent.content);
      if (Term.exponent.content.length === 1) {
        Term.exponent = Term.exponent.content[0];
      } else if (Term.exponent.content.length === 0) {
        Term.exponent = "";
      }
    }
    if (Term.variable.length === 0 && Term.exponent) {
      Logger.newLatex("Reducing exponent $" + Term + "$");
      // Term.value = Math.pow(Term.value, Term.exponent.value);
      if (Term.exponent.isTerm()) {
        Term.powValue(Term.exponent.value);
        Term.exponent = "";
      } else {
        throw ("unsupported non term as exponent to be pow\"d");
      }
    } else if (Term.exponent.isTerm() && Term.exponent.getValue() === 1) {
      Logger.newLatex("Power of one is removed from $" + Term + "$");
      Term.exponent = "";
    }
    Logcal.end("FROM reduceTermExponent: Location " + Location + " Term " + Term);
  };

  this.reduceBracketedsExponent = function(Location, Bracketed) {
    Logcal.start("reduceBracketedsExponent: Location " + Location + " MathObject " + Bracketed);
    if (Bracketed.exponent.isTerm()) {

    } else if (Bracketed.exponent.isBracketed()) {
      CalculatorSum.sumList(Bracketed.exponent.content);
      if (Bracketed.exponent.content.length === 1) {
        Bracketed.exponent = Bracketed.exponent.content[0];
      } else if (Bracketed.exponent.content.length === 0) {
        Bracketed.exponent = "";
      }
    }
    Logcal.end("FROM reduceBracketedsExponent: Location " + Location + " MathObject " + Bracketed);
  };
});
