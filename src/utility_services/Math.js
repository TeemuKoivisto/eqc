import Big from "big.js";

export default class MathValue {
  constructor() {
    this.value = null;
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
}