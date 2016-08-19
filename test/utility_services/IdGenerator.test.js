import { expect } from "chai";

import { IdGenerator } from "../../src/utility_services/IdGenerator";

describe("IdGenerator", () => {
  it("should create ids starting from 0", () => {
    const IDG = new IdGenerator();
    const first = IDG.nextId();
    const second = IDG.nextId();
    expect(first).to.equal(0);
    expect(second).to.equal(1);
  });
});
