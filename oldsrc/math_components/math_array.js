MathComponents.factory("MathArray", function(MathObject, MathTerm, MathOperation, Orderer, Logger, IDG) {
  var marray = function MathArray(contentlist) {
    // inherits MathObject"s methods and variables
    this.id = IDG.nextId();
    this.type = "MathArray";

    this.content = contentlist;
    this.reduced = false;
    this.minussign = false;

    this.parent = null;
    this.order = -1;
    // this.exponent = "";

    // this.setExponent = function(exponent) {
    // this.exponent = exponent;
    // };

    this.getContent = function() {
      return this.content;
    }

    this.setContent = function(list) {
      this.content = list;
    };

    this.setParent = function(MathComponent) {
      this.parent = MathComponent;
    }

    this.setOrder = function(order) {
      order++;
      // this.order = order;
      // Orderer.registerComponent(order, "Bracketed");
      for (var i = 0; i < this.content.length; i++) {
        this.content[i].setOrder(order);
        this.content[i].setParent(this);
      }
      // if (this.exponent && this.exponent.length !== 0) {
      // this.exponent.setOrder(order);
      // //Orderer.registerComponent(order, "Exponent");
      // }
    };

    this.switchSign = function() {
      for (var i = 0; i < this.content.length; i++) {
        this.content[i].switchSign();
      }
    };

    // this.isEqual = function(MathObject) {
    // if (MathObject.isBracketed()) {
    // var newObject = jQuery.extend(true, {}, MathObject);
    // for (var i = 0; i < this.content.length; i++) {
    // var check = false;
    // for (var j = 0; j < newObject.content.length; j++) {
    // if (this.content[i].isEqual(newObject.content[j])) {
    // newObject.content.splice(j, 1);
    // check = true;
    // break;
    // }
    // }
    // if (!check) return false;
    // }
    // return newObject.content.length===0;
    // } else {
    // return false;
    // }
    // };

    this.isTerm = function() {
      return false;
    };
    this.isOperation = function() {
      return false;
    };
    this.isBracketed = function() {
      return false;
    };
    this.isSpecial = function() {
      return false;
    };

    this.isEmpty = function() {
      return this.content.length === 0;
    };
    this.includesVariable = function(Variable) {
      for (var i = 0; i < this.content.length; i++) {
        if (this.content[i].includesVariable(Variable)) {
          return true;
        }
      }
      return false;
    };

    this.toOrder = function() {
      var latex = "" + this.order + "b\\left(";
      for (var index in this.content) {
        latex += this.content[index].toOrder() + " ";
      }
      latex += "\\right)";
      if (this.exponent) {
        latex += "^{";
        latex += this.exponent.toOrder();
        latex += "}";
      }
      return latex;
    };

    this.toLatex = function() {
      var latex = "";
      for (var i = 0; i < this.content.length; i++) {
        if (this.content[i].minussign) {
          latex += this.content[i].toLatex();
        } else {
          if (i !== 0) {
            latex += "+";
          }
          latex += this.content[i].toLatex();
        }
      }
      return latex;
    };

    this.toString = function() {
      var string = this.minussign ? "-(" : "(";
      for (var i = 0; i < this.content.length; i++) {
        string += this.content[i];
        if ((!this.content[i].isBracketed()) && i != this.content.length - 1) {
          string += " ";
        }
      }
      string += ")";
      if (this.exponent) {
        string += "^{" + this.exponent.toString() + "}";
      }
      return string;
    };
  };
  return marray;
});
