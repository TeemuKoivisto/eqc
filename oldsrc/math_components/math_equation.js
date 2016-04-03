MathComponents.factory('MathEquation', function(MathArray, Logger) {
  var equation = function Equation() {
    this.type = "Equation";

    this.leftside = [];
    this.rightside = [];

    this.larray = new MathArray([]);
    this.rarray = new MathArray([]);

    this.setOrder = function(order) {
      throw ('not finished')
        // for (var i = 0; i < this.leftside.length; i++) {
        // this.leftside[i].setOrder();
        // }

      for (var i = 0; i < this.leftside.length; i++) {
        this.leftside[i].setOrder(order);
        this.leftside[i].setParent(this);
      }
      for (var i = 0; i < this.rightside.length; i++) {
        this.rightside[i].setOrder(order);
        this.rightside[i].setParent(this);
      }

      // this.larray.setOrder(order);
      // this.larray.setParent(this);
      // this.rarray.setOrder(order);
      // this.rarray.setParent(this);
    }

    this.moveSide = function(side) {
      if (side === 'left') {
        Array.prototype.push.apply(this.larray.getContent(), this.rarray.getContent());
        this.rarray.setContent([]);
      } else if (side === 'right') {
        Array.prototype.push.apply(this.rarray.getContent(), this.larray.getContent());
        this.larray.setContent([]);
      }
    }

    this.getLeftside = function() {
      return this.larray;
    }

    this.getRightside = function() {
      return this.rarray;
    }

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
      return true;
    };

    // this.cancelOutEquals = function () {
    // for (var i = 0; i < this.leftside.length; i++) {
    // for (var j = 0; j < this.rightside.length; j++) {
    // //                    console.log("comparing" + this.leftside[i] + ":" + this.rightside[j]);
    // if (this.leftside[i].isEqual(this.rightside[j])) {
    // this.log.push("Canceling " + this.leftside[i].toString());
    // this.process.push(this.toLatex());
    // this.leftside.splice(i, 1);
    // this.rightside.splice(j, 1);
    // j = -1;
    // if (this.leftside.length === 0 || this.rightside.length === 0) {
    // return;
    // }
    // }
    // }
    // }
    // }

    this.moveAllToLeftside = function() {
      for (var i = 0; i < this.rightside.length; i++) {
        this.rightside[i].switchSign();
      }
      this.leftside.push.apply(this.leftside, this.rightside);
      this.rightside = [];
    }

    this.sort = function() {

    }

    this.isEqual = function(equation) {
      function checkSide(side1, side2) {
        if (side1.length > 0) {
          for (var i = 0; i < side1.length; i++) {
            var found = false;
            for (var j = 0; j < side2.length; j++) {
              if (side1[i].isEqual(side2[j])) {
                found = true;
              }
            }
            if (!found) return false;
          }
        }
        return true;
      }
      if (this.leftside.length === equation.leftside.length && this.rightside.length === equation.rightside.length) {
        if (!checkSide(this.leftside, equation.leftside)) return false;
        if (!checkSide(this.rightside, equation.rightside)) return false;
        return true;
      }
    };

    this.toOrder = function() {
      var latex = "";
      var latexSide = function(side) {
        for (var i = 0; i < side.length; i++) {
          latex += side[i].toOrder() + " ";
        }
      };
      latexSide(this.leftside);
      latex += '=';
      latexSide(this.rightside);
      return latex;
    }

    // this.toLatex = function() {
    // var latex = this.larray.toLatex() + '=' + this.rarray.toLatex();
    // return latex;
    // }

    this.toLatex = function() {
      var latex = "";
      var latexSide = function(side) {
        for (var i = 0; i < side.length; i++) {
          if (side[i].minussign) {
            //if (!side[i].isTerm()) {
            //    string += "-";
            //}
            latex += side[i].toLatex();
          } else {
            if (i !== 0) {
              latex += "+";
            }
            latex += side[i].toLatex();
          }
        }
      }
      latexSide(this.leftside);
      latex += '=';
      latexSide(this.rightside);
      return latex;
    }

    this.toType = function() {
      var string = "";
      var typeSide = function(side) {
        for (var i = 0; i < side.length; i++) {
          string += (i !== 0 && !side[i].minussign) ? '+' : '';
          string += (side[i].minussign) ? '-' : '';
          string += side[i].type;
        }
      }
      typeSide(this.leftside);
      string += ' = ';
      typeSide(this.rightside);
      return string;
    }

    this.toString = function() {
      var string = "";
      var stringSide = function(side) {
        for (var i = 0; i < side.length; i++) {
          if (!side[i].minussign && i !== 0) {
            string += "+";
          }
          string += side[i].toString();
        }
      }
      stringSide(this.leftside);
      string += ' = ';
      stringSide(this.rightside);
      return string;
    }
  }

  return equation;
})
