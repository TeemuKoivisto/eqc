import Logger from "../../utility_services/Logger";
import Logmon from "../../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");
import Orderer from "../../utility_services/Orderer";

import MathOperations from "../../utility_services/MathOperations";

import Basic from "../arithmetic/Basic";
import Utility from "../utility/Utility";

import Calculator from "../Calculator";

import MathTerm from "../../math-components/basic/MathTerm";
import MathOperation from "../../math-components/basic/MathOperation";
import MathFactorial from "../../math-components/probability/MathFactorial";

class Converter extends Calculator {

  constructor() {
    super("Converter");
  }

  calculate(Location, MathObject) {
    //console.log("order is " + (Orderer.orders[0]+1) + " and this object " + MathObject.order );
    Logcal.start("CalculatorConverter calculate: Location " + Location + " MathObject " + MathObject);
    //var locationType = Object.prototype.toString.call(Location) === '[object Array]' ? "Equation" : Location.type;
    if (MathObject.type === "Binomial") {
      this.convertBinomialToFactorials(Location, MathObject);
    } else if (MathObject.type === "Factorial") {
      this.convertFactorialToValue(Location, MathObject);
    }
    Logcal.end("FROM CalculatorConverter calculate: Location " + Location + " MathObject " + MathObject);
  }

  // uses the formula n!/k!(n-k)!
  convertBinomialToFactorials(Location, Binomial) {
    Logcal.start("convertBinomialToFactorials: Location " + Location + " Binomial " + Binomial);
    if (!Binomial.upper.isType("Term")) {
      // use calculate or sumlist or just set brackets before binomials?
      Basic.calculate(Binomial, Binomial.upper);
    }
    if (!Binomial.lower.isType("Term")) {
      Basic.calculate(Binomial, Binomial.lower);
    }
    // console.log('', Binomial.parent)
    if (Binomial.upper.isType("Term") && Binomial.lower.isType("Term")) {
      // var uppervalue = Binomial.upper.getValue(),
        // lowervalue = Binomial.lower.getValue();
        
      // if (lowervalue === 0) {
        
      // }
      var upperfactorial = new MathFactorial(new MathTerm(Binomial.upper.variable, Binomial.upper.getValue(), Binomial.upper.exponent));
      var lowerhigherfactorial = new MathFactorial(new MathTerm(Binomial.lower.variable, Binomial.lower.getValue(), Binomial.lower.exponent));
      var lowersmallerfactorial = new MathFactorial(new MathTerm('', MathOperations.minusValue(Binomial.upper.value, Binomial.lower.value), ""));
      var loweroperation = new MathOperation(lowerhigherfactorial, '*', lowersmallerfactorial);
      var result = new MathOperation(upperfactorial, '/', loweroperation);
      // Logger.newLatex("Reducing binomial into factorials " + Binomial.toLatex());
      Logger.newLatexWithFormula("Reducing binomial $" + Binomial.toLatex() + '$ into factorials', 'Binomial', 0);
      Utility.replaceSingleComponentWithComponent(Location, Binomial, result);
      Orderer.availableConversions.push({ type: "BinomialToFactorial", id: upperfactorial.id }); // estää yksittäisten kertomien laskennan?
      Orderer.addUnderConversion([upperfactorial.id, lowerhigherfactorial.id, lowersmallerfactorial.id]);
      // vai muokkaa vain orderia että, operaatio on orderia isompi... yes...
      // result.order = Binomial.order ja jotain... pitää vielä olla koukku
    } else {
      throw("heh vituix meni binomin ratkasu");
    }
    Logcal.end("FROM convertBinomialToFactorials: Location " + Location + " Binomial " + Binomial);
  }

  // pitää olla myös valmis laskemaan kertomia ilman binomeja
  /**
   * Converts factorial to value i.e. 5!=5*4*3*2*1.
   * At the moment it seems that it converts only factorials inside fractions.
   * And especially if firstfactor is the factorial.
   * After converting locks the fraction from being calculated again as
   * it would be next in order.
   * @param {MathObject/Array} Location - Location of the factorial.
   * @param {MathObject} Factorial - Factorial to be converted.
   */
  convertFactorialToValue(Location, Factorial) {
    Logcal.start("convertFactorialToValue: Location " + Location + " Factorial " + Factorial);
    // checks if factorial converted by binomial to fraction
    if (Orderer.checkAndRemoveConversion('BinomialToFactorial', Factorial)) {
      var higher = Math.max(Location.secondfactor.secondfactor.component.getValue(), Location.secondfactor.firstfactor.component.getValue());
      var lower = Math.min(Location.secondfactor.secondfactor.component.getValue(), Location.secondfactor.firstfactor.component.getValue());
      if (Math.abs(higher-(higher-lower)) > 50) {
        throw("c'mon man. don't be silly");
      }
      if (lower === 0) {
        Logger.newLatexWithFormula("Converting factorials $" + Location.toLatex() + '$ to 0', 'Binomial rules', 1);
        Utility.replaceSingleComponentWithComponent(Location.parent, Location, new MathTerm('', 1, ''));
        Orderer.locked.push(Location.id);
      } else if (lower < 0 || lower > higher) {
        Logger.newLatexWithFormula("Converting factorials $" + Location.toLatex() + '$ to 0', 'Binomial rules', 0);
        Utility.replaceSingleComponentWithComponent(Location.parent, Location, new MathTerm('', 0, ''));
        Orderer.locked.push(Location.id);
      } else {
        var top = new MathTerm('', higher+1, '');
        var bottom = new MathTerm('', 1, '');
        for(var i = 2; i <= lower; i++) {
          var term = new MathTerm('', higher+i, '');
          top = new MathOperation(term, '*', top);
        }
        for(var i = 2; i <= lower; i++) {
          var term = new MathTerm('', i, '');
          bottom = new MathOperation(term, '*', bottom);
        }
        Logger.newLatex("Converting factorials $" + Location.toLatex() + '$ into multiplications');
        // console.log('factorial loc', Location)
        var newFraction = new MathOperation(top, '/', bottom);
        Utility.replaceSingleComponentWithComponent(Location.parent, Location, newFraction);
        // Orderer.setOrder(Location.parent, Location.order, newFraction);
        // Orderer.locked.push(newFraction.id);
        Orderer.locked.push(Location.id);
      }
    } else if (!Orderer.isUnderConversion(Factorial)) {
      var factorialValue = Factorial.component.getValue(),
        operation;
      if (factorialValue > 50) {
        throw('converter: factorial over 50'); 
      } else if (factorialValue > 1) {
        operation = new MathOperation(new MathTerm('', 1, ''), '*', new MathTerm('', 2, ''));
        for(var i = 3; i <= factorialValue; i++) {
          var term = new MathTerm('', i, '');
          operation = new MathOperation(operation, '*', term);
        }
      } else {
        operation = new MathTerm('', 1, '');
      }
      Logger.newLatex("Converting factorial $" + Factorial.toLatex() + '$ into multiplications');
      Utility.replaceSingleComponentWithComponent(Location, Factorial, operation);
      Orderer.locked.push(operation); // needed for exponents i.e. 2^5!
    }
    Logcal.end("FROM convertFactorialToValue: Location " + Location + " Factorial " + Factorial);
  }

  convertVariableToValue(Location, Component) {
    // TODO
  }
}

export default new Converter();