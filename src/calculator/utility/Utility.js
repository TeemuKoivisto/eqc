import Logger from "../../utility_services/Logger";
import Logmon from "../../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");
import Orderer from "../../utility_services/Orderer";

import Calculator from "../Calculator";

class Utility extends Calculator {

  constructor() {
    super("Utility");
  }

  replaceVariableWithSomething(Equation) {
    var replacing = [];
    replacing.push(new MathTerm('n', 1, 0, 0));
    replacing.push(new MathTerm('n', 1, 1, 0));
    this.replaceEquationVariableWithList(Equation, 'n', replacing);
  };

  // TODO
  replaceVariable(Term, Variable, MathObjectList) {
    Logcal.start("replaceVariable: Term " + Term + " Variable " + Variable + " MathObjectList " + MathObjectList);
    var resultlist = [];
    throw('doesnt work');
    if (Term.variable === Variable && Term.variablevalue !== 0) {
      if (MathObjectList.length > 1) {
        // 3n replace with n+1 -> 3*n + 3*1
        for (var i = 0; i < MathObjectList.length; i++) {
          var listofone = [];
          listofone.push(MathObjectList[i]);
          var copyofthis = jQuery.extend(true, {}, Term);
          var resultofcopy = this.replaceVariable(copyofthis, Variable, listofone);
          // tuleeko ulos aina yksi termi? push apply ei jostain syystä toimi
//          result.push.apply(resultofcopy);
          resultlist.push(resultofcopy[0]);
//          console.log("looping and result is " + resultlist);
        }
      } else {
        var first = MathObjectList[0];
        // 3n^2 replace with 5n -> 3 * (5n * 5n)
        // 3n^2 replace with 5 -> 3 * (5 * 5)
        // vai kenties vain fucking 3n^2 -> 3*(5n)^2
        // ja sitten asetetaan order ja supistellaan
        var result = jQuery.extend(true, {}, first);
//        console.log("result was " + result);
        for (var i = 1; i < Term.variablevalue; i++) {
          var fname = "multiply" + result.type + "And" + first.type;
          this[fname](result, first);
        }
        // CalculatorBasic["multiply... ?
        this["multiply" + result.type + "AndTerm"](result, new MathTerm('', Term.value, 0, 0));
//        console.log("result after multiplication " + result);
        Term.value = result.value;
        Term.variablevalue = result.variablevalue;
        // push result?
        resultlist.push(Term);
      }
    }
    Logcal.end("FROM replaceVariable: Term " + Term + " Variable " + Variable + " MathObjectList " + MathObjectList + " RETURN resultlist " + resultlist);
    return resultlist;
  }

