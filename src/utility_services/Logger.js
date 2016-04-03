import Formulator from "./Formulator";

export class Logger {
  constructor() {
    this.log = [];
    this.message = "";
    this.equation = null;
  }
  setEquation(equation) {
    this.log = [];
    this.message = "";
    this.equation = equation;
  }
  resetLogs() {
    this.log = [];
    this.message = "";
  }
  setMessage(msg) {
    this.message = msg;
  }
  createLatex(name, latex) {
    this.log.push({
      latex,
      stepName: name,
      formula: "",
    });
  }
  newLatex(name) {
    this.log.push({
      latex: this.equation.toLatex(),
      stepName: name,
      formula: "",
    });
  }
  newLatexWithFormula(name, formulaName, variation) {
    const formula = Formulator.getFormulaByName(formulaName);
    if (typeof formula === "object") {
      name += `\nUsing formula $${formula.variations[variation].latex}$`;
    }
    this.log.push({
      latex: this.equation.toLatex(),
      stepName: name,
      formula,
    });
  }
}

export default new Logger();
