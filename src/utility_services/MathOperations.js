import Big from "big.js";

class MathOperations {
  minusValue(value1, value2) {
    var first = new Big(value1);
    var result = parseFloat(first.minus(value2));
    return result;
  }
}

export default new MathOperations();