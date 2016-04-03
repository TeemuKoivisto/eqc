import MathObject from "./math-components/MathObject";
import MathTerm from "./math-components/basic/MathTerm";
import MathOperation from "./math-components/basic/MathOperation";

import LatexParser from "./parsing/LatexParser";

import IDG from "./utility_services/IDG";
import Orderer from "./utility_services/Orderer";

window.eqc = {
  Calculator: {

  },
  MathComponents: {
    Basic: {
      MathTerm: MathTerm,
      MathOperation: MathOperation,
    },
    MathObject: MathObject,
  },
  Parsing: {
    LatexParser: LatexParser,
  },
  UtilityServices: {
    IDG: IDG,
    Orderer: Orderer,
    Penis: "afhh"
  }
};


window.eqc.MathTerm = new MathTerm("x", 3.5, "");

window.eqc.Parser = new LatexParser();
