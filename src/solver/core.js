import Logger from "../utility_services/Logger";
import Logmon from "../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");
import Orderer from "../utility_services/Orderer";

import Utility from "../calculator/utility/Utility";

import Calculator from "../calculator/index";

import LatexParser from "../parsing/LatexParser";
const Parser = new LatexParser();

import MathSymbol from "../math-components/basic/MathSymbol";

class SolverCore {

  constructor() {
    this.possibleResults = {
      'unable': [{
        code: 'Calc error',
        message: 'Calculator produced an error: '
      }, {
        code: 'Unreduced eq',
        message: 'Equation wasn\'t reduced to terms'
      }, {
        code: 'Parser error'
      }, {
        code: 'No combo/term',
        message: 'Latex wasn\'t combination nor could it be reduced to terms'
      }, {
        code: 'Non term exp',
        message: 'there is some non terms as exponent'
      }, {
        code: 'Large exp',
        message: 'unsolvable equation as the first term is too high or smthing'
      }, {
        code: 'Quadratic fail',
        message: 'Unsolved as unable to put the equation into quadratic formula'
      }, {
        code: 'Many vars',
        message: 'Too many variables'
      }, {
        code: 'Many exps',
        message: 'Too many different exponents'
      }],
      'false': [{
        code: 'Consts not canceled',
        message: 'Constants don\'t cancel out'
      }],
      'true': [{
        code: 'Var solved',
        message: 'Variable has been solved'
      }, {
        code: 'Var zero',
        message: 'Variable equals zero'
      }, {
        code: 'Consts canceled',
        message: 'Constants cancel out'
      }],
      'rightCombination': [{
        code: 'Combo',
        message: 'Latex was one of given correct combinations'
      }],
      'checkMe': [{
        code: 'Pass',
        message: 'Latex wasn\'t combination but '
      }]
    };
  }

  findSolution(result, code) {
    if (typeof this.possibleResults[result] !== 'undefined') {
      for (var i = 0; i < this.possibleResults[result].length; i++) {
        if (this.possibleResults[result][i].code === code) {
          return this.possibleResults[result][i];
        }
      }
    }
    throw ('faulty solution result dawg ' + result);
  }
    // ehka palautus tyyppia pitäisi vähän miettiä..
    // {
    // result: true/false/impossible/unable/error/,
    // message: 'solution found/too many variables/input produced an error/internal error
    // equation: MathEquation,
    // variables: [
    // { key: 'x', value: MathObject } // vaikka 5/4 tai 5y tai 0 ja fysiikkaa varten yksiköt
    // ],
    // mathgayness: [
    // 'x < Z'
    // ]
    // }
  composeSolution(equation, result, code, solutionCore) {
    var foundSolution = this.findSolution(result, code);
    // console.log('foundSolution', foundSolution);
    var solution = {
        result: result,
        message: typeof foundSolution.message === 'undefined' ? '' : foundSolution.message,
        equation: '',
        variables: [],
        gaymath: []
      }
      // console.log('', solution)
    for (var property in solutionCore) {
      // console.log('prop', property)
      if (property === 'message') {
        solution.message += solutionCore[property];
      } else if (property === 'variables') {
        solution[property] = solutionCore[property];
      } else if (property === 'code' && code !== solutionCore.code) {
        var anotherSolution = this.findSolution(solutionCore.result, solutionCore.code);
        solution.message += anotherSolution.message;
      }
    }

    return solution;
  }

  solve(latex) {
    Logcal.append('CalculatorSolverLogic solve:');
    var eq = Parser.parseEquation(latex),
      reduced = false;

    if (Parser.status.length !== 0) {
      return this.composeSolution(eq, 'unable', 'Parser error', {
        message: Parser.status
      });
    }

    // try {
    reduced = Calculator.reduceEquation(eq);
    // } catch(e) {
    // return this.composeSolution(eq, 'unable', 'Calc error', { message: e });
    // }

    if (reduced) {
      var solutionCore = this.solveTermEquation(eq);
      return this.composeSolution(eq, solutionCore.result, solutionCore.code, solutionCore);
    } else {
      return this.composeSolution(eq, 'unable', 'Unreduced eq', {});
    }
  }

