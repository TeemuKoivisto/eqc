export class TestiLuokka {
  constructor() {
    this.name = "asdf";
  }
  metodi() {
    return this.name
  }
}

import { TestiLuokka } from "./test";

export class YlaLuokka extends TestiLuokka {
  constructor() {
    super();
  }
  ylametodi() {
    return 0;
  }
}
