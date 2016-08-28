import { expect } from "chai";

import LatexParser from "../../src/parsing/LatexParser";
import Logmon from "../../src/utility_services/Logmon";
const Logger = Logmon.getLogger("Logcal");

const Parser = new LatexParser();

xdescribe("LatexParser", () => {
  describe("parseEquation(latex) should parse", () => {
    describe("(simple, single)", () => {
      it("1+1=2", () => {
        const result = Parser.parseEquation("1+1=2");
        expect(result.toLatex()).to.equal("1+1=2");
      });

      it("1\\cdot 1=2", () => {
        const result = Parser.parseEquation("1\\cdot 1=2");
        expect(result.toLatex()).to.equal("1\\cdot 1=2");
      });

      it("\\frac{1}{1}=2", () => {
        const result = Parser.parseEquation("\\frac{1}{1}=2");
        expect(result.toLatex()).to.equal("\\frac{1}{1}=2");
      });

      it("\\left(1+1\\right)=2", () => {
        const result = Parser.parseEquation("\\left(1+1\\right)=2");
        expect(result.toLatex()).to.equal("\\left(1+1\\right)=2");
      });

      it("P\\left(A\\right)=2", () => {
        const result = Parser.parseEquation("P\\left(A\\right)=2");
        expect(result.toLatex()).to.equal("P\\left(A\\right)=2");
      });

      it("P\\left(A\\mid B\\right)=2", () => {
        const result = Parser.parseEquation("P\\left(A\\mid B\\right)=2");
        expect(result.toLatex()).to.equal("P\\left(A\\mid B\\right)=2");
      });

      it("\\binom{6}{3}=n", () => {
        const result = Parser.parseEquation("\\binom{6}{3}=n");
        expect(result.toLatex()).to.equal("\\binom{6}{3}=n");
      });
    });

    describe("(simple, multiple-degrees)", () => {
      it("-1+666-0.5+6.66=0+2", () => {
        const result = Parser.parseEquation("-1+666-0.5+6.66=0+2");
        expect(result.toLatex()).to.equal("-1+666-0.5+6.66=0+2");
      });

      it("-1x+666x-0.5x+6.66x=0x+2x-x+x", () => {
        const result = Parser.parseEquation("-1x+666x-0.5x+6.66x=0x+2x-x+x");
        expect(result.toLatex()).to.equal("-x+666x-0.5x+6.66x=0x+2x-x+x");
      });

      it("-1^0+666^1-0.5^22+6.66^{-1}=0^{-2}+2^{3+3}", () => {
        const result = Parser.parseEquation("-1^0+666^1-0.5^22+6.66^{-1}=0^{-2}+2^{3+3}");
        expect(result.toLatex()).to.equal("-1^{0}+666^{1}-0.5^{22}+6.66^{-1}=0^{-2}+2^{3+3}");
      });

      it("-1x^0+666^{1x}-0.5x^{22x}+6.66x^{-1x}=0x^{-2}+2x^{3x+3x}", () => {
        const result = Parser.parseEquation("-1x^0+666^{1x}-0.5x^{22x}+6.66x^{-1x}=0x^{-2}+2x^{3x+3x}");
        expect(result.toLatex()).to.equal("-x^{0}+666^{x}-0.5x^{22x}+6.66x^{-x}=0x^{-2}+2x^{3x+3x}");
      });
    });

    describe("(simple, fractions)", () => {
      it("firstdegree nonconstiable terms", () => {
        const result = Parser.parseEquation("-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6");
        expect(result.toLatex()).to.equal("-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6");
      });

      it("firstdegree constiable terms", () => {
        const result = Parser.parseEquation("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
        expect(result.toLatex()).to.equal("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
      });
    });

    describe("(simple, brackets)", () => {

      // NOTE> brackets are changed into multiplications (cdot) when appropiate.
      // Adjancent brackets (1+2)(3+4) change into (1+2)*(3+4).
      // Also 5(4+3) into 5*(4+3).

      it("brackets with different types of fractions and multiplications of firstdegree nonconstiable terms", () => {
        const result = Parser.parseEquation("\\left(3+\\frac{3\\left(\\frac{5}{4}\\cdot 5\\right)}{\\left(\\frac{5}{7}\\right)}\\right)+\\left(3+3\\right)\\left(6+3\\right)-\\frac{5}{\\left(3+2\\right)}=2");
        expect(result.toLatex()).to.equal("\\left(3+\\frac{3\\cdot \\left(\\frac{5}{4}\\cdot 5\\right)}{\\frac{5}{7}}\\right)+\\left(3+3\\right)\\cdot \\left(6+3\\right)-\\frac{5}{3+2}=2");
      });

      it("bracketeds with different types of fractions and multiplications of firstdegree constiable terms", () => {
        const result = Parser.parseEquation("\\left(\\frac{x}{-x}+\\frac{3\\left(\\frac{x}{x}\\cdot x\\right)}{x\\left(\\frac{1x}{x\\left(x\\right)}\\right)}\\right)+\\left(x+3\\cdot x\\right)\\left(6x+\\left(\\frac{3x}{-3}\\right)+3\\right)-\\frac{\\frac{x}{1}}{\\left(\\frac{3}{\\frac{x}{-3x}}+2x+x\\right)}=2");
        expect(result.toLatex()).to.equal("\\left(\\frac{x}{-x}+\\frac{3\\cdot \\left(\\frac{x}{x}\\cdot x\\right)}{x\\cdot \\left(\\frac{x}{x\\cdot \\left(x\\right)}\\right)}\\right)+\\left(x+3\\cdot x\\right)\\cdot \\left(6x+\\left(\\frac{3x}{-3}\\right)+3\\right)-\\frac{\\frac{x}{1}}{\\frac{3}{\\frac{x}{-3x}}+2x+x}=2");
      });

      xit('fractions and multiplications of different degree nonconstiable terms', function () {
          const result = Parser.parseEquation('-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6');
          expect(result.toLatex()).to.equal("-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6");
      });

      xit('fractions and multiplications of different degree constiable terms', function () {
          const result = Parser.parseEquation('-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6');
          expect(result.toLatex()).to.equal("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
      });
    });

    describe("(simple, multiple)", () => {

      // some kind of weird sum?

      it("my basic test", () => {
        const result = Parser.parseEquation("6\\cdot 6+\\frac{6}{6}+6\\cdot \\left(6+6\\right)+\\frac{6}{\\left(6+6\\right)}+\\left(6+6\\right)\\cdot 6+\\frac{\\left(6+6\\right)}{6}+\\left(6+6\\right)\\cdot \\left(6+6\\right)+\\frac{\\left(6+6\\right)}{\\left(6+6\\right)}+6\\cdot 6\\cdot 6+\\frac{\\frac{6}{6}}{6}+6\\cdot 6\\cdot \\left(6+6\\right)+\\frac{6\\cdot 6}{\\left(6+6\\right)}=n");
        expect(result.toLatex()).to.equal("6\\cdot 6+\\frac{6}{6}+6\\cdot \\left(6+6\\right)+\\frac{6}{6+6}+\\left(6+6\\right)\\cdot 6+\\frac{6+6}{6}+\\left(6+6\\right)\\cdot \\left(6+6\\right)+\\frac{6+6}{6+6}+6\\cdot 6\\cdot 6+\\frac{\\frac{6}{6}}{6}+6\\cdot 6\\cdot \\left(6+6\\right)+\\frac{6\\cdot 6}{6+6}=n");
      });
    });

    describe("(simple, probability)", () => {

      it("P\\left(A\\cup \\right)=2", () => {
        const result = Parser.parseEquation("P\\left(A\\cup B\\right)=2");
        expect(result.toLatex()).to.equal("P\\left(A\\cup B\\right)=2");
      });

      it("P\\left(A\\cap \\right)=2", () => {
        const result = Parser.parseEquation("P\\left(A\\cap B\\right)=2");
        expect(result.toLatex()).to.equal("P\\left(A\\cap B\\right)=2");
      });

      it("P\\left(A^c\\right)=2", () => {
        // Logger.testRun("LatexParser");
        const result = Parser.parseEquation("P\\left(A^{\\mathsf{c}}\\right)=2");
        expect(result.toLatex()).to.equal("P\\left(A^{\\mathsf{c}}\\right)=2");
      });
      
      it("P\\left(A\\mid \\right)=2", () => {
        const result = Parser.parseEquation("P\\left(A\\mid B\\right)=2");
        expect(result.toLatex()).to.equal("P\\left(A\\mid B\\right)=2");
      });
      
      it("P\\left(A \\right)P\\left(B \\right)=2", () => {
        const result = Parser.parseEquation("P\\left(A \\right)P\\left(B \\right)=2");
        expect(result.toLatex()).to.equal("P\\left(A\\right)\\cdot P\\left(B\\right)=2");
      });
    });
    // });

    describe("(simple, exponents)", () => {

      // NOTE all single terms exponents are latex'ed with curly brackets to save time and effort

      it("single degree terms", () => {
        // Logger.testRun('LatexParser');
        const result = Parser.parseEquation("\\left(a+b\\right)^n=a^k+b^{n-k}");
        expect(result.toLatex()).to.equal("\\left(a+b\\right)^{n}=a^{k}+b^{n-k}");
      });

      it("various nested terms", () => {
        const result = Parser.parseEquation("P\\left(A\\mid B\\right)=n\\frac{K^k\\left(N-K\\right)^{n-k}}{N^n}");
        expect(result.toLatex()).to.equal("P\\left(A\\mid B\\right)=n\\cdot \\frac{K^{k}\\cdot \\left(N-K\\right)^{n-k}}{N^{n}}");
      });
    });

    describe("(simple, binomials)", () => {

      // NOTE all single terms exponents are latex'ed with curly brackets to save time and effort

      it("equation x", () => {
        // Logger.testRun('LatexParser')
        const result = Parser.parseEquation("P\\left(A\\right)=\\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}");
        expect(result.toLatex()).to.equal("P\\left(A\\right)=\\frac{\\binom{K}{k}\\cdot \\binom{N-K}{n-k}}{\\binom{N}{n}}");
      });

      it("equation y", () => {
        // Logger.testRun('LatexParser')
        const result = Parser.parseEquation("P\\left(A\\mid B\\right)=n\\frac{K^k\\left(N-K\\right)^{n-k}}{N^n}");
        expect(result.toLatex()).to.equal("P\\left(A\\mid B\\right)=n\\cdot \\frac{K^{k}\\cdot \\left(N-K\\right)^{n-k}}{N^{n}}");
      });
      
      it("conjoined with term to create multiplication", () => {
        // Logger.testRun('LatexParser')
        const result = Parser.parseEquation("\\binom{10}{5}12=n");
        expect(result.toLatex()).to.equal("\\binom{10}{5}\\cdot 12=n");
      });
    });
    
    describe("(simple, factorials)", () => {

      it("5!", () => {
        // Logger.testRun('LatexParser')
        const result = Parser.parseEquation("5!+\\frac{23}{3}\\cdot 4!-\\frac{2}{2!}=n");
        expect(result.toLatex()).to.equal("5!+\\frac{23}{3}\\cdot 4!-\\frac{2}{2!}=n");
      });

      it("(2+1)!, brackets", () => {
        // Logger.testRun('LatexParser')
        const result = Parser.parseEquation("\\left(1+2\\right)!=n");
        expect(result.toLatex()).to.equal("\\left(1+2\\right)!=n");
      });
      
      it("-(2+1)!, negative brackets", () => {
        // Logger.testRun('LatexParser')
        const result = Parser.parseEquation("-\\left(1+2\\right)!=n");
        expect(result.toLatex()).to.equal("-\\left(1+2\\right)!=n");
      });
    });
    
    describe("(functionality, multiplications)", () => {

      it("(2+2)(2+4), brack + brack", () => {
        // Logger.testRun('LatexParser')
        const result = Parser.parseEquation("\\left(2+2\\right)\\left(2+2\\right)=n");
        expect(result.toLatex()).to.equal("\\left(2+2\\right)\\cdot \\left(2+2\\right)=n");
      });

      it("81(2+1), term + brack", () => {
        const result = Parser.parseEquation("81\\left(2+1\\right)=n");
        expect(result.toLatex()).to.equal("81\\cdot \\left(2+1\\right)=n");
      });
      
      it("(2+1)3, brack + term", () => {
        const result = Parser.parseEquation("\\left(2+1\\right)3=n");
        expect(result.toLatex()).to.equal("\\left(2+1\\right)\\cdot 3=n");
      });
      
      it("2(2+1)3, term + brack + term", () => {
        const result = Parser.parseEquation("2\\left(2+1\\right)3=n");
        expect(result.toLatex()).to.equal("2\\cdot \\left(2+1\\right)\\cdot 3=n");
      });
      
      it("2\\frac{2}{2}, term + frac", () => {
        const result = Parser.parseEquation("2\\frac{2}{2}=n");
        expect(result.toLatex()).to.equal("2\\cdot \\frac{2}{2}=n");
      });
      
      it("\\frac{2}{2}2, frac + term", () => {
        const result = Parser.parseEquation("\\frac{2}{2}2=n");
        expect(result.toLatex()).to.equal("\\frac{2}{2}\\cdot 2=n");
      });
      
      it("2\\frac{2}{2}2, term + frac + term", () => {
        const result = Parser.parseEquation("2\\frac{2}{2}2=n");
        expect(result.toLatex()).to.equal("2\\cdot \\frac{2}{2}\\cdot 2=n");
      });
    });
    
    describe("(simple, complements)", () => {

      it("P(A'), term(inside)", () => {
        // Logger.testRun('LatexParser')
        const result = Parser.parseEquation("P\\left(A'\\right)=n");
        expect(result.toLatex()).to.equal("P\\left(A^{\\mathsf{c}}\\right)=n");
      });
      
      it("P(A\\mid K)', bracket(outside)", () => {
        // Logger.testRun('LatexParser')
        const result = Parser.parseEquation("P\\left(A\\mid K\\right)'=n");
        expect(result.toLatex()).to.equal("P\\left(A\\mid K\\right)^{\\mathsf{c}}=n");
      });
    });
    
    xdescribe("shouldn't crash on erronous input", () => {
      
      it("for fucked up binomial", () => {
        const result = Parser.parseEquation("a=\\frac{\\binom{5}{3}\\binom{10-3}{5-3}}{^{\\binom{10}{5}}}");
        expect(Parser.status).to.equal("Parser error");
      });
    });
  });
});
