import Big from "big.js";
import MathObject from "../MathObject";

export default class MathTerm extends MathObject {
  constructor(variable, value, exponent) {
    super("Term");

    this.variable = variable;
    this.value = new Big(value);
    this.exponent = exponent;
  }

  // Methods for big.js http://mikemcl.github.io/big.js/
  getValue() {
    return parseFloat(this.value.toString());
  }

  setValue(value) {
    this.value = new Big(value);
  }

  plusValue(value) {
    this.value = this.value.add(value);
  }

  minusValue(value) {
    this.value = this.value.minus(value);
  }

  multiplyValue(value) {
    this.value = this.value.times(value);
  }

  divideValue(value) {
    this.value = this.value.div(value);
  }

  powValue(value) {
    let power = parseFloat(value.toString());
    // checks for integer, uses Big for only integer exponentation
    // such as 0.1^6 for precision
    if (power === parseInt(power)) {
      this.value = this.value.pow(parseFloat(value.toString()));
    } else {
      this.value = new Big(Math.pow(this.getValue(), parseFloat(value.toString())));
    }
  }

  setOrder(order) {
    // this.order = order;
    if (this.exponent && this.exponent.length !== 0) {
      // order++;
      // this.order = order;
      // Orderer.registerComponent(order, "Term");

      order++;
      Orderer.registerComponent(order, "Exponent"); // no reason to register terms unless they have exponents??
      this.exponent.order = order;
      this.exponent.setOrder(order);
      this.exponent.setParent(this);
    }
  }

  getVariables() {
    var variables = [];
    for (var c = 0; c < this.variable.length; c++) {
      variables.push(this.variable.charAt(c));
    }
    return variables;
  }

  includesVariable(Variable) {
    return this.variable === Variable && this.variablevalue !== 0;
  }

  checkSign() {
    this.minussign = this.getValue() > 0 && this.minussign ? false : this.minussign;
    this.minussign = this.getValue() < 0 && !this.minussign ? true : this.minussign;
  }

  switchSign() {
    this.multiplyValue(-1);
    this.checkSign();
  }

  isEmpty() {
    return this.getValue() === 0;
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
      if (this.exponent.isType("Bracketed")) {
        latex += this.exponent.toLatexWithoutBrackets();
      } else {
        latex += this.exponent.toLatex();
      }
      latex += "}";
    }
    return latex;
  }

  // toString() {
  //   let latex = "";
  //   const val = this.getValue();
  //   if (!this.variable) {
  //     latex += val;
  //   } else if (val === 1 && this.variable) {
  //     latex += this.variable;
  //   } else if (val === -1 && this.variable) {
  //     latex += "-" + this.variable;
  //   } else {
  //     latex += val + this.variable;
  //   }
  //   if (this.containsExponent()) {
  //     latex += "^{";
  //     if (this.exponent.isBracketed()) {
  //       latex += this.exponent.toString();
  //     } else {
  //       latex += this.exponent.toString();
  //     }
  //     latex += "}";
  //   }
  //   return latex;
  // }
}