  findAndReplaceVariable(Previous, Current, Variable, ReplacingList) {
    Logcal.append("findAndReplaceVariable: Previous " + Previous + " Current " + Current + " Variable " + Variable + " ReplacingList " + ReplacingList);
    if (Object.prototype.toString.call(Current) === '[object Array]') {
      for (var i = 0; i < Current.length; i++) {
        this.findAndReplaceVariable(Current, Current[i], Variable, ReplacingList);
      }
    } else if (Current.isTerm() && Current.includesVariable(Variable)) {
      var list = this.replaceVariable(Current, Variable, ReplacingList);
//      console.log("list was " + list);
      var newcomponent = list.length === 1 ? list[0] : new MathBracketed(list);
//      console.log("current is term so in " + Previous + " is " + Current + " replaced with " + newcomponent)
      this.replaceSingleComponentWithComponent(Previous, Current, newcomponent);
    } else if (Current.isOperation() && Current.includesVariable(Variable)) {
      this.findAndReplaceVariable(Current, Current.firstfactor, Variable, ReplacingList);
      this.findAndReplaceVariable(Current, Current.secondfactor, Variable, ReplacingList);
    } else if (Current.isBracketed() && Current.includesVariable(Variable)) {
      for (var i = 0; i < Current.content.length; i++) {
        this.findAndReplaceVariable(Current, Current.content[i], Variable, ReplacingList);
      }
    } else {
      return;
    }
  }
//
//  this.replaceComponentVariableWithList (Location, Component, Variable, ReplacingList) {
//    Logcal.append("findAndReplaceVariable: Previous " + Location + " Current " + Component + " Variable " + Variable + " ReplacingList " + ReplacingList);
//    if (Object.prototype.toString.call(Component) === '[object Array]') {
//      for (var i = 0; i < Component.length; i++) {
//        this.findAndReplaceVariable(Component, Component[i], Variable, ReplacingList);
//      }
//    } else if (Component.isTerm() && Component.includesVariable(Variable)) {
//      var list = this.replaceVariable(Component, Variable, ReplacingList);
////      console.log("list was " + list);
//      var newcomponent = list.length === 1 ? list[0] : new MathBracketed(list);
////      console.log("current is term so in " + Previous + " is " + Current + " replaced with " + newcomponent)
//      this.replaceSingleComponentWithComponent(Location, Component, newcomponent);
//    } else if (Component.isOperation() && Component.includesVariable(Variable)) {
//      this.findAndReplaceVariable(Component, Component.firstfactor, Variable, ReplacingList);
//      this.findAndReplaceVariable(Component, Component.secondfactor, Variable, ReplacingList);
//    } else if (Component.isBracketed() && Component.includesVariable(Variable)) {
//      for (var i = 0; i < Component.content.length; i++) {
//        this.findAndReplaceVariable(Component, Component.content[i], Variable, ReplacingList);
//      }
//    } else {
//      return;
//    }
//  }

  replaceEquationVariableWithList(Equation, Variable, ReplacingList) {
    Logcal.append("replaceEquationVariableWithList: Equation " + Equation + " Variable " + Variable + " ReplacingList " + ReplacingList);
    for (var i = 0; i < Equation.leftside.length; i++) {
      this.findAndReplaceVariable(Equation.leftside, Equation.leftside[i], Variable, ReplacingList);
    }
    for (var i = 0; i < Equation.rightside.length; i++) {
      this.findAndReplaceVariable(Equation.rightside, Equation.rightside[i], Variable, ReplacingList);
    }
  }

  replaceExponentWithComponent(Location, Old, NewOne) {
    Location.exponent = NewOne; // ??????
  }

  // replaces single component with another component
  replaceSingleComponentWithComponent(Location, Old, NewOne) {
    Logcal.append("replaceSingleComponentWithComponent: Location " + Location + " Old " + Old + " NewOne " + NewOne);
    //NewOne.exponent = Old.exponent;
    if (Object.prototype.toString.call(Location) === '[object Array]') {
      this.replaceInsideListWithComponent(Location, Old, NewOne);
    } else if (Location.type === 'Equation') {
      // console.log('yo list', Location);
      this.replaceInsideListWithComponent(Location.leftside, Old, NewOne);
      this.replaceInsideListWithComponent(Location.rightside, Old, NewOne);
    } else if (Location.exponent && Location.exponent.id === Old.id) {
      Location.exponent = NewOne;
    } else if (Location.isBracketed()) {
      this.replaceInsideListWithComponent(Location.content, Old, NewOne);
    } else if (Location.isOperation()) {
      if (Location.firstfactor.id === Old.id) {
        Location.firstfactor = NewOne;
      } else {
        Location.secondfactor = NewOne;
      }
    } else if (Location.isTerm()) {
      throw("fix this replacing shit");
      // does this even work..? Location can never be changed without knowing its parent Location
      Location = NewOne;
    } else if (Location.type === "Binomial") {
      if (Location.upper.id === Old.id) {
        Location.upper = NewOne;
      } else {
        Location.lower = NewOne;
      }
    } else if (Location.type === 'Factorial') {
      if (Old.isBracketed() && NewOne.isTerm() && NewOne.getValue() < 0) {
        Logger.newLatex('Negative factorial $ ' + Location.toLatex() + '$, unable to calculate');
        throw('negative Factorial');
      } else {
        Location.component = NewOne;
      }
    } else {
      throw("wtf was Location in replaceSingleComponentWithComponent??" + Location);
    }
    Orderer.setOrder(Location, Old.order, NewOne);
    Orderer.unregisterComponent(Old.type, Old.id);
  }

