import { expect } from "chai";

import LatexParser from "../../src/parsing/LatexParser";

const Parser = new LatexParser();

describe("LatexParser", () => {
  describe("parseEquation(latex)", () => {
    describe("(simple, single)", () => {
      it("should parse 1+1=2", () => {
        const result = Parser.parseEquation("1+1=2");
        expect(result.toLatex()).to.equal("1+1=2");
      });

      it("should parse 1\\cdot 1=2", () => {
        const result = Parser.parseEquation("1\\cdot 1=2");
        expect(result.toLatex()).to.equal("1\\cdot 1=2");
      });

      it("should parse \\frac{1}{1}=2", () => {
        const result = Parser.parseEquation("\\frac{1}{1}=2");
        expect(result.toLatex()).to.equal("\\frac{1}{1}=2");
      });

      it("should parse \\left(1+1\\right)=2", () => {
        const result = Parser.parseEquation("\\left(1+1\\right)=2");
        expect(result.toLatex()).to.equal("\\left(1+1\\right)=2");
      });

      it("should parse P\\left(A\\right)=2", () => {
        const result = Parser.parseEquation("P\\left(A\\right)=2");
        expect(result.toLatex()).to.equal("P\\left(A\\right)=2");
      });

      it("should parse P\\left(A\\mid B\\right)=2", () => {
        const result = Parser.parseEquation("P\\left(A\\mid B\\right)=2");
        expect(result.toLatex()).to.equal("P\\left(A\\mid B\\right)=2");
      });

      it("should parse \\binom{6}{3}=n", () => {
        const result = Parser.parseEquation("\\binom{6}{3}=n");
        expect(result.toLatex()).to.equal("\\binom{6}{3}=n");
      });
    });

    describe("(simple, multiple-degrees)", () => {
      it("should parse -1+666-0.5+6.66=0+2", () => {
        const result = Parser.parseEquation("-1+666-0.5+6.66=0+2");
        expect(result.toLatex()).to.equal("-1+666-0.5+6.66=0+2");
      });

      it("should parse -1x+666x-0.5x+6.66x=0x+2x-x+x", () => {
        const result = Parser.parseEquation("-1x+666x-0.5x+6.66x=0x+2x-x+x");
        expect(result.toLatex()).to.equal("-x+666x-0.5x+6.66x=0x+2x-x+x");
      });

      it("should parse -1^0+666^1-0.5^22+6.66^{-1}=0^{-2}+2^{3+3}", () => {
        const result = Parser.parseEquation("-1^0+666^1-0.5^22+6.66^{-1}=0^{-2}+2^{3+3}");
        expect(result.toLatex()).to.equal("-1^{0}+666^{1}-0.5^{22}+6.66^{-1}=0^{-2}+2^{3+3}");
      });

      it("should parse -1x^0+666^{1x}-0.5x^{22x}+6.66x^{-1x}=0x^{-2}+2x^{3x+3x}", () => {
        const result = Parser.parseEquation("-1x^0+666^{1x}-0.5x^{22x}+6.66x^{-1x}=0x^{-2}+2x^{3x+3x}");
        expect(result.toLatex()).to.equal("-x^{0}+666^{x}-0.5x^{22x}+6.66x^{-x}=0x^{-2}+2x^{3x+3x}");
      });
    });

    describe("(simple, fractions)", () => {
      it("should parse firstdegree nonvariable terms", () => {
        const result = Parser.parseEquation("-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6");
        expect(result.toLatex()).to.equal("-6\\cdot \\frac{6}{6\\cdot 6}+\\frac{6}{6}\\cdot 6-\\frac{\\frac{6\\cdot \\frac{6}{6}}{6\\cdot 6\\cdot 6}}{\\frac{6}{6}}=6");
      });

      it("should parse firstdegree variable terms", () => {
        const result = Parser.parseEquation("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
        expect(result.toLatex()).to.equal("-6x\\cdot \\frac{x}{6x\\cdot -6}+\\frac{6x}{-6x}\\cdot \\frac{x}{x}-\\frac{\\frac{x\\cdot \\frac{6x}{x+x}}{x\\cdot -\\frac{x}{x}}}{\\frac{5}{x}}=6");
      });
    });
  });
});
