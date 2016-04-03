import { expect } from "chai";

import { IdGenerator } from "../../src/utility_services/IDG";

describe("IdGenerator", () => {
  it("should start creating new ids from 0", () => {
    const IDG = new IdGenerator();
    const first = IDG.nextId();
    expect(first).to.equal(0);
  });
});
