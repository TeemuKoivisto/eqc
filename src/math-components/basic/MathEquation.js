import MathObject from "../MathObject";

export default class MathEquation extends MathObject {
  constructor() {
    super("Equation");
    this.leftside = [];
    this.rightside = [];
  }
  toLatex() {
    let latex = "";
    const latexSide = (side) => {
      for (var i = 0; i < side.length; i++) {
        if (side[i].minussign) {
          latex += side[i].toLatex();
        } else {
          if (i !== 0) {
            latex += "+";
          }
          latex += side[i].toLatex();
        }
      }
    };
    latexSide(this.leftside);
    latex += "=";
    latexSide(this.rightside);
    return latex;
  }
  toString() {
    let string = "";
    const stringSide = (side) => {
      for (var i = 0; i < side.length; i++) {
        if (!side[i].minussign && i !== 0) {
          string += "+";
        }
        string += side[i].toString();
      }
    };
    stringSide(this.leftside);
    string += " = ";
    stringSide(this.rightside);
    return string;
  }
}
