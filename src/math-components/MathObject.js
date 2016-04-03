import IDG from "../utility_services/IDG";

export default class MathObject {
  constructor(type) {
    this.type = type;
    // this.test = "teststring from mathobject";
    this.id = IDG.nextId();
    this.order = -1;
    this.minussign = false;
    this.reduced = false;
    this.exponent = "";
  }
  setType(name) {
    this.type = name;
  }
  containsExponent() {
    return (this.exponent && this.exponent.length !== 0);
  };
  /*
   * Below all the methods to be overridden
   */
  setOrder(depth) {
    throw new TypeError(this.type + " must override method setOrder");
  }
  setExponent(exponent) {
    throw new TypeError(this.type + " must override method setExponent");
  }
  returnContentList() {
    throw new TypeError(this.type + " must override method returnContentList");
  }
  switchSign() {
    throw new TypeError(this.type + " must override method switchSign");
  }
  isEqual() {
    throw new TypeError(this.type + " must override method isEqual");
  }
  isTerm() {
    throw new TypeError(this.type + " must override method isTerm");
  }
  isOperation() {
    throw new TypeError(this.type + " must override method isOperation");
  }
  isBracketed() {
    throw new TypeError(this.type + " must override method isBracketed");
  }
  isSpecial() {
    throw new TypeError(this.type + " must override method isSpecial");
  }
  isEmpty() {
    throw new TypeError(this.type + " must override method isEmpty");
  }
  includesVariable(variable) {
    throw new TypeError(this.type + " must override method includesVariable");
  }
  toLatex() {
    throw new TypeError(this.type + " must override method toLatex");
  }
}
