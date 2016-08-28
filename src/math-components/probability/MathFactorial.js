import Orderer from "../../utility_services/Orderer";

import MathObject from "../MathObject";

export default class MathFactorial extends MathObject {

  constructor(component) {
    super("Factorial");

    this.component = component;
  }

  setOrder(order) {
    order++;
    this.order = order;
    Orderer.registerComponent(order, "Factorial");
    this.component.setOrder(order);
    this.component.setParent(this);
    // if (exponent && exponent.length !== 0) {
    // Orderer.registerComponent(order, "Exponent");
    // this.exponent.setOrder(order);
    // this.exponent.setParent(this);
    // }
  }

  switchSign() {
    this.component.switchSign();
    this.minussign = !this.minussign;
  }

  toLatex() {
    return this.component.toLatex() + "!";
  }
}
