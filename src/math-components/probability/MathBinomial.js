import Orderer from "../../utility_services/Orderer";

import MathObject from "../MathObject";

export default class MathBinomial extends MathObject {

  constructor(upper, lower) {
    super("Binomial");

    this.upper = upper;
    this.lower = lower;
  }

  setOrder(order) {
    order++;
    this.order = order;
    Orderer.registerComponent(order, "Binomial");
    this.upper.setOrder(order);
    this.upper.setParent(this);
    this.lower.setOrder(order);
    this.lower.setParent(this);
  }

  toLatex() {
    let latex = "\\binom{";
    latex += this.upper.isType("Bracketed") ? this.upper.toLatexWithoutBrackets() : this.upper.toLatex();
    latex += "}{";
    latex += this.lower.isType("Bracketed") ? this.lower.toLatexWithoutBrackets() : this.lower.toLatex();
    if (this.exponent) {
      latex += "}^{";
      latex += this.exponent.isType("Bracketed") ? this.exponent.toLatexWithoutBrackets() : this.exponent.toLatex();
      latex += "}";
    } else {
      latex += "}";
    }
    return latex;
  }
}
