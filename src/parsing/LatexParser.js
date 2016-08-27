import Logmon from "../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");

import Evaluator from "./Evaluator";
import Logger from "../utility_services/Logger";

import MathEquation from "../math-components/basic/MathEquation";
import MathTerm from "../math-components/basic/MathTerm";
import MathOperation from "../math-components/basic/MathOperation";
import MathBracketed from "../math-components/basic/MathBracketed";
import MathSymbol from "../math-components/basic/MathSymbol";

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
    this.variables = {};
  }

  setInput(latex) {
    this.input = latex;
    this.index = 0;
    this.status = "";
    this.bad = 0;
    this.variables = {};
    Logger.resetLogs();
  }

  parseEquation(latex) {
    Logcal.start("LatexParser parseEquation(latex): " + latex);
    // Logcal.timerStart("LatexParser parseEquation");

    this.setInput(latex);
    const equation = new MathEquation();
    // try {
      equation.leftside = this.parseToChar("=");
      equation.rightside = this.parseToChar("\\\\");
    // } catch (e) {
    //   console.log("LatexParser errored!", e);
    //   this.status = "Parser error";
    // }

    // Logcal.timerEnd("LatexParser parseEquation");
    Logcal.append("equation(latex) " + equation.toLatex());
    Logcal.end("FROM LatexParser parseEquation(latex): RETURN equation " + equation.toLatex());
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
      lastChar = this.getLastChar(this.index);
      currentChar = this.getChar();

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
        }
      } else if (currentChar === exitingChar) {
        if (this.index !== this.input.length - 1) {
          this.parseChar();
        }
        Logcal.append("currentChar === exitingChar");
        Logcal.end("FROM parseToChar(exitingchar): " + exitingChar + " RETURN list " + list);
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
          Logcal.end("FROM parseToChar(exitingChar): " + exitingChar + " RETURN list " + list);
          throw new Error("Bad input");
        }
        negative = false;
        signed = false;
      }
    }
    Logcal.end("FROM parseToChar(exitingChar): RETURN list " + list);
    return list;
  }

  parseNextComponent(list, signed) {
    Logcal.start("parseNextComponent(list, signed): " + list + ", " + signed);
    let component = null,
      currentChar = this.parseIfWhitespace();

    // this.parseIfWhitespace();
    // currentChar = this.input.charAt(this.index);

    if (currentChar === "P") {
      if (this.isNext("\\left(")) {
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
      Logcal.end("FROM parseNextComponent(list, signed): RETURN component " + component);
      throw new TypeError("Unknown currentChar " + currentChar + " in parseNextComponent");
      // return component;
    }
    Logcal.end("FROM parseNextComponent(list, signed): RETURN component " + component);
    return component;
  }

  parseTerm() {
    Logcal.start("parseTerm():");
    let value = "",
      variable = "",
      term, exponent, lower = "",
      currentChar = this.getChar(),
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
    currentChar = this.getChar(); // or parseChar??
    exponent = this.parseIfExponent();
    if (currentChar === "'") {
      Logcal.append("Transforming Term into complement"); 
      currentChar = this.parseChar(); 
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
        exponent = list[0].returnContentIfPossible();
      } else {
        exponent = this.parseTerm();
      }
    }
    Logcal.end("FROM parseIfExponent(): RETURN exponent " + exponent);
    return exponent;
  }

  parseCommand(list, signed) {
    Logcal.append("parseCommand(list, signed): " + list + ", " + signed);
    let command = "",
      lastChar = this.getLastChar(),
      currentChar = this.parseChar(); // consuming \

    while (this.Evaluator.isAlpha(currentChar)) {
      command += currentChar;
      currentChar = this.parseChar();
      if (command.length === 10) {
        throw ("overly long string in parseCommand " + command);
      }
    }
    Logcal.append("Command is " + command);
    switch (command) {
      case "cdot":
        this.parseMultiplication(list);
        break;
      case "frac":
        this.parseFraction(list);
        if (!signed && lastChar !== "=" && list.length > 1) {
          Logcal.append("CreateMultiplactionFromList(list): " + list);
          this.createMultiplicationFromList(list);
        }
        break;
      case "left":
        if (currentChar === "(" && (signed || lastChar === "=" || list.length === 0)) {
          this.parseRoundBracketed(list);
        } else if (currentChar === "(") {
          this.parseMultiplication(list);
        } else {
          // unknown thingy i.e. { / [ / | or something
          console.log("unknown left thingy " + c);
          list.push(new MathSymbol(command));
          break;
        }
        break;
      case "right":
        return; // returning to parseToChar without consuming ")" or whatever
        break;
      case "sum":
        this.parseSum(list);
        break;
      case "binom":
        this.parseBinomial(list);
        if (!signed && lastChar !== "=" && list.length > 1) {
          this.createMultiplicationFromList(list);
        }
        break;
      case "mathsf":
        let complement = [];
        this.parseCurlyBracketed(complement);
        let content = complement[0].content;
        if (content.length === 1 && content[0].isType("Term") && content[0].variable === "c") {
          list.push(new MathSymbol("mathsf{c}"));
        }
        break;
      case "text":
        // just parses and ignores
        this.skipToChar("}");
        break;
      default:
        const symbol = new MathSymbol(command);
        list.push(symbol);
        break;
    }
  }

  parseMultiplication(list) {
    Logcal.append("parseMultiplication(list): " + list);

    const firstfactor = list.splice(list.length - 1, 1)[0];
    let secondfactor;
    let currentChar = this.parseIfWhitespace();
    const negative = this.parseSign();
    currentChar = this.getChar();

    if (this.Evaluator.isTerm(currentChar)) {
      secondfactor = this.parseTerm();
    } else if (currentChar === "\\") {
      let content = [];
      this.parseCommand(content);
      secondfactor = content[0];
    } else if (currentChar === "(") {
      let content = [];
      this.parseRoundBracketed(content);
      secondfactor = content[0];
      // makes multiplications shorter but kinda want the brackets to
      // reduce in order user inputted their stuff
      // secondfactor = content[0].reduceAndReturnIfPossible();
      // } else if (c === "-") {
    } else {
      console.log("currently " + this.currentlyParsed());
      throw ("error in parseMultiplication. unknown secondfactor: " + currentChar);
    }
    if (negative) {
      secondfactor.switchSign();
    }
    const operation = new MathOperation(firstfactor, "*", secondfactor);
    list.push(operation);
  }

  parseFraction(list) {
    Logcal.append("parseFraction(list): " + list);

    let firstlist = [],
      secondlist = [];

    this.parseCurlyBracketed(firstlist);
    this.parseCurlyBracketed(secondlist);

    const firstfactor = firstlist[0].returnContentIfPossible();
    const secondfactor = secondlist[0].returnContentIfPossible();
    const operation = new MathOperation(firstfactor, "/", secondfactor);
    list.push(operation);
  }

  parseCurlyBracketed(list) {
    Logcal.append("parseCurlyBracketed(list): " + list);
    this.parseIfChar("{");
    const content = this.parseToChar("}");
    let bracketed = new MathBracketed(content);
    list.push(bracketed);
  }

  parseRoundBracketed(list) {
    Logcal.append("parseRoundBracketed(list): " + list);
    this.parseIfChar("("); // consuming the "("
    let bracketed = new MathBracketed(this.parseToChar(")"));
    bracketed.setExponent(this.parseIfExponent());
    if (this.getChar() === "'") {
      Logcal.append("Transforming Probability into complement");
      this.parseChar();
      bracketed.setExponent(new MathSymbol("mathsf{c}"));
    }
    // check if ! is found after ) => factorial
    if (this.parseIfChar("!")) {
      bracketed = new MathFactorial(bracketed);
    }
    list.push(bracketed);
  }

  createMultiplicationFromList(list) {
    const second = list.splice(list.length - 1, 1)[0];
    const first = list.splice(list.length - 1, 1)[0];
    let mult = new MathOperation(first, "*", second);
    list.push(mult);
  }

  parseProbability() {
    Logcal.append("parseToProbability():");
    let probability,
      varlist = [];

    this.parseIfChar("P"); // consuming the "P"
    this.parseCommand(varlist, false); // parsing content between brackets P( <-> )
    // this.parseBracketed(varlist);
    const bracketed = varlist[0];
    probability = new MathProbability(bracketed.content);
    probability.setExponent(bracketed.exponent);
    return probability;
  }

  parseBinomial(list) {
    Logcal.append("parseToBinomial(list): " + list);
    this.parseIfChar("{");
    let upper,
      lower,
      firstlist = this.parseToChar("}");

    upper = firstlist.length > 1 ? new MathBracketed(firstlist) : firstlist[0];

    this.parseIfChar("{");
    let secondlist = this.parseToChar("}");

    lower = secondlist.length > 1 ? new MathBracketed(secondlist) : secondlist[0];

    const binomial = new MathBinomial(upper, lower);
    binomial.setExponent(this.parseIfExponent());
    list.push(binomial);
    return list;
  }

  addAlphaCharToVariables(alphaChar) {
    this.variables[alphaChar] ? this.variables[alphaChar]++ : this.variables[alphaChar] = 1;
  }

  parseChar() {
    this.index++;
    return this.index < this.input.length ? this.input.charAt(this.index) : "\\\\";
  }

  parseIfChar(requiredChar) {
    return this.input.charAt(this.index) === requiredChar ? this.parseChar() : "";
  }

  parseSign() {
    let negative = false;
    while(this.Evaluator.isSign(this.getChar())) {
      negative = this.getChar() === "-" ? !negative : negative;
      this.parseChar();
    }
    Logcal.append("parseSign(): RETURN negative " + negative);
    return negative;
  }

  parseIfWhitespace() {
    while (this.Evaluator.isWhitespace(this.input.charAt(this.index)) && this.index < this.input.length) {
      this.index++;
    }
    return this.input.charAt(this.index);
  }

  getLastChar(index) {
    while (this.Evaluator.isWhitespace(this.input.charAt(index)) && index < 0) {
      index--;
    }
    return this.input.charAt(index);
  }

  getChar() {
    return this.index < this.input.length ? this.input.charAt(this.index) : "\\\\";
  }

  isNext(latex) {
    return this.input.length > (this.index + latex.length + 1) && this.input.substring(this.index + 1, (this.index + 1 + latex.length)) === latex;
  }

  currentlyParsed() {
    return this.input.slice(0, this.index);
  }
}