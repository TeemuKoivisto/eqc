import Logmon from "../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");

import Evaluator from "./Evaluator";
import Logger from "../utility_services/Logger";

import MathEquation from "../math-components/basic/MathEquation";
import MathTerm from "../math-components/basic/MathTerm";
import MathOperation from "../math-components/basic/MathOperation";
import MathBracketed from "../math-components/basic/MathBracketed";
import MathProbability from "../math-components/probability/MathProbability";
import MathBinomial from "../math-components/probability/MathBinomial";
import MathFactorial from "../math-components/probability/MathFactorial";

export default class LatexParser {

  constructor() {
    this.Evaluator = new Evaluator();
    this.input = "";
    this.index = 0;
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

  parseEquation(latex) {
    Logcal.start("LatexParser parseEquation(latex): " + latex);
    Logcal.timerStart("LatexParser parseEquation");

    this.setInput(latex);
    const equation = new MathEquation();
    try {
      equation.leftside = this.parseToChar("=");
      equation.rightside = this.parseToChar("\\\\");
    } catch (e) {
      console.log("LatexParser errored!", e);
      this.status = "Parser error";
    }

    Logcal.timerEnd("LatexParser parseEquation");
    Logcal.append("equation(latex) " + equation.toLatex());
    Logcal.end("FROM LatexParser parseEquation: RETURN equation " + equation.toLatex());
    return equation;
  }

  parseToChar(exitingChar) {
    Logcal.start("parseToChar(exitingChar): " + exitingChar);
    let list = [],
      lastChar = "",
      currentChar = "",
      negative = false,
      signed = false,
      component = null;

    while (this.index < this.input.length) {
      if (this.bad === 10) return list;
      lastChar = currentChar;
      currentChar = this.input.charAt(this.index);

      if (this.Evaluator.isParsableComponent(currentChar)) {
        component = this.parseNextComponent(list, signed);
        if (component) {
          if (negative) {
            component.switchSign();
          }
          list.push(component);
          // checks for if current component was command > no multiplication as is it handled
          // also for not self/previous component being Symbol if inside probability
          if (this.Evaluator.isConjoinedMultiplication(signed, currentChar, lastChar, list, component)) {
            Logcal.append("isConjoinedMultiplication === TRUE");
            Logcal.append(">CreateMultiplactionFromList(list) list " + list);
            this.createMultiplicationFromList(list);
          }
          negative = false;
          signed = false;
        } else if (currentChar === exitingChar) {
          if (this.index !== this.input.length - 1) {
            this.parseChar();
          }
          Logcal.end("FROM parseToChar: exitingchar " + exitingChar + " RETURN list " + list);
          return list;
        } else if (currentChar === "-" || currentChar === "+") {
          signed = true;
          negative = this.parseSign();
        } else if (currentChar === "^") {
          component = this.parseIfExponent();
          if (component) {
            list[list.length - 1].setExponent(exponent);
          }
          // negative = false; // how could these even be possible??
          // signed = false;
        } else if (currentChar === "_") {
          console.log("underscore _ inputted inside parseToChar and it's not implemented.. :/");
          this.index++;
        } else if (currentChar === "!") {
          // factorials aren't consumed in parseBracketed?..
          this.index++;
        } else if (currentChar === "}" || currentChar === ")") {
          // do nutting, just consume the char?
          this.index++;
        } else {
          this.bad++;
          this.index++;
          if (this.bad === 10) {
            console.log("too many bad characters " + this.currentlyParsed());
            this.status = "Bad input";
            Logcal.end("FROM parseToChar: exitingChar " + exitingChar + " RETURN list " + list);
            throw new Error("Bad input");
          }
          negative = false;
          signed = false;
        }
      }
    }
    Logcal.end("FROM parseToChar: exitingChar " + exitingChar + " RETURN list " + list);
    return list;
  }

  parseNextComponent(list, signed) {
    Logcal.start("parseNextComponent(list, signed): ");
    let component = null,
      currentChar = this.parseIfWhitespace();

    // this.parseIfWhitespace();
    // currentChar = this.input.charAt(this.index);

    if (currentChar === "P") {
      currentChar = this.checkIfNextIs("\\left(");
      if (currentChar) {
        component = this.parseProbability();
      } else {
        component = this.parseTerm();
      }
    } else if (this.Evaluator.isTerm(currentChar)) {
      component = this.parseTerm();
    } else if (currentChar === "\\") {
      this.parseCommand(list, signed);
      component = list.splice(list.length - 1, 1)[0];
      // component = list[list.length-1];
    } else {
      console.log("Unknown currentChar(" + currentChar + ") in parseNextComponent");
      Logcal.end("FROM parseNextComponent: RETURN component " + component);
      throw new Error("Unknown currentChar(" + currentChar + ") in parseNextComponent");
      // return component;
    }
    Logcal.end("FROM parseNextComponent: RETURN component " + component);
    return component;
  }

  parseTerm() {
    Logcal.start("parseTerm():");
    let value = "",
      variable = "",
      term, exponent, lower = "",
      currentChar = this.input.charAt(this.index),
      factorial = false;

    while (this.Evaluator.isNumeric(currentChar)) {
      value += currentChar;
      currentChar = this.parseChar();
    }
    while (this.Evaluator.isAlpha(currentChar)) {
      variable += currentChar;
      // maybe add crazy functionality for xx notation which is x^2
      this.addAlphaCharToVariables(currentChar);
      currentChar = this.parseChar();
    }
    if (currentChar === "!") { // factorial
      factorial = true;
      currentChar = this.parseChar();
    }
    if (currentChar === "_") { // has a underscore notation
      currentChar = this.parseChar();
      if (currentChar === "{") {
        lower = this.parseToChar("}");
      } else {
        // only one component which is term???
        lower = this.parseTerm();
      }
    }
    currentChar = this.input.charAt(this.index); // or parseChar??
    exponent = this.parseIfExponent();
    if (currentChar === "'") {
      Logcal.append("Transforming Term into complement"); 
      c = this.parseChar(); 
      exponent = new MathSymbol("mathsf{c}");
    }
    value = value.length === 0 ? 1 : parseFloat(value);
    term = new MathTerm(variable, value, exponent);
    if (factorial) {
      Logcal.append("Whops 'Term' was actually factorial");
      term = new MathFactorial(term);
    }
    Logcal.end("FROM parseTerm(): RETURN term " + term);
    return term;
  }

  parseIfExponent() {
    Logcal.start("parseIfExponent():");
    const currentChar = this.parseIfChar("^");
    let exponent = "";
    if (currentChar) {
      if (currentChar === "{") {
        let list = [];
        this.parseCurlyBracketed(list);
        exponent = list[0].reduceAndReturnIfPossible();
      } else {
        exponent = this.parseTerm();
      }
    }
    Logcal.end("FROM parseIfExponent(): RETURN exponent " + exponent);
    return exponent;
  }

  addAlphaCharToVariables(alphaChar) {
    this.variables[alphaChar] ? this.variables[alphaChar]++ : this.variables[alphaChar] = 1;
  }

  parseIfWhitespace() {
    while (this.Evaluator.isWhitespace(this.input.charAt(this.index)) && this.index < this.input.length) {
      this.index++;
    }
    return this.input.charAt(this.index);
  }

  parseChar() {
    this.index++;
    return this.index < this.input.length ? this.input.charAt(this.index) : "\\\\";
  }

  parseIfChar(requiredChar) {
    return this.input.charAt(this.index) === requiredChar ? this.parseChar() : "";
  }
}