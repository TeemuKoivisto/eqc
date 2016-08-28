import Logger from "../../utility_services/Logger";
import Logmon from "../../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");
import Orderer from "../../utility_services/Orderer";

import Sum from "./Sum";

import Utility from "../utility/Utility";

import Calculator from "../Calculator";

class Exponent extends Calculator {

  constructor() {
    super("Exponent");
  }

  calculate(Location, MathObject) {
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
  }

  reduceTermsExponent(Location, Term) {
    Logcal.start("reduceTermExponent: Location " + Location + " Term " + Term);
    if (Term.exponent.isTerm()) {

    } else if (Term.exponent.isBracketed()) {
      Sum.sumList(Term.exponent.content);
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
  }

  reduceBracketedsExponent(Location, Bracketed) {
    Logcal.start("reduceBracketedsExponent: Location " + Location + " MathObject " + Bracketed);
    if (Bracketed.exponent.isTerm()) {

    } else if (Bracketed.exponent.isBracketed()) {
      Sum.sumList(Bracketed.exponent.content);
      if (Bracketed.exponent.content.length === 1) {
        Bracketed.exponent = Bracketed.exponent.content[0];
      } else if (Bracketed.exponent.content.length === 0) {
        Bracketed.exponent = "";
      }
    }
    Logcal.end("FROM reduceBracketedsExponent: Location " + Location + " MathObject " + Bracketed);
  }
}

export default new Exponent();