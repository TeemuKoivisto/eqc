Calculator.factory("LatexParser", function(MathSymbol, MathTerm, MathOperation, MathBracketed, MathProbability, MathBinomial, MathFactorial, MathSum, MathEquation, Logger, CalculatorUtil) {
  var latexparser = function LatexParser() {
    this.input = "";
    this.index = 0;
    this.equation;
    this.variables = {};
    this.mathtypes = {};

    this.status = "";
    var bad = 0;

    this.parseLatex = function(latex) {
      Logcal.start("LatexParser parseLatex: latex " + latex);

      this.setInput(latex); // unnecessary parameter, equation isn"t used
      var list = this.parseToChar("\\\\");

      Logcal.end("FROM LatexParser parseLatex: latex " + latex + " RETURN list " + list);
      return list;
    }

    this.parseEquation = function(equation) {
      Logcal.start("LatexParser parseEquation: equation " + equation);
      Logcal.timerStart("LatexParser parseEquation");

      this.setInput(equation);
      try {
        this.equation.leftside = this.parseToChar("=");
        this.equation.rightside = this.parseToChar("\\\\");
      } catch (e) {
        console.log("LatexParser errored!" + e);
        this.status = "Parser error";
      }
      CalculatorUtil.setMathtypes(this.mathtypes);

      Logcal.timerEnd("LatexParser parseEquation");
      Logcal.append("equation(latex) " + this.equation.toLatex())
      Logcal.end("FROM LatexParser parseEquation: equation " + equation + " RETURN equation");
      return this.equation;
    };

    // this.setEquationAndParseAll = function(input) {
    // Logcal.timerStart("LatexParser setEquationAndParseAll");
    // this.setInput(input);
    // this.parseAll();
    // Logcal.timerEnd("LatexParser setEquationAndParseAll");
    // return this.equation;
    // };

    this.setInput = function(latex) {
      this.status = "";
      bad = 0;
      this.input = latex;
      this.index = 0;
      this.equation = new MathEquation();
      this.variables = {};
      this.mathtypes = {};
      Logger.resetLogs();
    };

    // this.parseRightside = function () {
    // Logger.clog("parseRightside: this.input " + this.input);
    // this.equation.rightside = this.parseToChar("\\\\");
    // };

    // this.parseAll = function () {
    // // Logcal.start("LatexParser parseAll: ");
    // this.equation.leftside = this.parseToChar("=");
    // this.equation.rightside = this.parseToChar("\\\\");
    // CalculatorUtil.setMathtypes(this.mathtypes);
    // // Logcal.end("FROM LatexParser parseAll: VALUE equation " + this.equation);
    // };

    this.parseToChar = function(exitingchar) {
      Logcal.start("parseToChar: exitingchar " + exitingchar);
      var list = [],
        lastchar = "",
        c = "",
        negative = false,
        signed = false,
        component = null;
      while (this.index < this.input.length) {
        if (bad === 10) return list;
        lastchar = this.checkChar(this.index - 1);
        c = this.input.charAt(this.index);

        if ((c >= "0" && c <= "9") || /^[a-zA-Z]*$/.test(c) || c === "\\") {
          component = this.parseNextComponent(list, signed);
          if (component) {
            if (negative) {
              component.switchSign();
            }
            // console.log("lastchar " + lastchar + " c is " + c)
            // this.logc()
            list.push(component);
            // checks for if current component was command > no multiplication as is it handled
            // also for not self/previous component being Symbol if inside probability
            if (!signed && c !== "\\" && lastchar !== "=" && list.length > 1 && list[list.length - 2].type !== "Symbol" && component.type !== "Symbol") {
              Logcal.append("IF TRUE !" + signed + " (!signed) && " + lastchar + " !== \"=\" && " + list.length + ">1");
              Logcal.append(">CreateMultiplactionFromList(list) list " + list);
              this.createMultiplicationFromList(list);
            }
          }
          negative = false;
          signed = false;
        } else if (c === exitingchar) {
          // if (c === exitingchar) {
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
          console.log("parse underscore which isn\"t implemented")
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
      Logcal.end("FROM parseToChar: exitingchar " + exitingchar + " RETURN list " + list);
      return list;
    }

    this.parseToChar2 = function(exitingchar) {
      Logcal.start("parseToChar: exitingchar " + exitingchar);
      var list = [];
      var negative = false,
        signed = false;
      while (this.index < this.input.length) {
        if (bad === 10) return list;
        var lastchar = this.checkChar(this.index - 1);
        var c = this.input.charAt(this.index);
        if (c === "P") {
          var probability = this.parseProbability();
          if (negative) {
            probability.switchSign();
            negative = false;
          }
          list.push(probability);
          // checks for P(A)P(B) = P(A)*P(B)
          if (!signed && lastchar !== "=" && list.length > 1) {
            Logcal.append("IF TRUE !" + signed + " (!signed) && " + lastchar + " !== \"=\" && " + list.length + ">1");
            this.createMultiplicationFromList(list);
          }
          signed = false;
        } else if ((c >= "0" && c <= "9") || /^[a-zA-Z]*$/.test(c)) {
          var term = this.parseTerm();
          if (negative) {
            term.switchSign();
            negative = false;
          }
          signed = false;
          list.push(term);
        } else if (c === "-" || c === "+") {
          signed = true;
          negative = this.parseSign();
        } else if (c === "\\") {
          this.parseCommand(list, signed);
          if (negative) {
            list[list.length - 1].switchSign();
            negative = false;
          }
          signed = false;
        } else if (c === "^") {
          var exponent = this.parseIfExponent();
          list[list.length - 1].setExponent(exponent);
          signed = false;
        } else if (c === exitingchar) {
          if (this.index !== this.input.length - 1) {
            this.parseChar();
          }
          Logcal.end("FROM parseToChar: exitingchar " + exitingchar + " RETURN list " + list);
          return list;
        } else {
          if (this.index + 1 !== this.input.length) {
            console.log("bad input " + c + " wanted " + exitingchar + " at index " + this.index + " in list " + list);
            bad++;
          }
          signed = false;
          this.parseChar();
          if (bad === 10) {
            console.log("too many bad characters " + this.currentlyParsed());
            this.status = "Bad input";
            Logcal.end("FROM parseToChar: exitingchar " + exitingchar + " RETURN list " + list);
            return list;
          }
        }
      }
      Logcal.end("FROM parseToChar: exitingchar " + exitingchar + " RETURN list " + list);
      return list;
    };

    this.parseNextComponent = function(list, signed) {
      Logcal.start("parseNextComponent: ");
      var component = null,
        c = this.parseIfWhitespace();

      c = this.input.charAt(this.index);

      if (c === "P") {
        c = this.checkIfNextIs("\\left(");
        if (c) {
          component = this.parseProbability();
        } else {
          component = this.parseTerm();
        }
      } else if ((c >= "0" && c <= "9") || /^[a-zA-Z]*$/.test(c)) {
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
      // this.recordComponent(component);
      Logcal.end("FROM parseNextComponent: RETURN component " + component);
      return component;
    };

    // TODO
    // in utter shits. add record component and make it work
    this.parseSum = function(list) {
      Logcal.append("parseSum: list " + list);
      var lower, higher, c = this.parseIfChar("_");
      if (c) {
        c = this.parseIfChar("{"); // consuming the "{"
        if (c) {
          lower = new MathBracketed(this.parseToChar("}"));
        } else {
          if (/^[a-zA-Z]*$/.test(this.input.charAt(this.index))) {
            lower = new MathTerm(this.input.charAt(this.index), 1, 1, 0);
          } else {
            lower = new MathTerm("", parseFloat(this.input.charAt(this.index)), 0, 0);
          }
          this.index++; // consuming c
        }
      }
      c = this.parseIfChar("^");
      if (c === "{") {
        higher = new MathBracketed(this.parseToChar("}"));
      } else {
        // if only one char the content continues straight after without anything between
        // ^0n(... >> fuck me
        if (/^[a-zA-Z]*$/.test(c)) {
          higher = new MathTerm(c, 1, 1, 0);
        } else {
          higher = new MathTerm("", parseFloat(c), 0, 0);
        }
        this.index++; // consuming the last char
      }
      //            onko sillä väliä onko MathBracketed vai yksi joku random komponentti?
      var content = new MathBracketed(this.parseToChar("="));
      this.index--; // reversing the consumation of = -char

      var sum = new MathSum(lower, higher, content);
      this.recordComponent(sum);
      list.push(sum);
    };

    this.parseBinomial = function(list) {
      Logcal.append("parseToBinomial: list " + list);
      this.parseIfChar("{");
      var upper,
        lower,
        firstlist = this.parseToChar("}");

      if (firstlist.length > 1) {
        upper = new MathBracketed(firstlist);
      } else {
        upper = firstlist[0];
      }
      this.parseIfChar("{");
      var secondlist = this.parseToChar("}");
      if (secondlist.length > 1) {
        lower = new MathBracketed(secondlist);
      } else {
        lower = secondlist[0];
      }
      var binomial = new MathBinomial(upper, lower);
      binomial.setExponent(this.parseIfExponent());
      this.recordComponent(binomial);
      list.push(binomial);
      return list;
    };

    this.parseProbability = function() {
      Logcal.append("parseToProbability:");
      var probability,
        varlist = [];

      this.parseIfChar("P"); // consuming the "P"
      this.parseCommand(varlist, false); // parsing content between brackets P( <-> )
      // this.parseBracketed(varlist);
      var brack = varlist[0];
      probability = new MathProbability(brack.content);
      probability.setExponent(brack.exponent);
      this.recordComponent(probability);
      return probability;
    };

    this.parseCurlyBracketed = function(list) {
      Logcal.append("parseCurlyBracketed: list " + list);
      this.parseIfChar("{");
      var content = this.parseToChar("}");
      var bracketed = new MathBracketed(content);
      // I think curlies never have exponents, it"s the components they are part of
      //var exponent = this.parseIfExponent();
      //if (exponent) {
      //    bracketed.setExponent(exponent);
      //}
      this.recordComponent(bracketed);

      list.push(bracketed);
    };

    this.parseBracketed = function(list) {
      Logcal.append("parseBracketed: list " + list);
      this.parseIfChar("("); // consuming the "("
      var content = this.parseToChar(")");
      var bracketed = new MathBracketed(content);
      bracketed.setExponent(this.parseIfExponent());
      // this.logc();
      if (this.checkChar(this.index) === ""
        ") {
        Logcal.append("Transforming Probability into complement"); this.parseChar(); bracketed.setExponent(new MathSymbol("mathsf{c}"));
      }
      if (this.input.charAt(this.index) === "!") {
        // was factorial
        bracketed = new MathFactorial(bracketed);
      }
      this.recordComponent(bracketed);
      list.push(bracketed);
    };

    this.parseCommand = function(list, signed) {
      Logcal.append("parseCommand: list " + list + " signed " + signed);
      var command = "",
        lastchar = this.input.charAt(this.index - 1);
      var c = this.parseChar(); // consuming \ //
      while (/^[a-zA-Z]*$/.test(c)) {
        command += c;
        c = this.parseChar();
        if (command.length === 10) {
          throw ("overly long string in parseCommand " + command);
        }
      }
      //            console.log("entering switch with " + string + " char " + c + " and lastchar " + lastchar);
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
          var complement = [];
          this.parseCurlyBracketed(complement);
          var content = complement[0].content;
          if (content.length === 1 && content[0].isTerm() && content[0].variable === "c") {
            list.push(new MathSymbol("mathsf{c}"));
          }
          break;
        case "text":
          // just parses and ignores
          this.skipToChar("}");
          break;
        default:
          var symbol = new MathSymbol(command);
          //this.recordComponent(symbol);
          list.push(symbol);
          break;
      }
    };

    this.createMultiplicationFromList = function(list) {
      var second = list.splice(list.length - 1, 1)[0];
      var first = list.splice(list.length - 1, 1)[0];
      var mult = new MathOperation(first, "*", second);
      this.recordComponent(mult);
      list.push(mult);
    };

    this.parseMultiplication = function(list) {
      Logcal.append("parseMultiplication: list " + list);

      var firstfactor = list.splice(list.length - 1, 1)[0];
      var secondfactor;
      var c = this.parseIfWhitespace();
      var negative = this.parseSign();
      c = this.input.charAt(this.index);

      if ((c >= "0" && c <= "9") || /^[a-zA-Z]*$/.test(c)) {
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
      this.recordComponent(operation);
      list.push(operation);
    };

    this.parseFraction = function(list) {
      Logcal.append("parseFraction: list " + list);

      var firstlist = [],
        secondlist = [];
      this.parseCurlyBracketed(firstlist);
      //console.log("in between fractions " + this.currentlyParsed());
      this.parseCurlyBracketed(secondlist);

      var firstfactor = firstlist[0].reduceAndReturnIfPossible();
      var secondfactor = secondlist[0].reduceAndReturnIfPossible();
      var operation = new MathOperation(firstfactor, "/", secondfactor);
      this.recordComponent(operation);
      list.push(operation);
    };

    // parseTermOrFactorial ??
    this.parseTerm = function() {
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
      if (c === ""
        ") {
        Logcal.append("Transforming Term into complement"); c = this.parseChar(); exponent = new MathSymbol("mathsf{c}");
      }
      value = value.length === 0 ? 1 : parseFloat(value);
      term = new MathTerm(variable, value, exponent);
      if (factorial) {
        Logcal.append("Whops \"Term\" was actually factorial");
        term = new MathFactorial(term);
      }
      Logcal.end("FROM parseTerm: RETURN term " + term);
      return term;
    };

    this.parseIfExponent = function() {
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
      //this.parseIfChar("}");
      Logcal.end("FROM parseIfExponent: RETURN exponent " + exponent);
      return exponent;
    };

    this.isWhitespace = function(chari) {
      return ((chari === " ") || (chari === "\t") || (chari === "\n"));
    };

    this.parseSign = function() {
      var negative = false;
      if (/^[\-]|[\+]/.test(this.checkChar(this.index))) {
        negative = this.checkChar(this.index) === "-" ? !negative : negative;
        this.parseChar();
      }
      Logcal.append("parseSign: RETURN negative " + negative);
      return negative;
    };

    this.parseIfWhitespace = function() {
      while (this.isWhitespace(this.input.charAt(this.index)) && this.index < this.input.length) {
        this.index++;
      }
      return this.input.charAt(this.index);
    };

    this.checkIfNextIs = function(latex) {
      if (this.input.length !== (this.index + latex.length + 1) && this.input.substring(this.index + 1, (this.index + 1 + latex.length)) === latex) {
        // return this.parseChar();
        // this.index += latex.length + 1;
        // this.logc()
        return true;
      } else {
        return false;
      }
    };

    this.parseIfChar = function(chari) {
      if (this.input.charAt(this.index) === chari) {
        return this.parseChar();
      } else {
        return "";
      }
    };

    this.parseChar = function() {
      this.index++;
      if (this.index < this.input.length) {
        //                while (this.isWhitespace(this.input.charAt(this.index))) {
        //                    this.index++;
        //                }
        return this.input.charAt(this.index);
      }
      //            console.log(this.equation.toString());
      return "\\\\";
      throw ("end of file and char " + this.input.charAt(this.index - 1));
      return "!eof";
    };

    this.checkChar = function(i) {
      if (i < this.input.length && i >= 0) {
        while (this.isWhitespace(this.input.charAt(i))) {
          i--;
        }
        return this.input.charAt(i);
      }
      return "!eof";
    };

    // this.lastChar = function() {
    // if (i < this.input.length && i >= 0) {
    // while (this.isWhitespace(this.input.charAt(i))) {
    // i--;
    // }
    // return this.input.charAt(i);
    // }
    // }

    this.logc = function() {
      console.log("currently " + this.currentlyParsed());
    }

    this.currentlyParsed = function() {
      return this.input.slice(0, this.index);
    };

    this.skipToChar = function(exitingchar) {
      while (this.index + 1 < this.input.length && this.index >= 0) {
        if (this.input.charAt(this.index) === exitingchar) {
          return;
        }
        this.index++;
      }
    }

    // pitäiskö tallentaa määrä vai koko komponentti?
    this.recordComponent = function(mathobject) {
      if (typeof this.mathtypes[mathobject.type] === "undefined") {
        this.mathtypes[mathobject.type] = 1;
      } else {
        this.mathtypes[mathobject.type]++;
      }
    };
  };

  return latexparser;
});
