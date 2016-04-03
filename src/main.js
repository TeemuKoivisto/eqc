import MathObject from "./math-components/MathObject";
import MathTerm from "./math-components/basic/MathTerm";
import MathOperation from "./math-components/basic/MathOperation";

import LatexParser from "./parsing/LatexParser";

import IDG from "./utility_services/IDG";
import Orderer from "./utility_services/Orderer";

/*
 * Instance of Logmon used for logging
 * And logging is needed, trust me
 */
// window.Logmon.createOpt("Logcal", false, true);
window.Logmon.createOpt("Logcal", true, true);

window.eqc = {
  Calculator: {

  },
  MathComponents: {
    Basic: {
      MathTerm,
      MathOperation,
    },
    MathObject,
  },
  Parsing: {
    LatexParser,
  },
  UtilityServices: {
    IDG,
    Orderer,
    Penis: "afhh",
  }
};

const parser = new LatexParser();
window.eqc.Parser = parser;