  // replaces old component with new list of components that are added invidually or as bracketed
  replaceSingleComponentWithList(Location, Old, NewList) {
    Logcal.append("replaceSingleComponentWithList: Location " + Location + " " + Old + " " + NewList);
//    if (options["showBracketsAfterReducingIntoOneTerm"]) {
    var newbracketed = new MathBracketed(NewList);

  if (Object.prototype.toString.call(Location) === '[object Array]') {
      this.replaceInsideListWithList(Location, Old, NewList);
    } else if (Location.type === 'Equation') {
      // console.log('yo list', Location);
      this.replaceInsideListWithList(Location.leftside, Old, NewList);
      this.replaceInsideListWithList(Location.rightside, Old, NewList);
  } else if (Old.type === 'Term' || Old.type === 'Probability') {
    // needs this first condition if bracketed is created out of single component
    // 1/P(A') = 1/(1-P(A)) > bracketed is never ordered without this
    // maybe it needs to be extended to operations, factorials? idk
    this.replaceSingleComponentWithComponent(Location, Old, newbracketed);
    return;
    } else if (Location.exponent && Location.exponent.id === Old.id) {
      Location.exponent = newbracketed;
    } else if (Location.isBracketed()) {
      this.replaceInsideListWithList(Location.content, Old, NewList);
    } else if (Location.isOperation()) {
      if (Location.firstfactor.id === Old.id) {
        Location.firstfactor = newbracketed;
      } else {
        Location.secondfactor = newbracketed;
      }
    } else if (Location.isTerm()) {
      throw("fix this replace single com with list");
      Location = newbracketed;
    } else if (Location.type === "Binomial") {
      if (Location.upper.id === Old.id) {
        Location.upper = newbracketed;
      } else {
        Location.secondfactor = newbracketed;
      }
    } else if (Location.type === 'Factorial') {
      Location.component = newbracketed;
    } else {
      throw("wtf was Location in replaceSingleComponentWithList??" + Location);
    }
    Orderer.setOrder(Location, Old.order, NewList);
    Orderer.unregisterComponent(Old.type, Old.id);
  }

  replaceInsideListWithComponent(List, Old, NewOne) {
    Logcal.start("replaceInsideListWithComponent: List " + List + " Old " + Old + " NewOne " + NewOne);
    for (var i = 0; i < List.length; i++) {
      if (List[i].id === Old.id) {
        List.splice(i, 1, NewOne);
      }
    }
    Logcal.end("FROM replaceInsideListWithComponent: List " + List + " Old " + Old + " NewOne " + NewOne);
  }

  replaceInsideListWithList(List, Old, NewList) {
    Logcal.start("replaceInsideListWithList: List " + List + " Old " + Old + " NewList " + NewList);
    for (var i = 0; i < List.length; i++) {
      if (List[i].id === Old.id) {
        List.splice(i, 1, NewList[0]);
        for (var j = 1; j < NewList.length; j++) {
          List.splice((i + j), 0, NewList[j]);
        }
        Logcal.end("FROM replaceInsideListWithList: List " + List + " Old " + Old + " NewList " + NewList);
        return;
      }
    }
    Logcal.end("FROM replaceInsideListWithList: List " + List + " Old " + Old + " NewList " + NewList);
    // throw("what is life replaceInsideListWithList");
  }

