import MathObject from "./math-components/MathObject";
import MathTerm from "./math-components/basic/MathTerm";
import MathOperation from "./math-components/basic/MathOperation";

import LatexParser from "./parsing/LatexParser";

import IDG from "./utility_services/IdGenerator";
import Orderer from "./utility_services/Orderer";

/*
 * Instance of Logmon used for logging
 * And logging is needed, trust me
 */

import Logmon from "./utility_services/Logmon";

Logmon.createLoggerWithOptions("Logcal", false, true);

let eqc = {
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
eqc.Parser = parser;

const addToWindow = (windowInstance) => {
  if (windowInstance) {
    console.log("wee window");
    window.eqc = eqc;
  }
};

addToWindow(window);
module.exports = eqc;
