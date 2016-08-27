describe('LatexParser', function() {

  beforeEach(module('OppiApp'));

  beforeEach(inject(function($injector, $window) {
    Logger = $window.Logcal;
    Logger.testing = false;
    Logmon = $window.Logmon;
    ParserFactory = $injector.get('LatexParser');
    // logger = $injector.get('Logger');
    // logger.consoling = false;
    Parser = new ParserFactory();
  }));

  // NOTICE latex needs double backslash to work \\frac >> \frac
  // probably should save all the equations in list and use it in CalculatorTests

  // describe('asdf', function() {
  describe('should parse simple', function () {

    it("term equation 1+1=2", function () {
      var result = Parser.parseEquation('1+1=2');
      expect(result.toLatex()).toBe("1+1=2");
    });

    it("multiplication equation 1\\cdot 1=2", function () {
      var result = Parser.parseEquation('1\\cdot 1=2');
      expect(result.toLatex()).toBe("1\\cdot 1=2");
    });

    it("fraction equation \\frac{1}{1}=2", function () {
      var result = Parser.parseEquation('\\frac{1}{1}=2');
      expect(result.toLatex()).toBe("\\frac{1}{1}=2");
    });

    it("bracketed equation \\left(1+1\\right)=2", function () {
      var result = Parser.parseEquation('\\left(1+1\\right)=2');
      expect(result.toLatex()).toBe("\\left(1+1\\right)=2");
    });

    it("probability equation P\\left(A\\right)=2", function () {
      var result = Parser.parseEquation('P\\left(A\\right)=2');
      expect(result.toLatex()).toBe("P\\left(A\\right)=2");
    });

    it("probability equation with additional parameters P\left(A\mid B\right)=2", function () {
      var result = Parser.parseEquation('P\\left(A\\mid B\\right)=2');
      expect(result.toLatex()).toBe("P\\left(A\\mid B\\right)=2");
    });

    it("binomial \\binom{6}{3}=n", function () {
      var result = Parser.parseEquation("\\binom{6}{3}=n");
      expect(result.toLatex()).toBe("\\binom{6}{3}=n");
    });

    xit("sum equation \\sum _{i=1}^{n=0}n+1=n", function () {
      var result = Parser.parseEquation('\\sum _{i=1}^{n=0}n+1=n');
      expect(result.toLatex()).toBe("\\left(1+1\\right)=2");
    });
  });

  describe('should parse combination of', function () {

    it('firstdegree nonvariable terms', function () {
      var result = Parser.parseEquation('-1+666-0.5+6.66=0+2');
      expect(result.toLatex()).toBe("-1+666-0.5+6.66=0+2");
    });

    it('firstdegree variable terms', function () {
      var result = Parser.parseEquation('-1x+666x-0.5x+6.66x=0x+2x-x+x');
      expect(result.toLatex()).toBe("-x+666x-0.5x+6.66x=0x+2x-x+x");
    });

    it('different degree nonvariable terms', function () {
      var result = Parser.parseEquation('-1^0+666^1-0.5^22+6.66^{-1}=0^{-2}+2^{3+3}');
      expect(result.toLatex()).toBe("-1^{0}+666^{1}-0.5^{22}+6.66^{-1}=0^{-2}+2^{3+3}");
    });

    it('different degree variable terms', function () {
      var result = Parser.parseEquation('-1x^0+666^{1x}-0.5x^{22x}+6.66x^{-1x}=0x^{-2}+2x^{3x+3x}');
      expect(result.toLatex()).toBe("-x^{0}+666^{x}-0.5x^{22x}+6.66x^{-x}=0x^{-2}+2x^{3x+3x}");
    });
  });

  describe('should parse combination of', function () {

    it('fractions and multiplications of firstdegree nonvariable terms', function () {
      var result = Parser.parseEquation('-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6"');
      expect(result.toLatex()).toBe("-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6");
    });

    it('fractions and multiplications of firstdegree variable terms', function () {
      var result = Parser.parseEquation('-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6');
      expect(result.toLatex()).toBe("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
    });

    xit('fractions and multiplications of different degree nonvariable terms', function () {
      var result = Parser.parseEquation('-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6');
      expect(result.toLatex()).toBe("-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6");
    });

    xit('fractions and multiplications of different degree variable terms', function () {
      var result = Parser.parseEquation('-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6');
      expect(result.toLatex()).toBe("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
    });
  });

  // bracketeds??

  describe('should parse combination of', function () {

    // NOTE bracketeds are changed into multiplications (cdot) when appropiate
    // adjancent bracketeds (1+2)(3+4) change into (1+2)*(3+4)
    // and 5(4+3) into 5*(4+3)

    it('bracketeds with different types of fractions and multiplications of firstdegree nonvariable terms', function () {
      var result = Parser.parseEquation('\\left(3+\\frac{3\\left(\\frac{5}{4}\\cdot 5\\right)}{\\left(\\frac{5}{7}\\right)}\\right)+\\left(3+3\\right)\\left(6+3\\right)-\\frac{5}{\\left(3+2\\right)}=2');
      expect(result.toLatex()).toBe("\\left(3+\\frac{3\\cdot \\left(\\frac{5}{4}\\cdot 5\\right)}{\\frac{5}{7}}\\right)+\\left(3+3\\right)\\cdot \\left(6+3\\right)-\\frac{5}{3+2}=2");
    });

    it('bracketeds with different types of fractions and multiplications of firstdegree variable terms', function () {
      var result = Parser.parseEquation('\\left(\\frac{x}{-x}+\\frac{3\\left(\\frac{x}{x}\\cdot x\\right)}{x\\left(\\frac{1x}{x\\left(x\\right)}\\right)}\\right)+\\left(x+3\\cdot x\\right)\\left(6x+\\left(\\frac{3x}{-3}\\right)+3\\right)-\\frac{\\frac{x}{1}}{\\left(\\frac{3}{\\frac{x}{-3x}}+2x+x\\right)}=2');
      expect(result.toLatex()).toBe("\\left(\\frac{x}{-x}+\\frac{3\\cdot \\left(\\frac{x}{x}\\cdot x\\right)}{x\\cdot \\left(\\frac{x}{x\\cdot \\left(x\\right)}\\right)}\\right)+\\left(x+3\\cdot x\\right)\\cdot \\left(6x+\\left(\\frac{3x}{-3}\\right)+3\\right)-\\frac{\\frac{x}{1}}{\\frac{3}{\\frac{x}{-3x}}+2x+x}=2");
    });

    xit('fractions and multiplications of different degree nonvariable terms', function () {
      var result = Parser.parseEquation('-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6');
      expect(result.toLatex()).toBe("-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6");
    });

    xit('fractions and multiplications of different degree variable terms', function () {
      var result = Parser.parseEquation('-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6');
      expect(result.toLatex()).toBe("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
    });
  });

  describe('should parse different specials of before mentioned components', function () {

    // some kind of weird sum?

    it('like my basic test', function () {
      var result = Parser.parseEquation('6\\cdot 6+\\frac{6}{6}+6\\cdot \\left(6+6\\right)+\\frac{6}{\\left(6+6\\right)}+\\left(6+6\\right)\\cdot 6+\\frac{\\left(6+6\\right)}{6}+\\left(6+6\\right)\\cdot \\left(6+6\\right)+\\frac{\\left(6+6\\right)}{\\left(6+6\\right)}+6\\cdot 6\\cdot 6+\\frac{\\frac{6}{6}}{6}+6\\cdot 6\\cdot \\left(6+6\\right)+\\frac{6\\cdot 6}{\\left(6+6\\right)}=n');
      expect(result.toLatex()).toBe("6\\cdot 6+\\frac{6}{6}+6\\cdot \\left(6+6\\right)+\\frac{6}{6+6}+\\left(6+6\\right)\\cdot 6+\\frac{6+6}{6}+\\left(6+6\\right)\\cdot \\left(6+6\\right)+\\frac{6+6}{6+6}+6\\cdot 6\\cdot 6+\\frac{\\frac{6}{6}}{6}+6\\cdot 6\\cdot \\left(6+6\\right)+\\frac{6\\cdot 6}{6+6}=n");
    });
  });

  describe('should parse different types of probability', function () {

    it("probability equation P\\left(A\\cup \\right)=2", function () {
      var result = Parser.parseEquation('P\\left(A\\cup B\\right)=2');
      expect(result.toLatex()).toBe("P\\left(A\\cup B\\right)=2");
    });

    it("probability equation P\\left(A\\cap \\right)=2", function () {
      var result = Parser.parseEquation('P\\left(A\\cap B\\right)=2');
      expect(result.toLatex()).toBe("P\\left(A\\cap B\\right)=2");
    });

    it("probability equation P\\left(A^c\\right)=2", function () {
      var result = Parser.parseEquation("P\\left(A^{\\mathsf{c}}\\right)=2");
      expect(result.toLatex()).toBe("P\\left(A^{\\mathsf{c}}\\right)=2");
    });
    
    it("probability equation P\\left(A\\mid \\right)=2", function () {
      var result = Parser.parseEquation('P\\left(A\\mid B\\right)=2');
      expect(result.toLatex()).toBe("P\\left(A\\mid B\\right)=2");
    });
    
    it("probability equation P\\left(A \\right)P\\left(B \\right)=2", function () {
      var result = Parser.parseEquation('P\\left(A \\right)P\\left(B \\right)=2');
      expect(result.toLatex()).toBe("P\\left(A\\right)\\cdot P\\left(B\\right)=2");
    });
  });
  // });

  describe('should parse exponents', function() {

    // NOTE all single terms exponents are latex'ed with curly brackets to save time and effort

    it('for terms', function() {
      // Logger.testRun('LatexParser');
      var result = Parser.parseEquation("\\left(a+b\\right)^n=a^k+b^{n-k}");
      expect(result.toLatex()).toBe("\\left(a+b\\right)^{n}=a^{k}+b^{n-k}");
    });

    it('for crazy terms', function() {
      var result = Parser.parseEquation("P\\left(A\\mid B\\right)=n\\frac{K^k\\left(N-K\\right)^{n-k}}{N^n}");
      expect(result.toLatex()).toBe("P\\left(A\\mid B\\right)=n\\cdot \\frac{K^{k}\\cdot \\left(N-K\\right)^{n-k}}{N^{n}}");
    });
  });

  describe('should parse binomials', function() {

    // NOTE all single terms exponents are latex'ed with curly brackets to save time and effort

    it('for hardcore stuff', function() {
      // Logger.testRun('LatexParser')
      var result = Parser.parseEquation("P\\left(A\\right)=\\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}");
      expect(result.toLatex()).toBe("P\\left(A\\right)=\\frac{\\binom{K}{k}\\cdot \\binom{N-K}{n-k}}{\\binom{N}{n}}");
    });

    it('for crazy terms', function() {
      // Logger.testRun('LatexParser')
      var result = Parser.parseEquation("P\\left(A\\mid B\\right)=n\\frac{K^k\\left(N-K\\right)^{n-k}}{N^n}");
      expect(result.toLatex()).toBe("P\\left(A\\mid B\\right)=n\\cdot \\frac{K^{k}\\cdot \\left(N-K\\right)^{n-k}}{N^{n}}");
    });
		
		it('that are conjoined with term to create multiplication', function() {
      // Logger.testRun('LatexParser')
      var result = Parser.parseEquation("\\binom{10}{5}12=n");
      expect(result.toLatex()).toBe("\\binom{10}{5}\\cdot 12=n");
    });
  });
  
  describe('should parse factorials', function() {

    it('5!, basic stuff', function() {
      // Logger.testRun('LatexParser')
      var result = Parser.parseEquation("5!+\\frac{23}{3}\\cdot 4!-\\frac{2}{2!}=n");
      expect(result.toLatex()).toBe("5!+\\frac{23}{3}\\cdot 4!-\\frac{2}{2!}=n");
    });

    it('(2+1)!, bracketeds', function() {
      // Logger.testRun('LatexParser')
      var result = Parser.parseEquation("\\left(1+2\\right)!=n");
      expect(result.toLatex()).toBe("\\left(1+2\\right)!=n");
    });
    
    it('-(2+1)!, negative bracketeds', function() {
      // Logger.testRun('LatexParser')
      var result = Parser.parseEquation("-\\left(1+2\\right)!=n");
      expect(result.toLatex()).toBe("-\\left(1+2\\right)!=n");
    });
  });
  
	describe('should create multiplications from', function() {

    it('(2+2)(2+4), brack + brack', function() {
      // Logger.testRun('LatexParser')
      var result = Parser.parseEquation("\\left(2+2\\right)\\left(2+2\\right)=n");
      expect(result.toLatex()).toBe("\\left(2+2\\right)\\cdot \\left(2+2\\right)=n");
    });

		it('81(2+1), term + brack', function() {
      var result = Parser.parseEquation("81\\left(2+1\\right)=n");
      expect(result.toLatex()).toBe("81\\cdot \\left(2+1\\right)=n");
    });
		
    it('(2+1)3, brack + term', function() {
      var result = Parser.parseEquation("\\left(2+1\\right)3=n");
      expect(result.toLatex()).toBe("\\left(2+1\\right)\\cdot 3=n");
    });
    
		it('2(2+1)3, term + brack + term', function() {
      var result = Parser.parseEquation("2\\left(2+1\\right)3=n");
      expect(result.toLatex()).toBe("2\\cdot \\left(2+1\\right)\\cdot 3=n");
    });
		
    it('2\\frac{2}{2}, term + frac', function() {
      var result = Parser.parseEquation("2\\frac{2}{2}=n");
      expect(result.toLatex()).toBe("2\\cdot \\frac{2}{2}=n");
    });
		
		it('\\frac{2}{2}2, frac + term', function() {
      var result = Parser.parseEquation("\\frac{2}{2}2=n");
      expect(result.toLatex()).toBe("\\frac{2}{2}\\cdot 2=n");
    });
		
		it('2\\frac{2}{2}2, term + frac + term', function() {
      var result = Parser.parseEquation("2\\frac{2}{2}2=n");
      expect(result.toLatex()).toBe("2\\cdot \\frac{2}{2}\\cdot 2=n");
    });
  });
	
	describe('should create complements from', function() {

    it("P(A'), term(inside)", function() {
      // Logger.testRun('LatexParser')
      var result = Parser.parseEquation("P\\left(A'\\right)=n");
      expect(result.toLatex()).toBe("P\\left(A^{\\mathsf{c}}\\right)=n");
    });
		
		it("P(A\\mid K)', bracketed(outside)", function() {
      // Logger.testRun('LatexParser')
      var result = Parser.parseEquation("P\\left(A\\mid K\\right)'=n");
      expect(result.toLatex()).toBe("P\\left(A\\mid K\\right)^{\\mathsf{c}}=n");
    });
  });
	
  describe('shouldn\'t crash on erronous input', function() {
    
    it('for fucked up binomial', function() {
      var result = Parser.parseEquation('a=\\frac{\\binom{5}{3}\\binom{10-3}{5-3}}{^{\\binom{10}{5}}}');
      expect(Parser.status).toBe('Parser error');
    })
  })
})