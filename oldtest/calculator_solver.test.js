describe("CalculatorSolver SUITE1", function() {

    beforeEach(module('OppiApp'));

    beforeEach(inject(function($injector, $window, CalculatorSolver) {
        Logger = $window.Logcal;
        Logger.testing = false;
        Logmon = $window.Logmon;
        Calculator = CalculatorSolver;
    }));

    function expectSolutionToBe(solution, result, varlength, varindex, key, solutionlength, values) {
        expect(solution.result).toBe(result);
        expect(solution.variables.length).toBe(varlength);
        expect(solution.variables[varindex].key).toBe(key);
        expect(solution.variables[varindex].solutions.length).toBe(solutionlength);
        for(var i = 0; i < values.length; i++) {
            expect(solution.variables[varindex].solutions[i]).toBe(values[i]);
        }
    }
    
    describe("should calculate SIMPLE", function() {
    
        it ("equation of three firstdegree nonvariable terms", function() {
            var solution = Calculator.solveEquationUnlogged("1+1=2");
            expect(solution.result).toBe('true');
        });
        
        it ("equation of firstdegree nonvariable operation and term", function() {
            var solution = Calculator.solveEquationUnlogged("\\frac{1}{2}=0.55");
            expect(solution.result).toBe('false');
        });
        
        it ("equation of three firstdegree variable terms", function() {
            var solution = Calculator.solveEquationUnlogged("x+1=-2");
            expectSolutionToBe(solution, 'true', 1, 0, 'x', 1, ['-3']);
        });

        it ("equation of three firstdegree variable terms", function() {
            var solution = Calculator.solveEquationUnlogged("\\left(2+3\\right)+x-\\frac{3}{2}+9=123\\cdot 23+\\frac{2}{2}");
            expectSolutionToBe(solution, 'true', 1, 0, 'x', 1, ['2817.5']);
        });

        it ("equation of three firstdegree variable terms", function() {
            var solution = Calculator.solveEquationUnlogged("6\\cdot 6+\\frac{6}{6}+6\\cdot \\left(6+6\\right)+\\frac{6}{\\left(6+6\\right)}+\\left(6+6\\right)\\cdot 6+\\frac{\\left(6+6\\right)}{6}+\\left(6+6\\right)\\cdot \\left(6+6\\right)+\\frac{\\left(6+6\\right)}{\\left(6+6\\right)}+6\\cdot 6\\cdot 6+\\frac{\\frac{6}{6}}{6}+6\\cdot 6\\cdot \\left(6+6\\right)+\\frac{6\\cdot 6}{\\left(6+6\\right)}=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['979.6666666666666']);
        });

        it ("equation of three firstdegree variable terms", function() {
            var solution = Calculator.solveEquationUnlogged("\\frac{1}{2}+\\frac{\\frac{2}{9}}{\\frac{3}{12}}=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['1.3888888888888888']);
        });
    });

    describe("should solve more COMPLEX", function() {

        it ("equation of seconddegree variable terms with imaginary result", function() {
            // Logger.testRun('CalculatorSolver')
            var solution = Calculator.solveEquationUnlogged("5x^2+6+4x=3");
            // console.log('', solution)
            // TODO Create imaginary numbers OR this to be set false
            expectSolutionToBe(solution, 'true', 1, 0, 'x', 2, ['-0.4+0.6633249580710799i', '-0.4-0.6633249580710799i']);
        });

        it ("equation of seconddegree variable terms with two roots", function() {
            // Logger.testRun('CalculatorSolver');
            var solution = Calculator.solveEquationUnlogged("n^2+n+1=2");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 2, ['0.6180339887498949', '-1.618033988749895']);
        });

        it ("equation of seconddegree variable terms", function() {
            var solution = Calculator.solveEquationUnlogged("n^{2-1}+n+1=2");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.5']);
        });

        it ("equation of seconddegree variable terms", function() {
            // Logger.testRun('CalculatorSolver');
            var solution = Calculator.solveEquationUnlogged("\\frac{1}{2}+\\frac{9}{4}=n^2+5\\cdot 3\\cdot \\frac{5}{1}");
            // expect(result[0]).toBe("n=\\sqrt{-72.25}");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['\\sqrt{-72.25}']);
        });

        it ("equation of three firstdegree variable terms", function() {
            var solution = Calculator.solveEquationUnlogged("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
            // wolframing mukaaan 210/23 eli 9.1304
            expectSolutionToBe(solution, 'true', 1, 0, 'x', 1, ['9.130434782608695']);
        });
    });

	describe("should not produce FLOATING POINT errors", function() {
		
		it ("0.3-0.1", function() {
			var solution = Calculator.solveEquationUnlogged("0.3-0.1=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.2']);
		})
		
		it ("0.1^6", function() {
			var solution = Calculator.solveEquationUnlogged("0.1^6=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.000001']);
		})
	})
	
    describe("should solve PROBABILITY", function() {

        it ("P(A)", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.6']);
        });

        it ("P(K)", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(K\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.7']);
        });

        it ("P(E)(G)", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(E\\right)P\\left(G\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.12']);
        });
        
        it ("P(A^c), complement", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A^{\\mathsf{c}}\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.4']);
        });
        
        it ("P(A'), complement with different notation", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A'\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.4']);
        });
        
		it ("P(A)', complement outside term", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A'\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.4']);
        });
		
		it ("P(A and K)', complement outside term", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A\\cap K\\right)'=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.6']);
        });
		
        // xit ("P(A and K), independent", function() {
            // var solution = Calculator.solveEquationUnlogged("P\\left(A\\cap K\\right)=n");
            // expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.4']);
        // });
        
        it ("P(A and K), not independent", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A\\cap K\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.4']);
        });

        // xit ("P(A mid K), independent", function() {
            // // Logger.testRun('CalculatorSolver');
            // var solution = Calculator.solveEquationUnlogged("P\\left(K\\mid A\\right)=n");
            // expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.6666666666666666']);
        // });
        
        it ("P(A mid K), not independent", function() {
            // Logger.testRun('CalculatorSolver');
            var solution = Calculator.solveEquationUnlogged("P\\left(K\\mid A\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.6666666666666666']);
        });

		it ("P(A mid K'), not independent, complement second term", function() {
            // Logger.testRun('CalculatorSolver');
            var solution = Calculator.solveEquationUnlogged("P\\left(A\\mid K'\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.6666666666666666']);
        });
		
        it ("P(A mid K)P(K)", function() {
            // Logger.testRun('CalculatorSolver');
            var solution = Calculator.solveEquationUnlogged("n=P\\left(A\\mid K\\right)P\\left(K\\right)");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.4']);
        });
        
        it ("P(A or G), exclusive", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A\\cup G\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['1']);
        });
        
        it ("P(A or E), not exclusive", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A\\cup E\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.7']);
        });
		// // -> without
		it ("P(A \\ K), not inpendent, relative complement", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A\\setminus K\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.2']);
        });
		
		it ("P(A \\ K)', not inpendent, relative complement, complement", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A\\setminus K\\right)'=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.8']);
        });
		
		// not sure if converts correctly
		it ("P(A' \\ K'), not inpendent, relative complement, both complement", function() {
            var solution = Calculator.solveEquationUnlogged("P\\left(A'\\setminus K'\\right)=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.3']);
        });
    });

    describe("should solve BINOMIAL", function() {

        it ("equation of simple stuff", function() {
            // Logger.testRun('CalculatorSolver');
            var solution = Calculator.solveEquationUnlogged("n=\\binom{10}{7}+1");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['121']);
        });

        it ("equation of simple stuff reversed", function() {
            var solution = Calculator.solveEquationUnlogged("n=\\binom{10}{3}+1");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['121']);
        });
        
        it ("equation of simple stuff with higher lower value", function() {
            var solution = Calculator.solveEquationUnlogged("n=\\binom{5}{6}+1");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['1']);
        });

        it ("equation with bracketed upper value", function() {
            var solution = Calculator.solveEquationUnlogged("n=\\binom{5+5}{3}+1");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['121']);
        });

        it ("equation with exponents and stuff", function() {
            var solution = Calculator.solveEquationUnlogged("n=\\binom{6}{4}\\frac{4^4\\left(10-6\\right)^{6-4}}{10^6}");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.06144']);
        });
        
        it ('sampling formula without putting back', function() {
            var solution = Calculator.solveEquationUnlogged("n=\\frac{\\binom{5}{2}\\binom{9-5}{5-2}}{\\binom{9}{5}}");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.31746031746031744']);
        })
        
        it ('sampling formula and putting back', function() {
            var solution = Calculator.solveEquationUnlogged("n=\\binom{20}{8}+0.44^8\\left(1-0.44\\right)^{20-8}");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['125970.00000133622']);
        })
        
        xit ("equation derived from formula xxx that has lower upper value inside binomial", function() {
            var solution = Calculator.solveEquationUnlogged("a=\\frac{\\binom{2}{0}\\cdot \\binom{5-3}{3+0}}{\\binom{5}{3}}");
            expectSolutionToBe(solution, 'true', 1, 0, 'a', 1, ['0']);
        });
        
        xit ("equation with exponents and stuff2", function() {
            Logger.testRun('CalculatorSolver');
            var solution = Calculator.solveEquationUnlogged("n=\\binom{10}{9}+0.1^9\\cdot \\left(1-0.1\\right)^{10-9}");
            expect(result[0]).toBe("n=10");
        });
    });

    describe("should solve FACTORIAL", function() {
        
        it ("equation of simple stuff", function() {
            var solution = Calculator.solveEquationUnlogged("5!+\\frac{23}{3}\\cdot 4!-\\frac{2}{2!}+3^{2!}=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['312']);
        });
        
        it ("as in Combination formula", function() {
            // Logger.testRun('LatexParser');
            var solution = Calculator.solveEquationUnlogged("n=\\frac{6!}{3!\\left(6-3\\right)!}");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['20']);
        });
    })
    
    describe("should solve EXPONENT", function() {
        
        it ("2^3, term and term", function() {
            var solution = Calculator.solveEquationUnlogged("2^{3}=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['8']);
        });
        
        it ("2^(1-3), term and bracketed(negative)", function() {
            var solution = Calculator.solveEquationUnlogged("2^{1-3}=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['0.25']);
        });
        
        it ("2^1/3, term and op(fraction less than one)", function() {
            var solution = Calculator.solveEquationUnlogged("2^{\\frac{1}{3}}=n");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['1.2599210498948732']);
        });
        
        it ("n^2, variable and term", function() {
            var solution = Calculator.solveEquationUnlogged("4=n^2");
            expectSolutionToBe(solution, 'true', 1, 0, 'n', 1, ['8']);
        });
    })
    
    // check that if too large numbers, halts processing
    // timeout?
});
