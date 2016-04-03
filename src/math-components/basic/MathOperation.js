import MathObject from "../MathObject";

export default class MathOperation extends MathObject {
  constructor(factorone, type, factortwo) {
    super("Operation");

    this.firstfactor = factorone;
    this.operation = type === "(" ? "*" : type;
    this.secondfactor = factortwo;

    this.isfraction = this.operation === "/";
  }
}
