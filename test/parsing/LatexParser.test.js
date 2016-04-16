import { expect } from "chai";

import LatexParser from "../../src/parsing/LatexParser";

const Parser = new LatexParser();

describe("LatexParser", () => {
  describe("should parse simple", () => {
    xit("term equation", () => {
      const result = Parser.parseEquation("1+1=2");
      expect(result.toLatex()).toBe("1+1=2");
    });
  });
});
