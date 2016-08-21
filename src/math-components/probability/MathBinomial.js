import MathObject from "../MathObject";

export default class MathBinomial extends MathObject {

  constructor(upper, lower) {
    super("Binomial");

    this.upper = upper;
    this.lower = lower;
  }

  toLatex() {
    let latex = "\\binom{";
    if (this.upper.isType("Bracketed")) {
      latex += this.upper.toLatexWithoutBrackets();
    } else {
      latex += this.upper.toLatex();
    }
    latex += "}{";
    if (this.lower.isType("Bracketed")) {
      latex += this.lower.toLatexWithoutBrackets();
    } else {
      latex += this.lower.toLatex();
    }
    if (this.exponent) {
      latex += "}^{";
      if (this.exponent.isType("Bracketed")) {
        latex += this.exponent.toLatexWithoutBrackets();
      } else {
        latex += this.toLatex();
      }
      latex += "}";
    } else {
      latex += "}";
    }
    return latex;
  }

}
