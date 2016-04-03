MathComponents.factory('MathOperation', function(MathObject, Orderer, Logger, IDG) {
  var operation = function Operation(factorone, type, factortwo) {
    this.id = IDG.nextId();

    //        this.setType = "Operation";
    this.type = "Operation";

    this.firstfactor = factorone;
    this.operation = type === '(' ? '*' : type;
    this.secondfactor = factortwo;
    this.reduced = false;
    this.isfraction = this.operation === '/';
    this.minussign = false;

    this.parent = null;
    this.order = -1;
    this.exponent = "";

    this.setExponent = function(exponent) {
      this.exponent = exponent;
    };

    this.setParent = function(MathComponent) {
      this.parent = MathComponent;
    }

    this.setOrder = function(order) {
      // console.log('ordering op ' + order);
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

    this.returnContentList = function() {
      var list = [];
      if (this.reduced && this.isfraction) {
        list.push.apply(list, this.firstfactor.returnContentList());
      } else {
        list.push(this);
      }
      return list;
    };

    this.swapFactors = function() {
      var first = this.firstfactor;
      this.firstfactor = this.secondfactor;
      this.secondfactor = first;
    }

    this.switchSign = function() {
      if (this.secondfactor.minussign && !this.firstfactor.minussign) {
        this.secondfactor.switchSign();
      } else if (!this.secondfactor.minussign && this.firstfactor.minussign) {
        this.firstfactor.switchSign();
      } else if (this.secondfactor.minussign && this.firstfactor.minussign) {
        throw ("both factors are minussign in operation" + this);
        // cancels each other out so only switching this minussign? same as both not minussign
      }
      this.minussign = !this.minussign;
    };

    this.isEqual = function(MathObject) {
      if (MathObject.isOperation()) {
        if (this.isfraction === MathObject.isfraction) {
          //                    this.log.push("operation " + this + this.firstfactor.isEqual(MathObject.firstfactor) && this.secondfactor.isEqual(MathObject.secondfactor));
          //                    console.log("dd" + this.firstfactor.isEqual(MathObject.firstfactor) && this.secondfactor.isEqual(MathObject.secondfactor));
          return this.firstfactor.isEqual(MathObject.firstfactor) && this.secondfactor.isEqual(MathObject.secondfactor);
        }
      }
      return false;
    };

    this.isTerm = function() {
      return false;
    };
    this.isOperation = function() {
      return true;
    };
    this.isBracketed = function() {
      return false;
    };
    this.isSpecial = function() {};

    this.isEmpty = function() {
      return this.firstfactor.isEmpty() && this.secondfactor.isEmpty();
    }

    this.includesVariable = function(Variable) {
      return this.firstfactor.includesVariable(Variable) || this.secondfactor.includesVariable(Variable);
    };

    this.toOrder = function() {
      var latex = "" + this.order + "o\\left[";
      if (this.operation === '*') {
        latex += this.firstfactor.toOrder() + "\\cdot " + this.secondfactor.toOrder();
      } else {
        latex += "\\frac{" + this.firstfactor.toOrder() + "}{" + this.secondfactor.toOrder() + "}";
      }
      latex += "\\right]";
      if (this.exponent) {
        latex += "^{";
        latex += this.exponent.toOrder();
        latex += "}";
      }
      return latex;
    };

    this.toLatex = function() {
      var latex = this.minussign ? "-" : "";
      if (this.operation === '*') {
        latex += this.firstfactor.toLatex() + "\\cdot " + this.secondfactor.toLatex();
        //            } else if (this.operation === '(') {
        //                // luultavasti tarkoittaa lausekkeita, jolloin lausekkeen toLatex palauttaa sulut
        ////                return this.firstfactor.toLatex() + "\\left(" + this.secondfactor.toLatex();
        //                return this.firstfactor.toLatex() + this.secondfactor.toLatex();
      } else {
        // sulut n�ytt�� rumilta jos jakolasku. jos minus sulut s�ilyy
        var first = this.firstfactor.isBracketed() ? this.firstfactor.toLatexWithoutBrackets() : this.firstfactor.toLatex();
        var second = this.secondfactor.isBracketed() ? this.secondfactor.toLatexWithoutBrackets() : this.secondfactor.toLatex();
        latex += "\\frac{" + first + "}{" + second + "}";
      }
      if (this.exponent) {
        latex += "^{";
        if (this.exponent.isBracketed()) {
          latex += this.exponent.toLatexWithoutBrackets();
        } else {
          latex += this.exponent.toLatex();
        }
        latex += "}";
      }
      return latex;
    };

    this.toString = function() {
      var string = this.minussign ? "-" : "";
      string += this.firstfactor.toString() + this.operation + this.secondfactor.toString();
      if (this.exponent) {
        string += "^{" + this.exponent.tostring() + "}";
      }
      return string;
    }
  }

  return operation;
});
