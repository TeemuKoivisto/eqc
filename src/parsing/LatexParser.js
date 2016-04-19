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
    this.Evaluate = new Evaluator();
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
  // parseLatex(latex) {
  //   Logcal.start("LatexParser parseLatex: latex " + latex);
  //
  //   this.setInput(latex);
  //   const list = this.parseToChar("\\\\");
  //
  //   Logcal.end("FROM LatexParser parseLatex: latex " + latex + " RETURN list " + list);
  //   return list;
  // }
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

    Logcal.timerEnd("LatexParser parseEquation");
    Logcal.append("equation(latex) " + equation.toLatex());
    Logcal.end("FROM LatexParser parseEquation: equation " + equation + " RETURN equation");
    return equation;
  }
  parseToChar(exitingChar) {
    Logcal.start("parseToChar: exitingchar " + exitingchar);
    let list = [],
      lastchar = "",
      c = "",
      negative = false,
      signed = false,
      component = null;

    while (this.index < this.input.length) {
      if (bad === 10) return list;
      lastchar = this.checkChar(this.index - 1);
      c = this.input.charAt(this.index);

      if (this.Evaluator.isParsableComponent(c)) {
        component = this.parseNextComponent(list, signed);
        if (component) {
          if (negative) {
            component.switchSign();
          }
          list.push(component);
          // checks for if current component was command > no multiplication as is it handled
          // also for not self/previous component being Symbol if inside probability
          if (this.Evaluator.isConjoinedMultiplication(signed, c, lastchar, list, component)) {
            Logcal.append("isConjoinedMultiplication === TRUE");
            Logcal.append(">CreateMultiplactionFromList(list) list " + list);
            this.createMultiplicationFromList(list);
          }
          negative = false;
          signed = false;
        } else if (c === exitingchar) {
          if (this.index !== this.input.length - 1) {
            this.parseChar();
          }
          Logcal.end("FROM parseToChar: exitingchar " + exitingchar + " RETURN list " + list);
          return list;
        } else if (c === "-" || c === "+") {
          signed = true;
          negative = this.parseSign();
        } else if (c === "^") {
          component = this.parseIfExponent();
          if (component) {
            list[list.length - 1].setExponent(exponent);
          }
          // negative = false; // how could these even be possible??
          // signed = false;
        } else if (c === "_") {
          console.log("underscore _ inputted inside parseToChar and it's not implemented.. :/");
          this.index++;
        } else if (c === "!") {
          // factorials aren"t consumed in parseBracketed?..
          this.index++;
        } else if (c === "}" || c === ")") {
          // do nutting, just consume the char?
          this.index++;
        } else {
          bad++;
          this.index++;
          if (bad === 10) {
            console.log("too many bad characters " + this.currentlyParsed());
            this.status = "Bad input";
            Logcal.end("FROM parseToChar: exitingchar " + exitingchar + " RETURN list " + list);
            return list;
          }
          negative = false;
          signed = false;
        }
      }
    }
    Logcal.end("FROM parseToChar: exitingchar " + exitingchar + " RETURN list " + list);
    return list;
  }

  parseNextComponent(list, signed) {
    Logcal.start("parseNextComponent: ");
    let component = null,
      c = this.parseIfWhitespace();

    c = this.input.charAt(this.index);

    if (c === "P") {
      c = this.checkIfNextIs("\\left(");
      if (c) {
        component = this.parseProbability();
      } else {
        component = this.parseTerm();
      }
    } else if (this.Evaluator.isTerm(c)) {
      component = this.parseTerm();
    } else if (c === "\\") {
      this.parseCommand(list, signed);
      component = list.splice(list.length - 1, 1)[0];
      // component = list[list.length-1];
    } else {
      console.log("unknown char in parseNextComponent " + c);
      Logcal.end("FROM parseNextComponent: RETURN component " + component);
      return component;
    }
    Logcal.end("FROM parseNextComponent: RETURN component " + component);
    return component;
  }

  parseProbability() {
    Logcal.append("parseToProbability:");
    let probability,
      varlist = [];

    this.parseIfChar("P"); // consuming the "P"
    this.parseCommand(varlist, false); // parsing content between brackets P( <-> )
    // this.parseBracketed(varlist);
    let brack = varlist[0];
    probability = new MathProbability(brack.content);
    probability.setExponent(brack.exponent);
    return probability;
  }

  parseCurlyBracketed(list) {
    Logcal.append("parseCurlyBracketed: list " + list);
    this.parseIfChar("{");
    const content = this.parseToChar("}");
    let bracketed = new MathBracketed(content);
    list.push(bracketed);
  }

  parseRoundBracketed(list) {
    Logcal.append("parseRoundBracketed: list " + list);
    this.parseIfChar("("); // consuming the "("
    const content = this.parseToChar(")");
    let bracketed = new MathBracketed(content);
    bracketed.setExponent(this.parseIfExponent());
    if (this.checkChar(this.index) === "") {
      Logcal.append("Transforming Probability into complement");
      this.parseChar();
      bracketed.setExponent(new MathSymbol("mathsf{c}"));
    }
    // check if ! is found after ) => factorial
    if (this.input.charAt(this.index) === "!") {
      bracketed = new MathFactorial(bracketed);
    }
    list.push(bracketed);
  }

  parseCommand(list, signed) {
    Logcal.append("parseCommand: list " + list + " signed " + signed);
    let command = "",
      lastchar = this.input.charAt(this.index - 1);
    let c = this.parseChar(); // consuming \ //

    while (/^[a-zA-Z]*$/.test(c)) {
      command += c;
      c = this.parseChar();
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
        if (!signed && lastchar !== "=" && list.length > 1) {
          Logcal.append("IF TRUE !signed && " + lastchar + " !== \"=\" && " + list.length + ">1");
          Logcal.append(">CreateMultiplactionFromList(list) list " + list);
          this.createMultiplicationFromList(list);
        }
        break;
      case "left":
        if (c === "(" && (signed || lastchar === "=" || list.length === 0)) {
          this.parseBracketed(list);
        } else if (c === "(") {
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
        if (!signed && lastchar !== "=" && list.length > 1) {
          this.createMultiplicationFromList(list);
        }
        break;
      case "mathsf":
        let complement = [];
        this.parseCurlyBracketed(complement);
        let content = complement[0].content;
        if (content.length === 1 && content[0].isTerm() && content[0].variable === "c") {
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

  createMultiplicationFromList(list) {
    const second = list.splice(list.length - 1, 1)[0];
    const first = list.splice(list.length - 1, 1)[0];
    let mult = new MathOperation(first, "*", second);
    list.push(mult);
  }

  parseMultiplication(list) {
    Logcal.append("parseMultiplication: list " + list);

    var firstfactor = list.splice(list.length - 1, 1)[0];
    var secondfactor;
    var c = this.parseIfWhitespace();
    var negative = this.parseSign();
    c = this.input.charAt(this.index);

    if (this.Evaluator.isTerm(c)) {
      secondfactor = this.parseTerm();
    } else if (c === "\\") {
      var content = [];
      this.parseCommand(content);
      secondfactor = content[0];
    } else if (c === "(") {
      var content = [];
      this.parseBracketed(content);
      secondfactor = content[0];
      // makes multiplications shorter but kinda want the brackets to
      // reduce in order user inputted their stuff
      //secondfactor = content[0].reduceAndReturnIfPossible();
      //} else if (c === "-") {
    } else {
      console.log("currently " + this.currentlyParsed());
      throw ("error in parseMultiplication. unknown secondfactor: " + c);
    }
    if (negative) {
      secondfactor.switchSign();
    }
    var operation = new MathOperation(firstfactor, "*", secondfactor);
    list.push(operation);
  };

  parseFraction(list) {
    Logcal.append("parseFraction: list " + list);

    var firstlist = [],
      secondlist = [];
    this.parseCurlyBracketed(firstlist);
    this.parseCurlyBracketed(secondlist);

    var firstfactor = firstlist[0].reduceAndReturnIfPossible();
    var secondfactor = secondlist[0].reduceAndReturnIfPossible();
    var operation = new MathOperation(firstfactor, "/", secondfactor);
    list.push(operation);
  };

  // parseTermOrFactorial ??
  parseTerm () {
    Logcal.start("parseTerm:");
    var value = "",
      variable = "",
      term, exponent, lower = "",
      factorial = false;
    var c = this.input.charAt(this.index);
    while ((c >= "0" && c <= "9") || c === ".") {
      value += c;
      c = this.parseChar();
    }
    while (/^[a-zA-Z]*$/.test(c)) {
      variable += c;
      // maybe add crazy functionality for xx notation which is x^2
      if (typeof this.variables[c] === "undefined") {
        this.variables[c] = 1;
      } else {
        this.variables[c]++;
      }
      c = this.parseChar();
    }
    if (c === "!") { // factorial
      factorial = true;
      c = this.parseChar();
    }
    if (c === "_") { // has a underscore notation
      c = this.parseChar();
      if (c === "{") {
        lower = this.parseToChar("}");
      } else {
        // only one component which is term???
        lower = this.parseTerm();
      }
    }
    c = this.input.charAt(this.index); // or parseChar??
    exponent = this.parseIfExponent();
    if (c === "") {
      Logcal.append("Transforming Term into complement"); c = this.parseChar(); exponent = new MathSymbol("mathsf{c}");
    }
    value = value.length === 0 ? 1 : parseFloat(value);
    term = new MathTerm(variable, value, exponent);
    if (factorial) {
      Logcal.append("Whops 'Term' was actually factorial");
      term = new MathFactorial(term);
    }
    Logcal.end("FROM parseTerm: RETURN term " + term);
    return term;
  };

  parseIfExponent() {
    Logcal.start("parseIfExponent:");
    var c = this.parseIfChar("^");
    var exponent = "";
    if (c) {
      if (c === "{") {
        var list = [];
        this.parseCurlyBracketed(list);
        exponent = list[0].reduceAndReturnIfPossible();
      } else {
        exponent = this.parseTerm();
      }
    }
    Logcal.end("FROM parseIfExponent: RETURN exponent " + exponent);
    return exponent;
  };

  parseSign() {
    var negative = false;
    if (/^[\-]|[\+]/.test(this.checkChar(this.index))) {
      negative = this.checkChar(this.index) === "-" ? !negative : negative;
      this.parseChar();
    }
    Logcal.append("parseSign: RETURN negative " + negative);
    return negative;
  }

  parseIfWhitespace() {
    while (this.Evaluator.isWhitespace(this.input.charAt(this.index)) && this.index < this.input.length) {
      this.index++;
    }
    return this.input.charAt(this.index);
  }

  checkIfNextIs(latex) {
    if (this.input.length !== (this.index + latex.length + 1) && this.input.substring(this.index + 1, (this.index + 1 + latex.length)) === latex) {
      return true;
    } else {
      return false;
    }
  }

  parseIfChar(chari) {
    if (this.input.charAt(this.index) === chari) {
      return this.parseChar();
    } else {
      return "";
    }
  }

  parseChar() {
    this.index++;
    if (this.index < this.input.length) {
      return this.input.charAt(this.index);
    }
    return "\\\\";
  }

  currentlyParsed() {
    return this.input.slice(0, this.index);
  }

  skipToChar(exitingchar) {
    while (this.index + 1 < this.input.length && this.index >= 0) {
      if (this.input.charAt(this.index) === exitingchar) {
        return;
      }
      this.index++;
    }
  }
}
