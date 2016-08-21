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
    });
  });
});
