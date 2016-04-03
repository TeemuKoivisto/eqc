/*
 * Id generator for creating unique ids
 */
export class IdGenerator {
  constructor() {
    this.nextid = 0;
  }
  nextId() {
    return this.nextid++;
  }
}

export default new IdGenerator();
