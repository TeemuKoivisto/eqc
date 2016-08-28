import Logger from "../utility_services/Logger";
import Logmon from "../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");
import Orderer from "../utility_services/Orderer";

import Calculator from "../calculator/index";

import SolverCore from "./core";

class Solver {

  constructor() {
  }

  checkEquationIsSolution(latex, solution) {
    Logcal.start('CalculatorSolver checkEquationIsSolution: latex ' + latex + ' solution ' + solution);
    var solved = SolverCore.solveWithCombinations(latex, solution.combinations);
    // var solution2 = SolverCore.solve(solution.result);
    console.log('solution ', solved);
    console.log('should be ', solution)
      // console.log('solution2 ', solution2);
    var result;
    if (solved.result === 'rightCombination') {
      result = 'true';
    } else if (solved.result === 'retarded') {
      result = 'retarded'
    } else if (solved.result === 'unable') {
      result = 'broken';
    } else if (solved.result !== 'checkMe' && solved.result !== solution.result) {
      console.log('s1 result ei ole check me ja eivat ole samat')
      result = 'false';
    } else if (solved.variables.length !== solution.variables.length) {
      console.log('pituus ei sama')
      result = 'false';
    } else if (solved.variables.length > 0 && solution.variables.length > 0) {
      console.log('variables pituus yli 0')
      if (solved.variables.length > 1) {
      // TODO multiple variables
      result = 'false';
      } else {
      var v1 = solved.variables[0];
      var v2 = solution.variables[0];
      if (v1.key !== v2.key) {
        result = 'false';
      } else {
        result = 'true';
        for (var s = 0; s < v1.solutions.length; s++) {
        // TODO doesn't differentiate between order
        if (v1.solutions[s] !== v2.solutions[s]) {
          result = 'false';
          break;
        }
        }
        if (solved.result === 'checkMe' && result === 'true') {
        result = 'retarded';
        }
      }
      }
    }
    Logcal.end('FROM CalculatorSolver checkEquationIsSolution: latex ' + latex + ' solution ' + solution + ' RETURN result ' + result);
    return result;
  }

  // this.checkEquationIsSolution2(latex, solution) {
  // Logcal.start('CalculatorSolver solveEquationIsSolution: latex ' + latex + ' solution ' + solution);
  // var solution1 = SolverCore.solveWithCombinations(latex, solution.combinations);
  // // var solution2 = SolverCore.solve(solution.result);
  // console.log('solution ', solution1);
  // console.log('should be ', solution)
  // // console.log('solution2 ', solution2);
  // var result;
  // if (solution1.result === 'rightCombination') {
  // result = 'true';
  // } else if (solution1.result === 'retarded') {
  // result = 'retarded'
  // } else if (solution1.result !== 'checkMe' && solution1.result !== solution.result) {
  // console.log('s1 result ei ole check me ja eivat ole samat')
  // result = 'false';
  // } else if (solution1.variables.length !== solution.variables.length) {
  // console.log('pituus ei sama')
  // result = 'false';
  // } else if (solution1.variables.length>0 && solution.variables.length>0) {
  // console.log('variables pituus yli 0')
  // if (solution1.variables.length > 1) {
  // // TODO multiple variables
  // result = 'false';
  // // for(var i = 0; i < solution1.variables.length; i++) {
  // // }
  // } else {
  // var v1 = solution1.variables[0];
  // var v2 = solution.variables[0];
  // if (v1.key !== v2.key) {
  // result = 'false';
  // } else {
  // for(var s = 0; s < v1.solutions.length; s++) {
  // // TODO doesn't differentiate between order
  // if (v1.solutions[s] !== v2.solutions[s]) {
  // result = 'false';
  // break;
  // }
  // }
  // if (solution1.result === 'checkMe') {
  // result = 'retarded';
  // } else {
  // result = 'true';
  // }
  // }
  // }
  // // now when constant is declared as variable never should come here..
  // } else {
  // throw('what no variables?')
  // }
  // Logcal.end('FROM CalculatorSolver solveEquationIsSolution: latex ' + latex + ' solution ' + solution + ' RETURN result ' + result);
  // return result;
  // };

  solveEquationUnlogged(latex) {
    Logcal.start('CalculatorSolver solveEquationUnlogged: latex ' + latex);
    var solution = SolverCore.solve(latex);
    Logcal.append('solution ', solution);
    Logcal.end('FROM CalculatorSolver solveEquationUnlogged: latex ' + latex + ' RETURN solution ' + solution);
    // console.log(solution)
    return solution;
  }

  solveEquationLogged(latex) {
    Logcal.start('CalculatorSolver solveEquationLogged: latex ' + latex);
    Logcal.timerStart('CalculatorSolver solveEquationLogged');
    var solution = SolverCore.solve(latex);
    Logcal.append('solution ', solution);
    if (solution.variables.length === 1) {
      for (var i = 0; i < solution.variables[0].solutions.length; i++) {
      Logger.createLatex("Result:", solution.variables[0].key + '=' + solution.variables[0].solutions[i]);
      }
    } else if (solution.variables.length === 0) {
      Logger.createLatex("No result:\n" + solution.message, 0);
    } else {
      Logger.createLatex("Many results:\n" + solution.message, 0);
    }

    var list = Logger.log;

    Logcal.timerEnd('CalculatorSolver solveEquationLogged');
    Logcal.end('FROM CalculatorSolver solveEquationLogged: latex ' + latex + ' RETURN list ' + list);
    return list;
  }
}

export default new Solver();