  /**
   * Solves latex and checks if it is one of combinations
   * Returns solution that is true if all is well, retarded if solutions
   * are equal but latex wasn't one of combinations and false if
   * none above.
   * @param {String} latex - Latex-equation from Solvearea
   * @param {Array<String>} combinations - Accepted combinations
   * @return {Object} solution - Solution object
   */
  solveWithCombinations(latex, combinations) {
    Logcal.append('CalculatorSolverLogic solveWithCombinations:');
    var eq = Parser.parseEquation(latex);

    if (Parser.status.length !== 0) {
      return this.composeSolution(eq, 'unable', 'Parser error', {
        message: Parser.status
      });
    }
    console.log('how are my combos ', combinations)
    for (var i = 0; i < combinations.length; i++) {
      // var left = eq.leftside;
      // var right = eq.rightside;
      // var combo = Parser.parseLatex(combinations[i]);
      var comboeq = Parser.parseEquation(combinations[i]);
      console.log('are stuff ' + eq.toLatex() + ' and ' + comboeq.toLatex() + ' equal?');
      // if (Utility.areArraysEqual(right, combo)) {
      // return this.composeSolution(eq, 'rightCombination', 'Combo', {});
      // }
      // TODO maybe rather use isEqual with equations
      if (Utility.areArraysEqual(eq.leftside, comboeq.leftside) && Utility.areArraysEqual(eq.rightside, comboeq.rightside)) {
        return this.composeSolution(eq, 'rightCombination', 'Combo', {});
      }
      // for same shit but reversed, is this necessary?
      if (Utility.areArraysEqual(eq.leftside, comboeq.rightside) && Utility.areArraysEqual(eq.rightside, comboeq.leftside)) {
        return this.composeSolution(eq, 'rightCombination', 'Combo', {});
      }
    }

    var reduced = false;
    // try {
    reduced = Calculator.reduceEquation(eq);
    // } catch(e) {
    // return this.composeSolution(eq, 'unable', 'Calc error', { message: e });
    // }

    if (reduced) {
      var solutionCore = this.solveTermEquation(eq);
      // if (solutionCore.result === 'true') {
      return this.composeSolution(eq, 'checkMe', 'Pass', solutionCore);
      // } else {
      // return this.composeSolution(eq, solutionCore.result, solutionCore.code, solutionCore);
      // }
    } else {
      return this.composeSolution(eq, 'unable', 'No combo/term', {});
    }
  }

  /**
   * Solves equation made of two terms with one variable
   * All the constants have been reduced so possible equations are:
   * x+1, x^3-324.09 etc.
   * @param {MathEquation} equation - Equation to be solved
   * @return {Object} solution - Returns object that has all the critical information for composeSolution
   */
  solveTwoTermEquation(equation) {
    Logcal.start("solveTwoTermEquation: equation " + equation);
    var exvalue = equation.leftside[0].getPossibleExponentValue(),
      solutionCore;

    if (exvalue === 9999) {
      solutionCore = {
        result: 'unable',
        code: 'Non term exp'
      };
      Logcal.end("FROM solveTwoTermEquation: RETURN solutionCore " + solutionCore);
      return solutionCore;
    } else if (exvalue > 0) {
      Utility.addOrSubstractExponents(equation.leftside[0], equation.leftside[1], true);
      Utility.addOrSubstractExponents(equation.leftside[1], equation.leftside[1], true);
    } else if (exvalue < 0) {
      Utility.addOrSubstractExponents(equation.leftside[0], equation.leftside[1], false);
      Utility.addOrSubstractExponents(equation.leftside[1], equation.leftside[1], false);
    }
    equation.leftside[1].divideValue(equation.leftside[0].value);
    equation.leftside[0].divideValue(equation.leftside[0].value);
    equation.leftside[1].switchSign();

    if (equation.leftside[0].getPossibleExponentValue() !== 1) {
      Logcal.append("taking root inside two term solve " + equation);
      var rootedconstant;
      if (equation.leftside[0].exponent.getValue() === 2) {
        rootedconstant = new MathSymbol("sqrt{" + equation.leftside[1].getValue() + "}");
      } else {
        rootedconstant = new MathSymbol("sqrt[" + equation.leftside[0].exponent.getValue + "]{" + equation.leftside[1].value + "}");
      }
      equation.leftside[1] = rootedconstant;
      equation.leftside[0].exponent = "";
      Logcal.append("which is now " + equation);
    }

    solutionCore = {
      result: 'true',
      code: 'Var solved',
      variables: [{
        key: equation.leftside[0].variable,
        solutions: ['' + equation.leftside[1].toLatex()]
      }]
    };

    Logcal.end("FROM solveTwoTermEquation: RETURN solutionCore " + solutionCore);
    return solutionCore;
  }

