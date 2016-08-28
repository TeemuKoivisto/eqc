import MathObject from "../MathObject";

import Orderer from "../../utility_services/Orderer";

export default class MathOperation extends MathObject {
  constructor(factorone, type, factortwo) {
    super("Operation");

    this.firstfactor = factorone;
    this.operation = type === "(" ? "*" : type;
    this.secondfactor = factortwo;

    this.isfraction = this.operation === "/";
  }

  setOrder(order) {
    // console.log("ordering op " + order);
    order++;
    this.order = order;
    Orderer.registerComponent(order, "Operation");
    this.firstfactor.setOrder(order);
    this.firstfactor.setParent(this);
    this.secondfactor.setOrder(order);
    this.secondfactor.setParent(this);
    if (this.exponent && this.exponent.length !== 0) {
      //Orderer.registerComponent(order, "Exponent");
      this.exponent.setOrder(order);
      this.exponent.setParent(this);
    }
  }

  switchSign() {
    if (this.secondfactor.minussign && !this.firstfactor.minussign) {
      this.secondfactor.switchSign();
    } else if (!this.secondfactor.minussign && this.firstfactor.minussign) {
      this.firstfactor.switchSign();
    } else if (this.secondfactor.minussign && this.firstfactor.minussign) {
      throw new TypeError("both factors are minussign in operation" + this);
      // cancels each other out so only switching this minussign? same as both not minussign
    }
    this.minussign = !this.minussign;
  }

  toLatex() {
    let latex = this.minussign ? "-" : "";
    if (this.operation === "*") {
      latex += this.firstfactor.toLatex() + "\\cdot " + this.secondfactor.toLatex();
    } else {
      // sulut n�ytt�� rumilta jos jakolasku. jos minus sulut s�ilyy
      const first = this.firstfactor.isType("Bracketed") ? this.firstfactor.toLatexWithoutBrackets() : this.firstfactor.toLatex();
      const second = this.secondfactor.isType("Bracketed") ? this.secondfactor.toLatexWithoutBrackets() : this.secondfactor.toLatex();
      latex += "\\frac{" + first + "}{" + second + "}";
    }
    if (this.exponent) {
      latex += "^{";
      if (this.exponent.isType("Bracketed")) {
        latex += this.exponent.toLatexWithoutBrackets();
      } else {
        latex += this.exponent.toLatex();
      }
      latex += "}";
    }
    return latex;
  }
}
