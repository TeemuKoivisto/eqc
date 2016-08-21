import MathObject from "../MathObject";

export default class MathSymbol extends MathObject {

  constructor(command) {
    super("Symbol");
    this.command = command;
  }

  toLatex() {
    let latex = "\\" + this.command;
    // adds extra space to the end of the command so the parsing doesn't break it
    if (/^[a-zA-Z]/.test(this.command.charAt(this.command.length - 1))) {
      latex += " ";
    }
    return latex;
  }
}