  /**
   * Solves equation made of three terms with one variable
   *
   * @param {MathEquation} equation - Equation to be solved
   * @return {Object} Returns object that has all the critical information for composeSolution
   */
  solveThreeTermEquation(equation) {
    Logcal.start("solveThreeTermEquation: equation " + equation);
    var solutionCore;

    if (equation.leftside[2].getPossibleExponentValue() < 0 && equation.leftside[2].variable.length !== 0) {
      Utility.addOrSubstractExponents(equation.leftside[0], equation.leftside[2], true);
      Utility.addOrSubstractExponents(equation.leftside[1], equation.leftside[2], true);
      Utility.addOrSubstractExponents(equation.leftside[2], equation.leftside[2], true);
    } else if (equation.leftside[2].getPossibleExponentValue() > 0 && equation.leftside[2].variable.length !== 0) {
      Utility.addOrSubstractExponents(equation.leftside[0], equation.leftside[2], false);
      Utility.addOrSubstractExponents(equation.leftside[1], equation.leftside[2], false);
      Utility.addOrSubstractExponents(equation.leftside[2], equation.leftside[2], false);
    }

    if (equation.leftside[0].getPossibleExponentValue() !== 2) {
      solutionCore = {
        result: 'unable',
        code: 'Large exp'
      };
      Logcal.end("FROM solveThreeTermEquation: equation " + equation + " RETURN solutionCore " + solutionCore);
      return solutionCore;
    }
    equation.leftside.sort(function(a, b) {
      return a.compareToTermExponents(a, b);
    });

    equation.leftside[2].divideValue(equation.leftside[0].value);
    equation.leftside[1].divideValue(equation.leftside[0].value);
    equation.leftside[0].divideValue(equation.leftside[0].value);

    if (equation.leftside[0].getPossibleExponentValue() === 2 && equation.leftside[1].getPossibleExponentValue() === 1 && equation.leftside[2].getPossibleExponentValue() === 1) {
      var solutions = this.solveUsingQuadraticFormula(equation.leftside[0].getValue(), equation.leftside[1].getValue(), equation.leftside[2].getValue());
      solutionCore = {
        result: 'true',
        code: 'Var solved',
        variables: [{
          key: equation.leftside[0].variable,
          solutions: solutions
        }]
      };
    } else {
      solutionCore = {
        result: 'unable',
        message: 'Quadratic fail'
      };
    }
    Logcal.end("FROM solveThreeTermEquation: equation " + equation + " RETURN solutionCore " + solutionCore);
    return solutionCore;
  }

  solveUsingQuadraticFormula(two, one, constant) {
    Logcal.start("solveUsingQuadraticFormula: two " + two + " one " + one + " constant " + constant);
    var determinant, root1, root2, possible = true;
    determinant = one * one - 4 * two * constant;
    if (determinant > 0) {
      root1 = (-one + Math.sqrt(determinant)) / (2 * two);
      root2 = (-one - Math.sqrt(determinant)) / (2 * two);
    } else if (determinant === 0) {
      root1 = root2 = -one / (2 * two);
    } else {
      root1 = -one / (2 * two);
      root2 = Math.sqrt(-determinant) / (2 * two);
      possible = false;
    }
    var solutions = [];
    if (possible) {
      solutions[0] = '' + root1;
      solutions[1] = '' + root2;
    } else {
      // turns the solutions into imaginary
      solutions[0] = root1 + "+" + root2 + "i";
      solutions[1] = root1 + "-" + root2 + "i";
    }
    Logcal.end("FROM solveUsingQuadraticFormula: two " + two + " one " + one + " constant " + constant + " RETURN solutions " + solutions);
    return solutions;
  }

  solveTermEquation(equation) {
    Logcal.append("solveTermEquation: equation " + equation);
    var variables = [];
    for (var term in equation.leftside) {
      var termvars = equation.leftside[term].getVariables();
      // console.log('got variables', termvars)
      for (var v in termvars) {
        if (variables.indexOf(termvars[v]) === -1) {
          variables.push(termvars[v]);
        }
      }
    }
    Logcal.append('How many variables? ' + variables);

    if (variables.length > 1) {
      // too many variables
      return {
        result: 'unable',
        code: 'Many vars'
      };
    }

    equation.leftside.sort(function(a, b) {
      return a.compareToTermExponents(a, b);
    });
    Logcal.append("sorted: equation " + equation);

    if (equation.leftside.length === 1) {
      var solutionCore = {};
      if (variables.length === 1) {
        solutionCore.result = 'true';
        solutionCore.code = 'Var zero';
        solutionCore.variables = [{
          key: equation.leftside[0].variable,
          solutions: ['0']
        }];
      } else if (variables.length === 0) {
        // wolframin mukaan tulos olisi false kun vakiot eivät kumoa toisiaan
        if (equation.leftside[0].getValue() === 0) {
          solutionCore.result = 'true',
            solutionCore.code = 'Consts canceled';
          solutionCore.variables = [{
            key: 'constant',
            solutions: ['0']
          }];
        } else {
          solutionCore.result = 'false',
            solutionCore.code = 'Consts not canceled';
          solutionCore.variables = [{
            key: 'constant',
            solutions: ['' + equation.leftside[0].getValue()]
          }];
        }
      }
      return solutionCore;
    } else if (equation.leftside.length === 2) {
      return this.solveTwoTermEquation(equation);
    } else if (equation.leftside.length === 3) {
      return this.solveThreeTermEquation(equation);
    } else {
      // too many different exponents
      return {
        result: 'unable',
        code: 'Many exps'
      };
    }
  }
}

export default new SolverCore();