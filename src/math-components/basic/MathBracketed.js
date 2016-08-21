import MathObject from "../MathObject";

export default class MathBracketed extends MathObject {

  constructor(contentList) {
    super("Bracketed");

    this.content = contentList;
  }

  checkIfBracketsNeeded() {
    return (this.exponent || this.minussign || this.content.length !== 1);
  }

  returnContentIfPossible() {
    if (!this.checkIfBracketsNeeded()) {
      return this.content[0];
    }
    return this;
  };

  toLatexWithoutBrackets() {
    let latex = "";
    if (this.minussign || this.exponent) {
      latex += "\\left("
    }
    for (var i = 0; i < this.content.length; i++) {
      if (this.content[i].minussign) {
        latex += this.content[i].toLatex();
      } else {
        if (i !== 0) {
          latex += "+";
        }
        latex += this.content[i].toLatex();
      }
    }
    if (this.minussign || this.exponent) {
      latex += "\\right)";
    }
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

  toLatex() {
    let latex = this.minussign ? "-\\left(" : "\\left(";
    for (var i = 0; i < this.content.length; i++) {
      if (this.content[i].minussign) {
        latex += this.content[i].toLatex();
      } else {
        if (i !== 0) {
          latex += "+";
        }
        latex += this.content[i].toLatex();
      }
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
  }
}
