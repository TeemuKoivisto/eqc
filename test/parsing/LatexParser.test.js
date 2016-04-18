import { expect } from "chai";

import LatexParser from "../../src/parsing/LatexParser";

const Parser = new LatexParser();

describe("LatexParser", () => {
  describe("parseEquation(latex)", () => {
    xit("should parse 1+1=2", () => {
      const result = Parser.parseEquation("1+1=2");
      expect(result.toLatex()).to.equal("1+1=2");
    });
  });
});
