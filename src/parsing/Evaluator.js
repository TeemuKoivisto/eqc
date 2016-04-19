export default class Evaluator {
  isTerm(inputChar) {
    return (inputChar >= "0" && inputChar <= "9") || /^[a-zA-Z]*$/.test(inputChar);
  }
  isWhitespace(inputChar) {
    return inputChar === " " || inputChar === "\t" || inputChar === "\n";
  }
  isParsableComponent(inputChar) {
    return (inputChar >= "0" && inputChar <= "9") || /^[a-zA-Z]*$/.test(inputChar) || inputChar === "\\";
  }
  isConjoinedMultiplication(signed, c, lastchar, list, component) {
    return !signed && c !== "\\" && lastchar !== "=" && list.length > 1 && list[list.length - 2].type !== "Symbol" && component.type !== "Symbol";
  }
}
