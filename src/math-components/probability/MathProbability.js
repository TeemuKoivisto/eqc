import Orderer from "../../utility_services/Orderer";

import MathObject from "../MathObject";

export default class MathProbabilty extends MathObject {

  constructor(contentList) {
    super("Probability");

    this.content = contentList;
  }

  switchSign() {
    this.minussign = !this.minussign;
  }

  toSymbols() {
    var symbols = "";
    for (var i = 0; i < this.content.length; i++) {
      if (this.content[i].isType("Symbol")) {
        symbols += this.content[i].command + "-";
      } else if (this.content[i].isType("Term")) {
        //if (this.content[i].containsComplement)
        symbols += "term-";
      }
    }
    if (symbols.length > 0) {
      symbols = symbols.substring(0, symbols.length - 1);
    }
    return symbols;
  }

  setOrder(order) {
    order++;
    this.order = order;
    Orderer.registerComponent(order, "Probability");
  }

  toLatex() {
    let latex = this.minussign ? "-" : "";
    latex += "P\\left(";
    for (var i = 0; i < this.content.length; i++) {
      latex += this.content[i].toLatex();
    }
    latex += "\\right)";
    if (this.exponent) {
      latex += "^{";
      if (this.exponent.isType("Bracketed")) {
        latex += this.exponent.toLatexWithoutBrackets();
      } else {
        latex += this.exponent.toLatex();
      }
      latex += "}";
    }
    return latex;
  }
}
