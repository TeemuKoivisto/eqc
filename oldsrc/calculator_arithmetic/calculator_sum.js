Calculator.service("CalculatorSum", function(CalculatorUtil, MathTerm, MathOperation, MathBracketed, Orderer, Logger) {
  this.options = {
    "showBracketsAfterReducingIntoOneTerm": false,
    "reduceFractions": true,
    "showSignOperations": false // >> +(-3) > -3 -(-3) > 3
  }

  //// equation ei ole mathobject
  //// eikä equationin puolikas todellakaan myöskään
  //this.calculate = function (Location, MathObject) {
  //    //console.log("order is " + (Orderer.orders[0]+1) + " and this object " + MathObject.order );
  //    Logger.clog("BASIC calculate: Location " + Location + " MathObject " + MathObject);
  //
  //    var locationname = Object.prototype.toString.call(Location) === "[object Array]" ? "Equation" : Location.type;
  //
  //    if (MathObject.type !== "Operation") {
  //        if (MathObject.type === "Bracketed") {
  //            this.sumList(MathObject.content);
  //            // tässä joku checkki jos tulos on 1 size bracketed niin sievennys
  //            if (MathObject.content.length === 1) {
  //                if (MathObject.minussign) {
  //                    MathObject.content[0].switchSign();
  //                }
  //                MathObject.content[0].exponent = MathObject.exponent;
  //                CalculatorUtil.replaceSingleComponentWithComponent(Location, MathObject, MathObject.content[0]);
  //            } else if (Location.type === "Bracketed" || locationname === "Equation") {
  //                Logger.clogAppend("CONDITION TRUE " + Location.type + " === Bracketed || " + locationname + " === Equation");
  //                if (MathObject.minussign) {
  //                    for (var i = 0; i < MathObject.content.length; i++) {
  //                        MathObject.content[i].switchSign();
  //                    }
  //                }
  //                CalculatorUtil.replaceSingleComponentWithList(Location, MathObject, MathObject.content);
  //            }
  //        } else if (MathObject.type === "Equation") {
  //            this.sumList(MathObject.leftside);
  //            this.sumList(MathObject.rightside);
  //        } else if (MathObject.type === "Term") {
  //            // nothing to do???
  //        } else {
  //            throw("calculate: unsupported sum-operation " + JSON.stringify(Location) + " and " + JSON.stringify(MathObject));
  //        }
  //    } else if (MathObject.operation === "/") {
  //        this.divideAndReplace(Location, MathObject);
  //    } else if (MathObject.operation === "*") {
  //        this.multiplyAndReplace(Location, MathObject);
  //    } else {
  //        throw("what is this operation shit?");
  //    }
  //}


  // only this is used for CalculatorExponent...
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
    //                if (termToBeAdded.exponent === this.exponent && termToBeAdded.variable === this.variable) {
    if (CalculatorUtil.areExponentsEqual(Augent, Addend) && Addend.variable === Augent.variable) {
      //        if (Addend.variablevalue === Augent.variablevalue && Addend.variable === Augent.variable) {
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
});
