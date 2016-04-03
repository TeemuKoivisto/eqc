import MathTerm from "../math-components/basic/MathTerm";

export default class LatexParser {
  constructor() {
    this.input = "";
    this.index = 1;
    this.equation;
    this.variables = {};
    this.mathtypes = {};

    this.status = "";
    this.bad = 0;
  }
  parseLatex(latex) {
    console.log("parsing latex!");
  }
}
