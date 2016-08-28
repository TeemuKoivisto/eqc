import Orderer from "../../utility_services/Orderer";

import MathObject from "../MathObject";

export default class MathFactorial extends MathObject {

  constructor(component) {
    super("Factorial");

    this.component = component;
  }

  switchSign() {
    this.component.switchSign();
    this.minussign = !this.minussign;
  }

  toLatex() {
    return this.component.toLatex() + "!";
  }
}
