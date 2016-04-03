import MathObject from "../MathObject";

export default class MathTerm extends MathObject {
  constructor(variable, value, exponent) {
    super("Term");

    this.variable = variable;
    this.value = value;
    // this.value = new Big(value);
    this.exponent = exponent;
    this.minussign = false;

    this.parent = null;

    this.isComplex = false;
    this.complexValue = null; // MathTerm??
  }

  getValue() {
    return this.value;
    // return parseFloat(this.value.toString());
  }

  toLatex() {
    let latex = "";
    const val = this.getValue();
    if (!this.variable) {
      latex += val;
    } else if (val === 1 && this.variable) {
      latex += this.variable;
    } else if (val === -1 && this.variable) {
      latex += "-" + this.variable;
    } else {
      latex += val + this.variable;
    }
    if (this.containsExponent()) {
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

  toString() {
    let latex = "";
    const val = this.getValue();
    if (!this.variable) {
      latex += val;
    } else if (val === 1 && this.variable) {
      latex += this.variable;
    } else if (val === -1 && this.variable) {
      latex += "-" + this.variable;
    } else {
      latex += val + this.variable;
    }
    if (this.containsExponent()) {
      latex += "^{";
      if (this.exponent.isBracketed()) {
        latex += this.exponent.toString();
      } else {
        latex += this.exponent.toString();
      }
      latex += "}";
    }
    return latex;
  }
}
