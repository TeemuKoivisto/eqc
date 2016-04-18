import Logmon from "../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");

import Logger from "../utility_services/Logger";

import MathEquation from "../math-components/basic/MathEquation";
import MathTerm from "../math-components/basic/MathTerm";

export default class LatexParser {
  constructor() {
    this.input = "";
    this.index = 0;
    this.equation;
    this.status = "";
    this.bad = 0;
  }
  setInput(latex) {
    this.input = latex;
    this.index = 0;
    this.status = "";
    this.bad = 0;
    Logger.resetLogs();
  }
  parseLatex(latex) {
    Logcal.start("LatexParser parseLatex: latex " + latex);

    this.setInput(latex);
    const list = this.parseToChar("\\\\");

    Logcal.end("FROM LatexParser parseLatex: latex " + latex + " RETURN list " + list);
    return list;
  }
  parseEquation(latex) {
    Logcal.start("LatexParser parseEquation: equation " + latex);
    Logcal.timerStart("LatexParser parseEquation");

    this.setInput(latex);
    let equation = new MathEquation();
    try {
      equation.leftside = this.parseToChar("=");
      equation.rightside = this.parseToChar("\\\\");
    } catch (e) {
      console.log("LatexParser errored!" + e);
      this.status = "Parser error";
    }
    // CalculatorUtil.setMathtypes(this.mathtypes);

    Logcal.timerEnd("LatexParser parseEquation");
    Logcal.append("equation(latex) " + equation.toLatex());
    Logcal.end("FROM LatexParser parseEquation: equation " + equation + " RETURN equation");
    return equation;
  }
  parseToChar(exitingChar) {
    let list = [];
    list.push(new MathTerm("x", 1, ""));
    list.push(new MathTerm("", 34, ""));
    return list;
  }
}
