import { expect } from "chai";

import { Logger } from "../../src/utility_services/Logger";

describe("Logger", () => {
  describe("when initiliazed", () => {
    it("should start with empty values", () => {
      const logger = new Logger();
      expect(logger.log).to.be.empty;
      expect(logger.message).to.equal("");
      expect(logger.equation).to.equal(null);
    });
    it("should happen when calling setEquation(equation)", () => {
      const logger = new Logger();
      logger.setEquation("asdf");
      expect(logger.log).to.be.empty;
      expect(logger.message).to.equal("");
      expect(logger.equation).to.equal("asdf");
    });
  });
  describe("newLatex(name)", () => {
    it("should log the step with a name and latex derived from this.equation", () => {
      const logger = new Logger();
      logger.setEquation();
      logger.createLatex("a step", "1=n");
      expect(logger.log).to.eql([{
        latex: "1=n",
        stepName: "a step",
        formula: "",
      }]);
      expect(logger.message).to.equal("");
      expect(logger.equation).to.equal(null);
    });
  });
  describe("createLatex(name, latex)", () => {
    it("should log the step with a name and latex", () => {
      const logger = new Logger();
      logger.createLatex("a step", "1=n");
      expect(logger.log).to.eql([{
        latex: "1=n",
        stepName: "a step",
        formula: "",
      }]);
      expect(logger.message).to.equal("");
      expect(logger.equation).to.equal(null);
    });
  });
});
