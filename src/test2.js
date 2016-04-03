import { TestiLuokka } from "./test";
import { HEI, dd, lista } from "./asdf/dd";

export class YlaLuokka extends TestiLuokka {
  constructor() {
    super();
  }
  metodi2() {
    return "yo";
  }
  metodi3() {
    console.log(HEI);
    console.log(dd());
    console.log(lista());
  }
}
