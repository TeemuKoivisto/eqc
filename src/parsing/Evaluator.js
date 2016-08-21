export default class Evaluator {
  isTerm(inputChar) {
    return (inputChar >= "0" && inputChar <= "9") || /^[a-zA-Z]*$/.test(inputChar);
  }
  isNumeric(inputChar) {
    return (inputChar >= "0" && inputChar <= "9") || inputChar === ".";
  }
  isAlpha(inputChar) {
    return /^[a-zA-Z]*$/.test(inputChar);
  }
  isSign(inputChar) {
    return /^[\-]|[\+]/.test(inputChar);
  }
  isWhitespace(inputChar) {
    return inputChar === " " || inputChar === "\t" || inputChar === "\n";
  }
  isParsableComponent(inputChar) {
    return (inputChar >= "0" && inputChar <= "9") || /^[a-zA-Z]*$/.test(inputChar) || inputChar === "\\";
  }
  isConjoinedMultiplication(signed, currentChar, lastChar, list, component) {
    return !signed && currentChar !== "\\" && lastChar !== "=" && list.length > 1 && list[list.length - 2].type !== "Symbol" && component.type !== "Symbol";
  }
}
