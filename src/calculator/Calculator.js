export default class Calculator {
  constructor(name) {
    this.name = name;
  }
  calculate(Previous, Current) {
    throw new TypeError(`Calculator${this.name} must override method calculate`);
  }
}
