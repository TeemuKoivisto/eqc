import MathObject from "../MathObject";

export default class MathOperation extends MathObject {
  constructor(factorone, type, factortwo) {
    super("Operation");

    this.firstfactor = factorone;
    this.operation = type === "(" ? "*" : type;
    this.secondfactor = factortwo;

    this.isfraction = this.operation === "/";
  }

  toLatex() {
    let latex = this.minussign ? "-" : "";
    if (this.operation === "*") {
      latex += this.firstfactor.toLatex() + "\\cdot " + this.secondfactor.toLatex();
    } else {
      // sulut n�ytt�� rumilta jos jakolasku. jos minus sulut s�ilyy
      const first = this.firstfactor.isType("Bracketed") ? this.firstfactor.toLatexWithoutBrackets() : this.firstfactor.toLatex();
      const second = this.secondfactor.isType("Bracketed") ? this.secondfactor.toLatexWithoutBrackets() : this.secondfactor.toLatex();
      latex += "\\frac{" + first + "}{" + second + "}";
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
  }
}
