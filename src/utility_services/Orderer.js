export class Orderer {
  constructor() {
    this.availableConversions = [];
    this.underConversion = [];
    this.locked = [];
  }
  resetOrder() {
  }

  // this.setEquationOrder = function(Equation) {
  //   Logcal.append('Orderer setEquationOrder: Equation ' + Equation);
  //   this.resetOrder();
  //   for (var i = 0; i < Equation.leftside.length; i++) {
  //     Equation.leftside[i].setOrder(0);
  //     Equation.leftside[i].setParent(Equation);
  //   }
  //   for (var i = 0; i < Equation.rightside.length; i++) {
  //     Equation.rightside[i].setOrder(0);
  //     Equation.rightside[i].setParent(Equation);
  //   }
  // };
  //
  // this.setOrder = function(Location, Order, Component) {
  //   Logcal.append('Orderer setOrder: Location ' + Location + ' Order ' + Order + ' Component ' + Component);
  //   // console.log('component is ' + Component.type)
  //   if (Object.prototype.toString.call(Component) === '[object Array]') {
  //     for (var i = 0; i < Component.length; i++) {
  //       Component[i].order = Order;
  //       Component[i].parent = Location;
  //       Component[i].setOrder(Order - 1);
  //     }
  //   } else {
  //     Component.order = Order;
  //     Component.parent = Location;
  //     Order--;
  //     Component.setOrder(Order);
  //   }
  // };
  //
  // this.registerComponent = function(order, type, id) {
  //   if (this.orders.indexOf(order) === -1) {
  //     this.orders.push(order);
  //     this.orders.sort(function(a, b) {
  //       return b - a;
  //     });
  //   }
  //   if (this.orderobj[type] && typeof this.orderobj[type] !== 'undefined') {
  //     this.orderobj[type].depths.push({
  //       order: order,
  //       id: id
  //     });
  //   } else {
  //     this.orderobj[type] = {
  //       depths: [{
  //         order: order,
  //         id: id
  //       }]
  //     };
  //   }
  // };
  //
  // this.unregisterComponent = function(type, id) {
  //   for (var i = 0; i < this.orderobj[type].depths; i++) {
  //     if (this.orderobj[type].depths[i].id === id) {
  //       this.orderobj[type].depths.splice(i, 1);
  //     }
  //   }
  // }
  //
  // this.addUnderConversion = function(list) {
  //   Array.prototype.push.apply(this.underConversion, list);
  // }
  //
  // this.isUnderConversion = function(Component) {
  //   // console.log('underConversion', this.underConversion);
  //   // console.log('component', Component);
  //   return this.underConversion.indexOf(Component.id) !== -1;
  // }
  //
  // this.checkAndRemoveConversion = function(type, Component) {
  //   for (var i = 0; i < this.availableConversions.length; i++) {
  //     if (this.availableConversions[i].type === type && this.availableConversions[i].id === Component.id) {
  //       this.availableConversions.splice(i, 1);
  //       return true;
  //     }
  //   }
  //   return false;
  // }
  //
  // this.getCurrentType = function() {
  //   return this.nextInOrder;
  // };
  //
  // this.getCurrentOrder = function(type) {
  //   return this.equationOrderobj[type].maxdepth;
  // };
  //
  // this.getCurrentTypesOrder = function() {
  //   return this.equationOrderobj[this.nextInOrder].maxdepth;
  // }
}

export default new Orderer();
