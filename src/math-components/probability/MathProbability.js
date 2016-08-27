import MathObject from "../MathObject";

export default class MathProbabilty extends MathObject {

  constructor(contentList) {
    super("Probability");

    this.content = contentList;
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