  arrayToLatex(array) {
    var latex = "";
    for (var i = 0; i < array.length; i++) {
      if (array[i].minussign) {
        latex += array[i].toLatex();
      } else {
        if (i !== 0) {
          latex += "+";
        }
        latex += array[i].toLatex();
      }
    }
    return latex;
  }
  
  areArraysEqual(First, Second) {
    var takenFirst = [],
      takenSecond = [];
      
    if (First.length !== Second.length) return false;
    
    for(var i = 0; i < First.length; i++) {
      var round = false;
      for(var j = 0; j < Second.length; j++) {
        if (First[i].isEqual(Second[i]) && takenFirst.indexOf(i)===-1 && takenSecond.indexOf(j)===-1) {
          takenFirst.push(i);
          takenSecond.push(j);
          round = true;
        }
      }
      if (!round) return false;
    }
    return true;
  }
  
  areComponentsBasesEqual(FirstC, SecondC) {
    if (FirstC.isTerm() && SecondC.isTerm()) {
      return FirstC.getValue() === SecondC.getValue() && FirstC.variable === SecondC.variable;
    } else {
      throw("not done yet components equal stuff");
    }
  }

  areExponentsEqual(FirstC, SecondC) {
    if (!FirstC.exponent && !SecondC.exponent) {
      return true;
    } else if (FirstC.exponent && SecondC.exponent) {
      return FirstC.exponent.isEqual(SecondC.exponent);
    }
    return false;
  }

  convertExponentsForOperation(Operation) {
    console.log("CONVERTING YO");
    //Logcal.start("convertExponentsForOperation: Operation " + Operation);
    if (Operation.firstfactor.exponent && Operation.firstfactor.exponent.isEqual(Operation.secondfactor.exponent)) {
      // cancels each other's out?
      Logger.newLatex("Exponents inside " + Operation + " cancel each other");
      Operation.firstfactor.exponent = "";
      Operation.secondfactor.exponent = "";
      return true;
    //} else {
    //
    }
  }

  addTermVariables(FirstC, SecondC, type) {
    Logcal.start("addOrSubstractVariables: FirstC " + FirstC + " SecondC " + SecondC + " type " + type);
    // maybe here check for combos of all the different variables
    if (FirstC.variable && FirstC.variable === SecondC.variable) {
      if (FirstC.exponent && SecondC.exponent) {
        FirstC.exponent = new MathBracketed([FirstC.exponent, SecondC.exponent], "");
      } else if (FirstC.exponent || SecondC.exponent) {
        if (SecondC.exponent) {
          FirstC.exponent = SecondC.exponent;
        }
      } else {
        FirstC.exponent = new MathTerm("", 2, "");
      }
    } else if (!FirstC.variable && SecondC.variable) {
      FirstC.variable += SecondC.variable;
      if (FirstC.exponent && SecondC.exponent) {
        throw("dis should not be possible in add variables");
        FirstC.exponent = new MathBracketed([FirstC.exponent, SecondC.exponent], "");
      } else if (FirstC.exponent || SecondC.exponent) {
        if (SecondC.exponent) {
          FirstC.exponent = SecondC.exponent;
        }
      }
    } else if (SecondC.variable && FirstC.variable && FirstC.variable !== SecondC.variable) {
      throw("too many variables. help");
    }
    Logcal.end("FROM addOrSubstractVariables: FirstC " + FirstC + " SecondC " + SecondC + " type " + type);
  }

