
export default class Orderer {

  constructor() {
    this.orders = [];
    this.orderobj = {};
    this.availableConversions = [];
    this.underConversion = [];
    this.locked = [];
    // this.ordnung = {
    //   "Sum": 0,
    //   "Probability": -1,
    //   "Binomial": -2,
    //   "Exponent": -3,
    //   "Bracketed": -4,
    //   "Factorial": -5,
    //   "Operation": -6,
    //   "Term": -7
    // };
  }

  resetOrder() {
    this.orders = [];
    this.orderobj = {};
  }

  setEquationOrder(Equation) {
    Logcal.append('Orderer setEquationOrder: Equation ' + Equation);
    this.resetOrder();
    for (var i = 0; i < Equation.leftside.length; i++) {
      Equation.leftside[i].setOrder(0);
      Equation.leftside[i].setParent(Equation);
    }
    for (var i = 0; i < Equation.rightside.length; i++) {
      Equation.rightside[i].setOrder(0);
      Equation.rightside[i].setParent(Equation);
    }
  }

  setOrder(Location, Order, Component) {
    Logcal.append('Orderer setOrder: Location ' + Location + ' Order ' + Order + ' Component ' + Component);
    // console.log('component is ' + Component.type)
    if (Object.prototype.toString.call(Component) === '[object Array]') {
      for (var i = 0; i < Component.length; i++) {
        Component[i].order = Order;
        Component[i].parent = Location;
        Component[i].setOrder(Order - 1);
      }
    } else {
      Component.order = Order;
      Component.parent = Location;
      Order--;
      Component.setOrder(Order);
    }
  };

  registerComponent(order, type, id) {
    if (this.orders.indexOf(order) === -1) {
      this.orders.push(order);
      this.orders.sort(function(a, b) {
        return b - a;
      });
    }
    if (this.orderobj[type] && typeof this.orderobj[type] !== 'undefined') {
      this.orderobj[type].depths.push({
        order: order,
        id: id
      });
    } else {
      this.orderobj[type] = {
        depths: [{
          order: order,
          id: id
        }]
      };
    }
  };

  unregisterComponent(type, id) {
    for (var i = 0; i < this.orderobj[type].depths; i++) {
      if (this.orderobj[type].depths[i].id === id) {
        this.orderobj[type].depths.splice(i, 1);
      }
    }
  }

  addUnderConversion(list) {
    Array.prototype.push.apply(this.underConversion, list);
  }

  isUnderConversion(Component) {
    // console.log('underConversion', this.underConversion);
    // console.log('component', Component);
    return this.underConversion.indexOf(Component.id) !== -1;
  }

  checkAndRemoveConversion(type, Component) {
    for (var i = 0; i < this.availableConversions.length; i++) {
      if (this.availableConversions[i].type === type && this.availableConversions[i].id === Component.id) {
        this.availableConversions.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  getCurrentType() {
    return this.nextInOrder;
  }

  getCurrentOrder(type) {
    return this.equationOrderobj[type].maxdepth;
  };

  getCurrentTypesOrder() {
    return this.equationOrderobj[this.nextInOrder].maxdepth;
  };

  // this.getAndDecreaseCurrentOrder = function(type) {
  // var currentorder = this.equationOrderobj[type].maxdepth;
  // var indexOfOrder = this.equationOrderobj[type].depths.indexOf(currentorder);
  // this.equationOrderobj[type].depths.splice(indexOfOrder, 1);
  // if (this.equationOrderobj[type].depths.length === 0) {
  // currentorder = -1;
  // } else {
  // currentorder = Math.max.apply(Math, this.equationOrderobj[type].depths);
  // }
  // this.equationOrderobj[type].maxdepth = currentorder;
  // return currentorder;
  // };

  // this.getAndDecreaseCurrentOrder2 = function() {
  // var currentorder = this.equationOrderobj[this.nextInOrder].maxdepth;
  // var indexOfOrder = this.equationOrderobj[this.nextInOrder].depths.indexOf(currentorder);
  // this.equationOrderobj[this.nextInOrder].depths.splice(indexOfOrder, 1);
  // if (this.equationOrderobj[this.nextInOrder].depths.length === 0) {
  // currentorder = -1;
  // } else {
  // currentorder = Math.max.apply(Math, this.equationOrderobj[this.nextInOrder].depths);
  // }
  // this.equationOrderobj[this.nextInOrder].maxdepth = currentorder;
  // };
}
