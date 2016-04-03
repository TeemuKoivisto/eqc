Calculator.service("CalculatorBasic", function(CalculatorUtil, CalculatorExponent, MathTerm, MathOperation, MathBracketed, Orderer, Logger) {
  this.options = {
    "showBracketsAfterReducingIntoOneTerm": false,
    "reduceFractions": true,
    "showSignOperations": false // >> +(-3) > -3 -(-3) > 3
  }

  // equation ei ole mathobject
  // eikä equationin puolikas todellakaan myöskään
  this.calculate = function(Location, MathObject) {
    //console.log("order is " + (Orderer.orders[0]+1) + " and this object " + MathObject.order );
    Logcal.start("CalculatorBasic calculate: Location " + Location + " MathObject " + MathObject);

    if (MathObject.type !== "Operation") {
      if (MathObject.type === "Bracketed") {
        this.sumList(MathObject.content);
        // tässä joku checkki jos tulos on 1 size bracketed niin sievennys
        if (MathObject.content.length === 1) {
          if (MathObject.minussign) {
            MathObject.content[0].switchSign();
          }
          MathObject.content[0].exponent = MathObject.exponent;
          CalculatorUtil.replaceSingleComponentWithComponent(Location, MathObject, MathObject.content[0]);
        } else if (Location.type === "Bracketed" || Location.type === "MathArray" || Location.type === "Equation") {
          Logcal.append("CONDITION TRUE " + Location.type + " === Bracketed || " + Location.type + " === MathArray || " + Location.type + " === Equation");
          if (MathObject.minussign) {
            for (var i = 0; i < MathObject.content.length; i++) {
              MathObject.content[i].switchSign();
            }
          }
          CalculatorUtil.replaceSingleComponentWithList(Location, MathObject, MathObject.content);
        }
      } else if (MathObject.type === "Equation") {
        // this.sumList(MathObject.larray.content);
        // this.sumList(MathObject.rarray.content);
        // throw("fix me?")
        this.sumList(MathObject.leftside);
        this.sumList(MathObject.rightside);
      } else if (MathObject.type === "Term") {
        // nothing to do???
      } else {
        throw ("calculate: unsupported sum-operation " + JSON.stringify(Location) + " and " + JSON.stringify(MathObject));
      }
    } else if (MathObject.operation === "/") {
      this.divideAndReplace(Location, MathObject);
    } else if (MathObject.operation === "*") {
      this.multiplyAndReplace(Location, MathObject);
    } else {
      throw ("what is this operation shit?");
    }
    Logcal.end("FROM CalculatorBasic calculate: Location " + Location + " MathObject " + MathObject);
  }

  //    this.replaceVariableWithSomething = function (Equation) {
  //        var replacing = [];
  //        replacing.push(new MathTerm("n", 1, 0, 0));
  //        replacing.push(new MathTerm("n", 1, 1, 0));
  //        this.replaceEquationVariableWithList(Equation, "n", replacing);
  //    }
  //
  //    this.replaceVariable = function (Term, Variable, MathObjectList) {
  //        Logcal.start("replaceVariable: Term " + Term + " Variable " + Variable + " MathObjectList " + MathObjectList);
  //        var resultlist = [];
  //        if (Term.variable === Variable && Term.variablevalue !== 0) {
  //            if (MathObjectList.length > 1) {
  //                // 3n replace with n+1 -> 3*n + 3*1
  //                for (var i = 0; i < MathObjectList.length; i++) {
  //                    var listofone = [];
  //                    listofone.push(MathObjectList[i]);
  //                    var copyofthis = jQuery.extend(true, {}, Term);
  //                    var resultofcopy = this.replaceVariable(copyofthis, Variable, listofone);
  //                    // tuleeko ulos aina yksi termi? push apply ei jostain syystä toimi
  ////                    result.push.apply(resultofcopy);
  //                    resultlist.push(resultofcopy[0]);
  ////                    console.log("looping and result is " + resultlist);
  //                }
  //            } else {
  //                var first = MathObjectList[0];
  //                // 3n^2 replace with 5n -> 3 * (5n * 5n)
  //                // 3n^2 replace with 5 -> 3 * (5 * 5)
  //                var result = jQuery.extend(true, {}, first);
  ////                console.log("result was " + result);
  //                for (var i = 1; i < Term.variablevalue; i++) {
  //                    var fname = "multiply" + result.type + "And" + first.type;
  //                    this[fname](result, first);
  //                }
  //                this["multiply" + result.type + "AndTerm"](result, new MathTerm("", Term.value, 0, 0));
  ////                console.log("result after multiplication " + result);
  //                Term.value = result.value;
  //                Term.variablevalue = result.variablevalue;
  //                // push result?
  //                resultlist.push(Term);
  //            }
  //        }
  //        Logcal.end("FROM replaceVariable: RETURN resultlist " + resultlist + " Term " + Term + " Variable " + Variable + " MathObjectList " + MathObjectList);
  //        return resultlist;
  //    }
  //
  //    this.findAndReplaceVariable = function (Previous, Current, Variable, ReplacingList) {
  //        Logcal.append("findAndReplaceVariable: Previous " + Previous + " Current " + Current + " Variable " + Variable + " ReplacingList " + ReplacingList);
  //        if (Current.isTerm() && Current.includesVariable(Variable)) {
  //            var list = this.replaceVariable(Current, Variable, ReplacingList);
  ////            console.log("list was " + list);
  //            var newcomponent = list.length === 1 ? list[0] : new MathBracketed(list);
  ////            console.log("current is term so in " + Previous + " is " + Current + " replaced with " + newcomponent)
  //            CalculatorUtil.replaceSingleComponentWithComponent(Previous, Current, newcomponent);
  //        } else if (Current.isOperation() && Current.includesVariable(Variable)) {
  //            this.findAndReplaceVariable(Current, Current.firstfactor, Variable, ReplacingList);
  //            this.findAndReplaceVariable(Current, Current.secondfactor, Variable, ReplacingList);
  //        } else if (Current.isBracketed() && Current.includesVariable(Variable)) {
  //            for (var i = 0; i < Current.content.length; i++) {
  //                this.findAndReplaceVariable(Current, Current.content[i], Variable, ReplacingList);
  //            }
  //        } else {
  //            return;
  //        }
  //    }
  //
  //    this.replaceEquationVariableWithList = function (Equation, Variable, ReplacingList) {
  //        Logger.clog("replaceEquationVariableWithList: Equation " + Equation + " Variable " + Variable + " ReplacingList " + ReplacingList);
  //        for (var i = 0; i < Equation.leftside.length; i++) {
  //            this.findAndReplaceVariable(Equation.leftside, Equation.leftside[i], Variable, ReplacingList);
  //        }
  //        for (var i = 0; i < Equation.rightside.length; i++) {
  //            this.findAndReplaceVariable(Equation.rightside, Equation.rightside[i], Variable, ReplacingList);
  //        }
  //    }

  this.sumList = function(list) {
    Logcal.start("sumList: list " + list);
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list.length; j++) {
        var functionname = "sum" + list[i].type + "And" + list[j].type;
        if (i !== j && this[functionname](list[i], list[j])) {
          list.splice(j, 1);
          j--;
          if (list[i].isEmpty() && list.length !== 1) {
            Logcal.append("CONDITION TRUE " + list[i] + ".isEmpty() && " + list + ".length !== 1");
            list.splice(i, 1);
            i--;
            break;
          }
        }
      }
    }
    Logcal.end("FROM sumList: list " + list);
  }

  this.sumBracketedAndBracketed = function(Augent, Addend) {
    throw ("cant sum bracketed into bracketed");
  }

  this.sumBracketedAndOperation = function(Augent, Addend) {
    throw ("cant sum operation into bracketed");
  }

  this.sumBracketedAndTerm = function(Augent, Addend) {
    throw ("cant sum term into bracketed");
  }

  this.sumOperationAndBracketed = function(Augent, Addend) {
    throw ("unsupported sum operation and bracketed");
  }

  // method used for summing fractions together
  this.sumOperationAndOperation = function(Augent, Addend) {
    //        throw("unsupported sum operation and operation");
    Logcal.start("sumOperationAndOperation: Augent " + Augent + " Addend " + Addend);
    if (this.equalDenominators(Augent, Addend)) {
      var fname = "sum" + Augent.firstfactor.type + "And" + Addend.firstfactor.type;
      if (this[fname](Augent.firstfactor, Addend.firstfactor)) {
        // replace component shit??
      }
      Logcal.end("FROM sumOperationAndOperation: RETURN TRUE Augent " + Augent + " Addend " + Addend);
      return true;
    }
    //        Logger.appendLatex(" which should be summed here and return TRUE");
    // maybe this should be done in two parts;
    // first equal then sum but well whatever
    Logcal.end("FROM sumOperationAndOperation: RETURN FALSE Augent " + Augent + " Addend " + Addend);
    return false;

    //        Augent.first

    // 5/4 + 2/4 = 5+2 /4 EI OTA huomioon ns. synonyymeja? Jos ei siis supistettu
    // vaikka 5/(2+2) + 2/4 = n/a
    // ja 5
    if (!this.divided && !Multiplier.divided) {
      if (this.secondfactor.isEqual(Multiplier.secondfactor)) {
        this.firstfactor.sum(Multiplier.firstfactor);
        return true; // should always return true??
      }
      // (x+1)(2+x) + (x+2)(x+3) === (x+1+x+3)(2+x)
      // (x/1)*(3x) + 3x*5/8 === n/a >> (x/1+5/8)*(3x) tai jättää summaamatta kokonaan...
    } else if (this.divided && Multiplier.divided) {
      if (Multiplier.firstfactor.isEqual(this.firstfactor)) {
        return this.firstfactor.sum(Multiplier.firstfactor);
      } else if (Multiplier.secondfactor.isEqual(this.firstfactor)) {
        return this.firstfactor.sum(Multiplier.secondfactor);
      } else if (Multiplier.firstfactor.isEqual(this.secondfactor)) {
        return this.secondfactor.sum(Multiplier.firstfactor);
      } else if (Multiplier.secondfactor.isEqual(this.secondfactor)) {
        return this.secondfactor.sum(Multiplier.secondfactor);
      }
    }
  }

  this.sumOperationAndTerm = function(Augent, Addend) {
    throw ("unsupported sum operation and term");
  }

  this.sumTermAndBracketed = function(Augent, Addend) {
    throw ("unsupported sum term and bracketed");
  }

  this.sumTermAndOperation = function(Augent, Addend) {
    throw ("unsupported sum term and operation");
  }

  this.sumTermAndTerm = function(Augent, Addend) {
    Logcal.append("sumTermAndTerm: Augent " + Augent + " Addend " + Addend);
    if (CalculatorUtil.areExponentsEqual(Augent, Addend) && Addend.variable === Augent.variable) {
      Logger.newLatex("Summing " + Augent + " and " + Addend);
      Augent.plusValue(Addend.value);
      if (Augent.getValue() === 0) {
        Augent.setValue(0);
        Augent.variable = "";
        Augent.exponent = "";
      }
      return true;
    }
    return false;
  }

  // multiplication operations

  this.multiplyAndReplace = function(Location, Operation) {
    Logcal.append("multiplyAndReplace: Location " + Location + " Operation " + Operation);
    var functionname = "multiply" + Operation.firstfactor.type + "And" + Operation.secondfactor.type;
    if (this.checkAndConvertIfExponents(Location, Operation)) {
      return;
    }
    var result = this[functionname](Operation.firstfactor, Operation.secondfactor);
    if (typeof result === "undefined") {
      CalculatorUtil.replaceSingleComponentWithComponent(Location, Operation, Operation.firstfactor);
    } else if (result === "reversed") {
      CalculatorUtil.replaceSingleComponentWithComponent(Location, Operation, Operation.secondfactor);
    } else {
      throw ("multiplication failed?");
    }
  }

  this.multiplyBracketedAndBracketed = function(Multiplicand, Multiplier) {
    //        throw("multiply brack and brack");
    Logcal.start("multiplyBracketedAndBracketed: Multiplicand " + Multiplicand + " Multiplier " + Multiplier);
    //        var success = true;
    var result = [];
    for (var i = 0; i < Multiplicand.content.length; i++) {
      for (var j = 0; j < Multiplier.content.length; j++) {
        //                this["multiply" + Multiplicand.content[i].type + "And" + Multiplier.content[j].type](Multiplicand.content[i], Multiplier.content[j]);
        var copy = jQuery.extend(true, {}, Multiplicand.content[i]);
        this["multiply" + Multiplicand.content[i].type + "And" + Multiplier.content[j].type](copy, Multiplier.content[j]);
        result.push(copy);
        //                var copy = jQuery.extend(true, {}, Multiplicand.content[i]);
        //                if (copy.multiply(Multiplier.content[j]) == false) {
        //                    success = false;
        //                    throw("failure in multiplying bracketed with bracketed. not fatal though. just weird.");
        //                }
        //                result.push(copy);
      }
    }
    Multiplicand.content = result;
    Logcal.end("FROM multiplyBracketedAndBracketed: RETURN Multiplicand " + Multiplicand + " Multiplier " + Multiplier);
    //        return Multiplicand;
  }

  this.multiplyBracketedAndOperation = function(Multiplicand, Multiplier) {
    throw ("multiply brack and op");
    if (Multiplicand.content.length === 1) {
      //            var success = true;
      for (var i = 0; i < Multiplicand.content.length; i++) {
        var functionname = "multiply" + Multiplicand.content[i].type + "AndOperation";
        console.log(functionname);
        this[functionname](Old, Multiplicand.content[i], Multiplicand.content[i], Multiplier);
        //                if (result === false) {
        //                    throw ("multiplication " + functionname + " failed. ja mahdoton korjata jo kerrottuja");
        //                    success = false;
        //                }
      }
    } else {
      throw ("cant multiply more than 1 size bracketed and operation");
    }
  }

  this.multiplyBracketedAndTerm = function(Multiplicand, Multiplier) {
    //        throw("multiply brack and term");
    Logcal.start("multiplyBracketedAndTerm: Multiplicand " + Multiplicand + " Multiplier " + Multiplier);
    //        var success = true;
    for (var i = 0; i < Multiplicand.content.length; i++) {
      this["multiply" + Multiplicand.content[i].type + "AndTerm"](Multiplicand.content[i], Multiplier);
      //            if (result && result === false) {
      //                throw ("multiplication failed. ja mahdoton korjata jo kerrottuja");
      ////                success = false;
      //            }
    }
    Logcal.end("FROM multiplyBracketedAndTerm: Multiplicand " + Multiplicand + " Multiplier " + Multiplier);
    //        return Multiplicand;
    //        return success;
  }

  this.multiplyOperationAndBracketed = function(Multiplicand, Multiplier) {
    throw ("unsupported multiply operation and bracketed");
    // reverse to bracketed and operation
  }

  this.multiplyOperationAndOperation = function(Multiplicand, Multiplier) {
    // only between two fractions???
    if (Multiplicand.isfraction && Multiplier.isfraction) {
      this["multiply" + Multiplicand.firstfactor.type + "And" + Multiplier.firstfactor.type](Multiplicand.firstfactor, Multiplier.firstfactor);
      //            this.replaceSingleComponentWithComponent(Multiplicand, Multiplicand.firstfactor, Multiplicand.firstfactor);
      // maybe for type of (x+2) * 3 of things leave rather (x+2)*3 than 3x+6
      this["multiply" + Multiplicand.secondfactor.type + "And" + Multiplier.secondfactor.type](Multiplicand.secondfactor, Multiplier.secondfactor);
    } else {
      throw ("unsupported NON fraction multiply operation and operation");
    }
  }

  // reverse this or multiplyTermAndOperation
  this.multiplyOperationAndTerm = function(Multiplicand, Multiplier) {
    throw ("multiply op and term");
    var functionname = "multiply" + Multiplicand.firstfactor.type + "AndTerm";

    if (Multiplicand.isFraction) {
      this[functionname](Multiplicand.firstfactor, Multiplier);
    } else {
      this[functionname](Multiplicand.secondfactor, Multiplier);
      this.replaceSingleComponentWithComponent(Multiplicand);
      // sama asia kuin secondfactor = seconfactor.firstfactor
    }
    //never should throw error?
    //        throw("unsupported multiply operation and term");
  }

  this.multiplyTermAndBracketed = function(Multiplicand, Multiplier) {
    //        throw("multiply term and brack");
    Logcal.append("multiplyTermAndBracketed: Multiplicand " + Multiplicand + " Multiplier " + Multiplier);
    Logcal.append("Reversing the Multiplicand and Multiplier");
    // reversing multiplicand and multiplier since it"s basically the same and saves extra coding
    this.multiplyBracketedAndTerm(Multiplier, Multiplicand);
    return "reversed";
  }

  this.multiplyTermAndOperation = function(Multiplicand, Multiplier) {
    throw ("unsupported multiply term and operation");
  }

  this.multiplyTermAndTerm = function(Multiplicand, Multiplier) {
    //        throw("multiply term and term");
    Logcal.append("multiplyTermAndTerm: Multiplicand " + Multiplicand + " Multiplier " + Multiplier);
    Logger.newLatex("Multiplying " + Multiplicand + " and " + Multiplier);
    Multiplicand.multiplyValue(Multiplier.value);
    Multiplicand.checkSign();
    // what if different variables..?
    // what if more than one variable??
    if (Multiplier.variable || Multiplicand.variable) {
      CalculatorUtil.addTermVariables(Multiplicand, Multiplier, true);
    }
    //CalculatorUtil.addOrSubstractExponents(Multiplicand, Multiplier, true);
    //Multiplicand.variablevalue += Multiplier.variablevalue;
    //        return Multiplicand;
  };

  // division operations

  this.divideAndReplace = function(Location, Operation) {
    var functionname = "divide" + Operation.firstfactor.type + "And" + Operation.secondfactor.type;
    Logcal.append("divideAndReplace: Location " + Location + " Operation " + Operation);
    // entä jos jakolasku esim 2/2? joku check tähänkin || isReducable/whatever

    if (this.options["reduceFractions"]) {
      if (this.checkAndConvertIfExponents(Location, Operation)) {
        return;
      }
      var success = this[functionname](Operation.firstfactor, Operation.secondfactor);

      // joku checkki tähän jos divide epäonnistuu...
      //            if (success) {
      if (Operation.minussign) {
        Operation.firstfactor.switchSign();
      }
      CalculatorUtil.replaceSingleComponentWithComponent(Location, Operation, Operation.firstfactor);
      //            }
    } else if (Operation.firstfactor.isOperation() && Operation.secondfactor.isOperation()) {
      // only operation & operation supported one in no-fractionReducing
      // some swap function here..?
      if (Operation.firstfactor.isfraction && Operation.secondfactor.isfraction) {
        // (5/2)/(3/2) >> (5/2)*(2/3)
        Logcal.start("swapping fractions: Location " + Location + " Operation " + Operation);
        Logger.newLatex("Turning division $" + Operation + "$ to multiplication and swapping " + Operation.secondfactor);
        Operation.operation = "*";
        Operation.secondfactor.swapFactors();
        Orderer.repeatRound = true;
        //                Operation.order++;
        Logcal.end("FROM swapping fractions: Location " + Location + " Operation " + Operation);
      } else {
        throw ("only division between two fractions supported");
      }
    } else if (Operation.firstfactor.isBracketed() && Operation.secondfactor.isTerm()) {
      Logcal.start("creating a lot operations: Location " + Location + " Operation " + Operation);
      Logger.newLatex("new latex ");
      var result = [];
      for (var i = 0; i < Operation.firstfactor.content.length; i++) {
        result.push(new MathOperation(Operation.firstfactor.content[i], "/", Operation.secondfactor));
      }
      Operation.firstfactor.content = result;
      CalculatorUtil.replaceSingleComponentWithComponent(Location, Operation, Operation.firstfactor);
      Logcal.end("FROM making operations Location " + Location + " Operation " + Operation);
    }
  };

  // what of primes?
  this.greatestCommonFactor = function(First, Second) {
    if (arguments.length < 2) {
      return First;
    }
    var Something;
    First = Math.abs(First);
    Second = Math.abs(Second);

    while (Second) {
      Something = First % Second;
      First = Second;
      Second = Something;
    }
    return First;
  }

  // maybe check for immense numbers to reduce load
  this.simplifyFractionTerms = function(Numerator, Denominator) {
    //        var smaller = Numerator <= Denominator ? Numerator : Denominator;
    Logcal.start("simplifyFractionTerms: Numerator " + Numerator + " Denominator " + Denominator);
    for (var i = Denominator - 1; i > 1; i--) {
      if (Denominator % i === 0 && Numerator % i === 0) {
        Numerator.divideValue(i);
        Denominator.divideValue(i);
      }
    }
    Logcal.end("FROM simplifyFractionTerms: Numerator " + Numerator + " Denominator " + Denominator);
  }

  this.equalDenominators = function(First, Second) {
    Logcal.start("equalDenominators: First " + First + " Second " + Second);
    var firstvalue = "empty",
      secondvalue = "empty";

    if (First.firstfactor.isTerm() && First.secondfactor.isTerm()) {
      firstvalue = First.secondfactor.value;
    }
    if (Second.firstfactor.isTerm() && Second.secondfactor.isTerm()) {
      secondvalue = Second.secondfactor.value;
    }
    // TODO make work with Bigs
    throw ("can you compare to two Bigs with ===");
    if (firstvalue === "empty" || secondvalue === "empty") {
      throw ("non term factor inside equaldenominators");
    } else if (firstvalue === secondvalue) {
      Logcal.append("CONDITION TRUE " + firstvalue + " === " + secondvalue);
      Logcal.end("FROM equalDenominators: RETURN VOID First " + First + " Second " + Second);
      return false;
    } else {
      Logger.newLatex("Should equal denominators " + First + " and " + Second);
      this.simplifyFractionTerms(First.firstfactor, First.secondfactor);
      this.simplifyFractionTerms(Second.firstfactor, Second.secondfactor);
      firstvalue = First.secondfactor.value;
      secondvalue = Second.secondfactor.value;
    }

    var smaller = firstvalue <= secondvalue ? firstvalue : secondvalue;

    if (firstvalue % smaller === 0 && secondvalue % smaller === 0) {
      Logcal.append("CONDITION TRUE " + firstvalue + " % " + smaller + " === 0 && " + secondvalue + " % " + smaller + " === 0");
      Logcal.append("smaller denominator is a factor of the larger one");
      // the smaller denominator is a factor of the larger one >> 2/5 & 2/10 = 5%5 = 0 & 10%5 = 0
      // actually it would be 2/5 & 1/5 ...
      // so only the equalifying of the smaller factor is needed
      // with the exception of equal denominators
      if (firstvalue <= secondvalue) {
        Logcal.append("CONDITION TRUE " + firstvalue + " <= " + secondvalue);
        for (var i = 1; i < secondvalue; i++) {
          if (firstvalue * i === secondvalue) {
            First.firstfactor.multiplyValue(i);
            First.secondfactor.multiplyValue(i);
          }
        }
      } else {
        for (var i = 1; i < firstvalue; i++) {
          if (secondvalue * i === firstvalue) {
            Second.firstfactor.multiplyValue(i);
            Second.secondfactor.multiplyValue(i);
          }
        }
      }
      Logcal.append("which causes either First " + First + " or Second " + Second + " to be altered");
    } else {
      Logcal.append("CONDITION FALSE " + firstvalue + " % " + smaller + " === 0 && " + secondvalue + " % " + smaller + " === 0");
      Logcal.append("neither of denominators are factors of the other one");
      // so they are multiplied by each other"s denominator
      First.firstfactor.value *= secondvalue;
      First.secondfactor.value *= secondvalue;
      Second.firstfactor.value *= firstvalue;
      Second.secondfactor.value *= firstvalue;
    }
    Logcal.end("FROM equalDenominators: First " + First + " Second " + Second);
    return true;
  }

  this.divideBracketedAndBracketed = function(Numerator, Denominator) {
    throw ("divide brack and brack");
    if (Numerator.content.length === 1 && Denominator.content.length === 1) {
      var functionname = "divide" + Numerator.content[0].type + "And" + Denominator.content[0].type;
      this[functionname](Numerator.content[0], Denominator.content[0]);
      this.replaceSingleComponentWithComponent(Numerator.content[0]);
    } else {
      throw ("unsupported division of bracketed and bracketed with more than 1 components inside");
    }
  }

  this.divideBracketedAndOperation = function(Numerator, Denominator) {
    throw ("unsupported divide bracketed and operation");
  }

  this.divideBracketedAndTerm = function(Numerator, Denominator) {
    //        throw("divide brack and term");
    Logcal.start("divideBracketedAndTerm: Numerator " + Numerator + " Denominator " + Denominator);
    //        if (this.options["reduceFractions"]) {
    for (var i = 0; i < Numerator.content.length; i++) {
      this["divide" + Numerator.content[i].type + "AndTerm"](Numerator.content[i], Denominator);
    }
    //        } else {
    //            var result = [];
    //            for (var i = 0; i < Numerator.content.length; i++) {
    //                result.push(new MathOperation(Numerator.content[i], "/", Denominator));
    //            }
    //            Numerator.content = result;
    //        }
    Logcal.end("FROM divideBracketedAndTerm: Numerator " + Numerator + " Denominator " + Denominator);
  }

  this.divideOperationAndBracketed = function(Numerator, Denominator) {
    throw ("unsupported divide operation and bracketed");
  }

  this.divideOperationAndOperation = function(Numerator, Denominator) {
    //        if (!this.options["reduceOptions"]) {
    //            if (Operation.firstfactor.isfraction && Operation.secondfactor.isfraction) {
    //                // (5/2)/(3/2) >> (5/2)*(2/3)
    //                Logcal.start("swapping fractions: Location " + Location + " Operation " + Operation);
    //                Logger.newLatex("Turning division to multiplication " + Operation + " and swapping " + Operation.secondfactor);
    //                Operation.operation = "*";
    //                Operation.secondfactor.swapFactors();
    //                CalculatorUtil.roundCanceled = true;
    //    //                Operation.order++;
    //                Logcal.end("FROM swapping fractions: Location " + Location + " Operation " + Operation);
    //            } else {
    //                throw("only division between two fractions supported");
    //            }
    //        }
    throw ("unsupported divide operation and operation");
    // only division between two fractions supported
    if (Numerator.isFraction() && Denominator.isFraction()) {
      // (5/2)/(3/2) >> (5/2)*(2/3)
      // swapping...

    } else {
      throw ("only division between two fractions supported");
      return false;
    }


    if (!this.divided && (Multiplier.isBracketed() || Multiplier.isTerm())) {
      return this.secondfactor.divide(Multiplier);
    }
    if (this.divided && (Multiplier.isBracketed() || Multiplier.isTerm())) {
      return this.firstfactor.divide(Multiplier);
    }
    return false;
  }

  // 1/6/6
  this.divideOperationAndTerm = function(Numerator, Denominator) {
    throw ("divide op and term");
    //        throw("unsupported divide operation and term");
    if (Numerator.isFraction) {
      var fname = "multiply" + Numerator.secondfactor.type + "AndTerm";
      this[fname](Numerator.secondfactor, Denominator);
      this.replaceSingleComponentWithComponent(Numerator);
    } else {
      // näyttää vähän tyhmältä jakaa ensin ja sitten kertaa
      // parempi jos jättää jakamatta ja kertoo eka
      var fname = "divide" + Numerator.secondfactor.type + "AndTerm";
      this[fname](Numerator.secondfactor, Denominator);
      this.replaceSingleComponentWithComponent(Numerator);
    }
    return;
    if (!this.divided && (Multiplier.isBracketed() || Multiplier.isTerm())) {
      return this.secondfactor.divide(Multiplier);
    }
    if (this.divided && (Multiplier.isBracketed() || Multiplier.isTerm())) {
      return this.firstfactor.divide(Multiplier);
    }
    return false;
  }

  this.divideTermAndBracketed = function(Numerator, Denominator) {
    throw ("divide term and brack");
    if (Denominator.content.length === 1) {
      var functionname = "divideTermAnd" + Denominator.content[0].type;
      this[functionname](Numerator, Denominator.content[0]);
      this.replaceSingleComponentWithComponent(Numerator);
    } else {
      throw ("unsupported division of term with bracketed consisting more than 1 element");
    }
  };

  this.divideTermAndOperation = function(Numerator, Denominator) {
    throw ("unsupported division of term with operation");
  };

  this.divideTermAndTerm = function(Numerator, Denominator) {
    //        throw("divide term and term");
    Logcal.append("divideTermAndTerm: Numerator " + Numerator + " Denominator " + Denominator);
    Logger.newLatex("Dividing " + Numerator + " and " + Denominator);
    Numerator.divideValue(Denominator.value);
    Numerator.checkSign();
    if (Numerator.variable || Denominator.variable) {
      CalculatorUtil.subtractTermVariables(Numerator, Denominator, false);
    }
  };

  this.checkAndConvertIfExponents = function(Location, Operation) {
    Logcal.start("checkAndConvertIfExponents: Location " + Location + " Operation " + Operation);
    if (Operation.firstfactor.exponent && Operation.secondfactor.exponent) {
      if (CalculatorUtil.areComponentsBasesEqual(Operation.firstfactor, Operation.secondfactor)) {
        //console.log("the base is the same!");
        // maybe check if you can derive the base too?
        Logger.newLatex("Adding " + Operation.secondfactor.exponent + " to the exponent of " + Operation.firstfactor);
        var addorsubstract = Operation.operation !== "/";
        CalculatorUtil.addOrSubstractExponents(Operation.firstfactor, Operation.secondfactor, addorsubstract);
        CalculatorUtil.replaceSingleComponentWithComponent(Location, Operation, Operation.firstfactor);
        Logcal.end("checkAndConvertIfExponents: Location " + Location + " Operation " + Operation + " RETURN false");
        return true;
      }
    }
    // or exponent is variable?? how about that
    // !Operation.firsfactor.exponent.variable
    if (Operation.firstfactor.exponent && (!Operation.firstfactor.isTerm() || !Operation.firstfactor.variable)) {
      CalculatorExponent.calculate(Operation, Operation.firstfactor);
    }
    if (Operation.secondfactor.exponent && (!Operation.secondfactor.isTerm() || !Operation.secondfactor.variable)) {
      CalculatorExponent.calculate(Operation, Operation.secondfactor);
    }
    Logcal.end("FROM checkAndConvertIfExponents: Location " + Location + " Operation " + Operation + " RETURN false");
    return false;
  }
});