  subtractTermVariables(FirstC, SecondC, type) {
    Logcal.start("subtractTermVariables: FirstC " + FirstC + " SecondC " + SecondC + " type " + type);
    // maybe here check for combos of all the different variables
    if (FirstC.variable && FirstC.variable === SecondC.variable) {
      if (FirstC.exponent && SecondC.exponent) {
        SecondC.exponent.switchSign();
        FirstC.exponent = new MathBracketed([FirstC.exponent, SecondC.exponent], "");
      } else if (FirstC.exponent || SecondC.exponent) {
        if (SecondC.exponent) {
          SecondC.exponent.switchSign();
          FirstC.exponent = new MathBracketed([new MathTerm("", 1, ""), SecondC.exponent], "");
        }
      } else {
        FirstC.variable = "";
      }
    } else if (!FirstC.variable && SecondC.variable) {
      FirstC.variable += SecondC.variable;
      if (FirstC.exponent) {
        throw("dis should not be possible as the constant should have been reduced");
        FirstC.exponent = new MathBracketed([FirstC.exponent, SecondC.exponent], "");
      } else if (SecondC.exponent) {
        SecondC.exponent.switchSign();
        if (SecondC.exponent.isTerm() && SecondC.exponent.getValue() === 1) {
          FirstC.exponent = "";
        } else {
          FirstC.exponent = SecondC.exponent;
        }
      } else if (!SecondC.exponent) {
        FirstC.exponent = new MathTerm("", -1, "");
      }
    } else if (FirstC.variable !== SecondC.variable) {
      throw("too many variables. help");
    }
    Logcal.end("FROM subtractTermVariables: FirstC " + FirstC + " SecondC " + SecondC + " type " + type);
  }

  addOrSubstractExponents(FirstC, SecondC, type) {
    Logcal.start("addOrSubstractExponents: FirstC " + FirstC + " SecondC " + SecondC + " type " + type);
    if (FirstC.exponent && SecondC.exponent) {
      if (FirstC.exponent.isTerm() && SecondC.exponent.isTerm()) {
        this.modifyTermExponents(FirstC, SecondC, type);
        Logcal.end("FROM addOrSubstractExponents: FirstC " + FirstC + " SecondC " + SecondC + " type " + type);
        return true;
      }
    }
    if (FirstC.exponent || SecondC.exponent) {
      var exponents = [];
      var defaulttermlist = [];
      if (FirstC.exponent) {
        exponents.push.apply(exponents, FirstC.exponent.returnContentList());
        // needs to add 1 because no exponent is still x^1
        // OR IS IT???
        //} else {
        //  defaulttermlist.push(new MathTerm("", 1, ""));
      }
      if (SecondC.exponent) {
        SecondC.exponent.switchSign();
        exponents.push.apply(exponents, SecondC.exponent.returnContentList());
        //} else {
        //  defaulttermlist.push(new MathTerm("", 1, ""));
      }
      if (exponents.length>1) {
        exponents = new MathBracketed(exponents, "");
      } else {
        exponents = exponents[0];
      }
      FirstC.exponent = exponents;
      Orderer.repeatRound = true; // why?
    } else {
      // no exponents so nothing to do?
    }
    Logcal.end("FROM addOrSubstractExponents: FirstC " + FirstC + " SecondC " + SecondC + " type " + type);
  }

  modifyTermExponents(FirstC, SecondC, increase) {
    if (increase) {
      FirstC.exponent.plusValue(SecondC.exponent.value);
    } else {
      FirstC.exponent.minusValue(SecondC.exponent.value);
    }
    if (FirstC.exponent.getValue() === 0) {
      FirstC.exponent = "";
      FirstC.setValue(1); // if zero exponent means the term value is zero
      // dunno will it show, maybe needs newLatex
    }
  }

  cloneTerm(Term) {
    var term = new MathTerm(Term.variable, Term.value, Term.exponent);
    term.order = Term.order;
    return term;
  }

  cloneProbabilityWithoutExponent(Probability) {
    var newcontent = [];
    for(var index in Probability.content) {
      if (Probability.content[index].isTerm()) {
      newcontent.push(this.cloneTerm(Probability.content[index]));
      } else if (Probability.content[index].type==="Symbol") {
      newcontent.push(Probability.content[index]);
      } else {
      throw("not supported yet in cloning probability");
      }
    }
    var prob = new MathProbability(newcontent);
    prob.minusign = Probability.minussign;
    prob.order = Probability.order;
    return prob;
  }
}

export default new Utility();