import { expect } from "chai";

import Logmon from "../../src/utility_services/Logmon";
const Logger = Logmon.getLogger("Logcal");

import Solver from "../../src/solver/index";

function expectSolutionToBe(solution, result, varlength, varindex, key, solutionlength, values) {
  expect(solution.result).to.equal(result);
  expect(solution.variables.length).to.equal(varlength);
  expect(solution.variables[varindex].key).to.equal(key);
  expect(solution.variables[varindex].solutions.length).to.equal(solutionlength);
  for(let i = 0; i < values.length; i++) {
    expect(solution.variables[varindex].solutions[i]).to.equal(values[i]);
  }
}

describe("CalculatorSolver", () => {
  describe("solveEquationUnlogged(latex) should solve", () => {
    describe("(simple, single)", () => {
      it("1+1=2 (terms)", () => {
        const solution = Solver.solveEquationUnlogged("1+1=2");
        expect(solution.result).to.equal("true");
      });
      
      it("\\frac{1}{2}=0.55", () => {
        const solution = Solver.solveEquationUnlogged("\\frac{1}{2}=0.55");
        expect(solution.result).to.equal("false");
      });
      
      it("x+1=-2", () => {
        const solution = Solver.solveEquationUnlogged("x+1=-2");
        expectSolutionToBe(solution, "true", 1, 0, "x", 1, ["-3"]);
      });

      it("\\left(2+3\\right)+x-\\frac{3}{2}+9=123\\cdot 23+\\frac{2}{2}", () => {
        const solution = Solver.solveEquationUnlogged("\\left(2+3\\right)+x-\\frac{3}{2}+9=123\\cdot 23+\\frac{2}{2}");
        expectSolutionToBe(solution, "true", 1, 0, "x", 1, ["2817.5"]);
      });

      it("(basic complex test)", () => {
        const solution = Solver.solveEquationUnlogged("6\\cdot 6+\\frac{6}{6}+6\\cdot \\left(6+6\\right)+\\frac{6}{\\left(6+6\\right)}+\\left(6+6\\right)\\cdot 6+\\frac{\\left(6+6\\right)}{6}+\\left(6+6\\right)\\cdot \\left(6+6\\right)+\\frac{\\left(6+6\\right)}{\\left(6+6\\right)}+6\\cdot 6\\cdot 6+\\frac{\\frac{6}{6}}{6}+6\\cdot 6\\cdot \\left(6+6\\right)+\\frac{6\\cdot 6}{\\left(6+6\\right)}=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["979.6666666666666"]);
      });

      it("\\frac{1}{2}+\\frac{\\frac{2}{9}}{\\frac{3}{12}}=n", () => {
        const solution = Solver.solveEquationUnlogged("\\frac{1}{2}+\\frac{\\frac{2}{9}}{\\frac{3}{12}}=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["1.3888888888888888"]);
      });      
    })

    describe("(complex, single)", () => {
      it("equation of seconddegree constiable terms with imaginary result", () => {
        // Logger.testRun("CalculatorSolver")
        const solution = Solver.solveEquationUnlogged("5x^2+6+4x=3");
        // console.log("", solution)
        // TODO Create imaginary numbers OR this to be set false
        expectSolutionToBe(solution, "true", 1, 0, "x", 2, ["-0.4+0.6633249580710799i", "-0.4-0.6633249580710799i"]);
      });

      it("equation of seconddegree constiable terms with two roots", () => {
        // Logger.testRun("CalculatorSolver");
        const solution = Solver.solveEquationUnlogged("n^2+n+1=2");
        expectSolutionToBe(solution, "true", 1, 0, "n", 2, ["0.6180339887498949", "-1.618033988749895"]);
      });

      it("equation of seconddegree constiable terms", () => {
        const solution = Solver.solveEquationUnlogged("n^{2-1}+n+1=2");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.5"]);
      });

      it("equation of seconddegree constiable terms", () => {
        // Logger.testRun("CalculatorSolver");
        const solution = Solver.solveEquationUnlogged("\\frac{1}{2}+\\frac{9}{4}=n^2+5\\cdot 3\\cdot \\frac{5}{1}");
        // expect(result[0]).to.equal("n=\\sqrt{-72.25}");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["\\sqrt{-72.25}"]);
      });

      it("equation of three firstdegree constiable terms", () => {
        const solution = Solver.solveEquationUnlogged("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
        // wolframing mukaaan 210/23 eli 9.1304
        expectSolutionToBe(solution, "true", 1, 0, "x", 1, ["9.130434782608695"]);
      });      
    })

    describe("(floating point errors)", () => {
      it("0.3-0.1", () => {
        const solution = Solver.solveEquationUnlogged("0.3-0.1=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.2"]);
      })
      
      it("0.1^6", () => {
        const solution = Solver.solveEquationUnlogged("0.1^6=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.000001"]);
      })
    })

    describe("(simple, probability)", () => {
      it("P(A)", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.6"]);
      });

      it("P(K)", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(K\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.7"]);
      });

      it("P(E)(G)", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(E\\right)P\\left(G\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.12"]);
      });
      
      it("P(A^c), complement", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A^{\\mathsf{c}}\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.4"]);
      });
      
      it("P(A'), complement with different notation", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A'\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.4"]);
      });
      
      it("P(A)', complement outside term", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A'\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.4"]);
      });
    
      it("P(A and K)', complement outside term", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A\\cap K\\right)'=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.6"]);
      });
    
      // xit("P(A and K), independent", () => {
        // const solution = Solver.solveEquationUnlogged("P\\left(A\\cap K\\right)=n");
        // expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.4"]);
      // });
      
      it("P(A and K), not independent", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A\\cap K\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.4"]);
      });

      // xit("P(A mid K), independent", () => {
        // // Logger.testRun("CalculatorSolver");
        // const solution = Solver.solveEquationUnlogged("P\\left(K\\mid A\\right)=n");
        // expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.6666666666666666"]);
      // });
      
      it("P(A mid K), not independent", () => {
        // Logger.testRun("CalculatorSolver");
        const solution = Solver.solveEquationUnlogged("P\\left(K\\mid A\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.6666666666666666"]);
      });

      it("P(A mid K'), not independent, complement second term", () => {
        // Logger.testRun("CalculatorSolver");
        const solution = Solver.solveEquationUnlogged("P\\left(A\\mid K'\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.6666666666666666"]);
      });
    
      it("P(A mid K)P(K)", () => {
        // Logger.testRun("CalculatorSolver");
        const solution = Solver.solveEquationUnlogged("n=P\\left(A\\mid K\\right)P\\left(K\\right)");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.4"]);
      });
      
      it("P(A or G), exclusive", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A\\cup G\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["1"]);
      });
      
      it("P(A or E), not exclusive", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A\\cup E\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.7"]);
      });
      // // -> without
      it("P(A \\ K), not inpendent, relative complement", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A\\setminus K\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.2"]);
      });
    
      it("P(A \\ K)', not inpendent, relative complement, complement", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A\\setminus K\\right)'=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.8"]);
      });
    
      // not sure if converts correctly
      it("P(A' \\ K'), not inpendent, relative complement, both complement", () => {
        const solution = Solver.solveEquationUnlogged("P\\left(A'\\setminus K'\\right)=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.3"]);
      });
    })

    describe("(simple, binomial)", () => {

      it("equation of simple stuff", () => {
        // Logger.testRun("CalculatorSolver");
        const solution = Solver.solveEquationUnlogged("n=\\binom{10}{7}+1");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["121"]);
      });

      it("equation of simple stuff reversed", () => {
        const solution = Solver.solveEquationUnlogged("n=\\binom{10}{3}+1");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["121"]);
      });
      
      it("equation of simple stuff with higher lower value", () => {
        const solution = Solver.solveEquationUnlogged("n=\\binom{5}{6}+1");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["1"]);
      });

      it("equation with bracketed upper value", () => {
        const solution = Solver.solveEquationUnlogged("n=\\binom{5+5}{3}+1");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["121"]);
      });

      it("equation with exponents and stuff", () => {
        const solution = Solver.solveEquationUnlogged("n=\\binom{6}{4}\\frac{4^4\\left(10-6\\right)^{6-4}}{10^6}");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.06144"]);
      });
      
      it("sampling formula without putting back", () => {
        const solution = Solver.solveEquationUnlogged("n=\\frac{\\binom{5}{2}\\binom{9-5}{5-2}}{\\binom{9}{5}}");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.31746031746031744"]);
      })
      
      it("sampling formula and putting back", () => {
        const solution = Solver.solveEquationUnlogged("n=\\binom{20}{8}+0.44^8\\left(1-0.44\\right)^{20-8}");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["125970.00000133622"]);
      })
      
      xit("equation derived from formula xxx that has lower upper value inside binomial", () => {
        const solution = Solver.solveEquationUnlogged("a=\\frac{\\binom{2}{0}\\cdot \\binom{5-3}{3+0}}{\\binom{5}{3}}");
        expectSolutionToBe(solution, "true", 1, 0, "a", 1, ["0"]);
      });
      
      xit("equation with exponents and stuff2", () => {
        Logger.testRun("CalculatorSolver");
        const solution = Solver.solveEquationUnlogged("n=\\binom{10}{9}+0.1^9\\cdot \\left(1-0.1\\right)^{10-9}");
        expect(result[0]).to.equal("n=10");
      });
    });

    describe("(simple, factorial)", () => {
      
      it("equation of simple stuff", () => {
        const solution = Solver.solveEquationUnlogged("5!+\\frac{23}{3}\\cdot 4!-\\frac{2}{2!}+3^{2!}=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["312"]);
      });
      
      it("as in Combination formula", () => {
        // Logger.testRun("LatexParser");
        const solution = Solver.solveEquationUnlogged("n=\\frac{6!}{3!\\left(6-3\\right)!}");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["20"]);
      });
    })
    
    describe("(simple, exponent)", () => {
      
      it("2^3, term and term", () => {
        const solution = Solver.solveEquationUnlogged("2^{3}=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["8"]);
      });
      
      it("2^(1-3), term and bracketed(negative)", () => {
        const solution = Solver.solveEquationUnlogged("2^{1-3}=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["0.25"]);
      });
      
      it("2^1/3, term and op(fraction less than one)", () => {
        const solution = Solver.solveEquationUnlogged("2^{\\frac{1}{3}}=n");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["1.2599210498948732"]);
      });
      // TODO old test
      xit("n^2, variable and term", () => {
        const solution = Solver.solveEquationUnlogged("4=n^2");
        expectSolutionToBe(solution, "true", 1, 0, "n", 1, ["8"]);
      });
    })
  })
})
