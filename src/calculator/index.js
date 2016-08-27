import Basic from "./arithmetic/Basic";
import Exponent from "./arithmetic/Exponent";
import Probability from "./special/Probability";

import Utility from "./utility/Utility";
import Converter from "./utility/Converter";

import Orderer from "./utility/Orderer";

export default class Calculator {
  constructor() {
  }

  // would be easier if I kept count of what was left in equation
  sumAllAndSeeIfOnlyTermsLeft(equation) {
    // check if some neat reducable thing? 1/(x+1)=something
    if (equation.leftside.length !== 0) {
      for(var i in equation.rightside) {
        equation.rightside[i].switchSign();
      }
    }
    Array.prototype.push.apply(equation.leftside, equation.rightside);
    equation.rightside = [];
    // HOT FIX: checks if all mathobjects left are terms to not to throw
    // stupid errors
    for (var mo = 0; mo < equation.leftside.length; mo++) {
      if (equation.leftside[mo].type !== "Term") {
        return false;
      }
    }
    Basic.calculate(equation, equation);
    if (equation.leftside.length>1) {
      var allterms = true;
      for(var i in equation.leftside.length) {
        if (equation.leftside[i].type!=="Term") {
          allterms = false;
        }
      }
      // what if probability?
      return allterms;
    }
    return true;
  };

  reduceEquation(equation) {
    Logcal.timerStart("reduceEquation");
    Logcal.append("CalculatorMain reduceEquation: equation " + equation);
    Logger.setEquation(equation);
    // console.log("before", Orderer.orderobj);
    Orderer.setEquationOrder(equation);
    
    // console.log("orders are " + Orderer.orders);
    // console.log("orderobj", Orderer.orderobj);
    
    //Logger.createLatex("Orders", equation.toOrder());
    while(Orderer.orders.length>0) {
      var currentorder = Orderer.orders.splice(0, 1)[0];
    // console.log("orders are " + Orderer.orders);
      // console.log("currentorder " + currentorder);
      Orderer.locked = [];
      for (var i = 0; i < equation.leftside.length; i++) {
        this.findComponentsToBeReduced(equation, equation.leftside[i], currentorder);
      }
      for (var i = 0; i < equation.rightside.length; i++) {
        this.findComponentsToBeReduced(equation, equation.rightside[i], currentorder);
      }
    }
    //console.log("order " + JSON.stringify(CalculatorUtil.orderobj));
    Logcal.timerEnd("reduceEquation");
    return this.sumAllAndSeeIfOnlyTermsLeft(equation);
  };

  // this.reduceSideUsingCalculator = function (side, Order) {
    // for (var i = 0; i < side.length; i++) {
      // //console.log("this i " + i  + " and side length " + side.length);
      // this.findComponentsToBeReduced(side, side[i], Order);
    // }
  // };


  /**
   * The bread and butter of this whole mess. Searches for the
   * next MathObject to be reduced recursively using modified
   * DFS. When the next in Order is found depending on its type
   * it is calculated by one of the calculators.
   *
   * @param {MathObject} previous - Previous node in the tree
   * @param {MathObject} current - Current node in the tree
   * @param {Number} order - Current order to be reduced
   */
  findComponentsToBeReduced(Previous, Current, Order) {
  if (Current.order > Order) {
    return;
  } else if (Current.order === Order && Orderer.locked.indexOf(Previous.id) === -1 && 
    Orderer.locked.indexOf(Current.id) === -1) {
      if (Current.type === "Probability") {
        Probability.calculate(Previous, Current);
      } else if (Current.type === "Sum") {
        // CalculatorInductor.calculate(Previous, Current);
      } else if (Current.type === "Binomial" || Current.type === "Factorial") {
        Converter.calculate(Previous, Current);
      } else if (Current.type !== "Term") {
        // check if convertable??
        Basic.calculate(Previous, Current);
      } else {
        Current.order--;
      }
    } else if (Current.exponent) {
      if (Current.exponent.order === Order) {
        // reduces the exponent i.e. 5^1/3
        this.findComponentsToBeReduced(Current, Current.exponent, Order);
        // then if exponent is still next in order and not just converted
        // i.e. not 5^2! which is now 5^2*1
        if (Orderer.locked.indexOf(Current.exponent)===-1) {
          Exponent.calculate(Previous, Current);
        }
      } else {
        this.findComponentsToBeReduced(Current, Current.exponent, Order);
      }
    } else if (Current.type === "Operation") {
      this.findComponentsToBeReduced(Current, Current.firstfactor, Order);
      this.findComponentsToBeReduced(Current, Current.secondfactor, Order);
    } else if (Current.type === "Bracketed" || Current.type === "MathArray") {
      for (var i = 0; i < Current.content.length; i++) {
        this.findComponentsToBeReduced(Current, Current.content[i], Order);
      }
    } else if (Current.type === "Factorial") {
      this.findComponentsToBeReduced(Current, Current.component, Order);
    }
    // } else if (Current.type === "Equation") {
      // for (var i = 0; i < Current.leftside.length; i++) {
        // this.findComponentsToBeReduced(Current, Current.leftside[i], Order);
      // }
      // for (var i = 0; i < Current.rightside.length; i++) {
        // this.findComponentsToBeReduced(Current, Current.rightside[i], Order);
      // }
    // }
  }
}