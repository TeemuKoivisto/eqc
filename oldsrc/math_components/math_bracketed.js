MathComponents.factory("MathBracketed", function(MathObject, MathTerm, MathOperation, Orderer, Logger, IDG) {
      var bracketed = function Bracketed(contentlist) {
        // inherits MathObject"s methods and variables
        this.id = IDG.nextId();
        this.type = "Bracketed";

        this.content = contentlist;
        this.reduced = false;
        this.minussign = false;

        this.parent = null;
        this.order = -1;
        this.exponent = "";

        this.setExponent = function(exponent) {
          this.exponent = exponent;
        };

        this.checkIfBracketsNeeded = function() {
          return (this.exponent || this.minussign || this.content.length !== 1);
        };

        this.addContentList = function(list) {
          this.content.push.apply(this.content, list);
        };

        this.setContent = function(list) {
          this.content = list;
        };

        this.setParent = function(MathComponent) {
          this.parent = MathComponent;
        }

        this.setOrder = function(order) {
          order++;
          this.order = order;
          Orderer.registerComponent(order, "Bracketed");
          for (var i = 0; i < this.content.length; i++) {
            this.content[i].setOrder(order);
          }
          if (this.exponent && this.exponent.length !== 0) {
            this.exponent.setOrder(order);
            //Orderer.registerComponent(order, "Exponent");
          }
        };

        this.reduceAndReturnIfPossible = function() {
          if (!this.checkIfBracketsNeeded()) {
            return this.content[0];
          }
          return this;
        };

        this.returnContentList = function() {
          var list = [];
          for (var i = 0; i < this.content.length; i++) {
            list.push.apply(list, this.content[i].returnContentList());
          }
          return list;
        };

        this.switchSign = function() {
          this.minussign = !this.minussign;
        };

        this.multiply = function(MathObject) {
          // (3-x)*7
          if (MathObject.isTerm()) {
            var success = true;
            for (var i = 0; i < this.content.length; i++) {
              if (this.content[i].multiply(MathObject) === false) {
                throw ("bracketed"
                  s multiply failed.ja mahdoton korjata jo kerrottuja ");
                  success = false;
                }
              }
              return success;
            }
            // (3+x)*3/5        (3+x)*3*3 >> ((l * t)la * t)
            // ainoa vaihtoehto siis, että jo supistettu laskutoimitus?
            if (MathObject.isOperation()) {
              // reverse operation and multiply operation with bracketed?
              // then add the result into content which bracketed returns with returnContentList
              var success = MathObject.multiply(this);
              if (success === false) throw ("unable to reverse bracketed multiply and multiply the operation");
              this.content = [];
              this.content.push.apply(this.content, MathObject.returnContentList());
              return success;
            }
            // (3+x)(3+x)
            if (MathObject.isBracketed()) {
              var success = true;
              var result = [];
              for (var i = 0; i < this.content.length; i++) {
                for (var j = 0; j < MathObject.content.length; j++) {
                  var copy = jQuery.extend(true, {}, this.content[i]);
                  if (copy.multiply(MathObject.content[j]) == false) {
                    success = false;
                    throw ("failure in multiplying bracketed with bracketed. not fatal though. just weird.");
                  }
                  result.push(copy);
                }
              }
              this.content = result;
              return success;
            }
            return false;
          };

          this.divide = function(MathObject) {
            // tämä on hyvin jännä...
            // periaatteessa vain yhden termin lauseke voidaan jakaa
            // tai jakajan on oltava täysin sama
            // tai sitten supistuu jonkin verran
            //
            // (3-x)/7
            if (MathObject.isTerm()) {
              var success = true;
              for (var i = 0; i < this.content.length; i++) {
                if (this.content[i].divide(MathObject) === false) {
                  throw ("bracketed"
                    s divide failed.unable to reverse.maybe use clone ? ");
                    success = false;
                  }
                }
                return success;
                // enta jos (3+x)/3x >> 1/x + 1/3
              }
              // (3-x)/(2/(x+8)) >> l / l >> getSisalto >> l / la
              // wolframin mukaan >> 1/2((3-x)(x+8)) = 1
              if (MathObject.isOperation()) {
                var multiplier = new MathOperation(new MathTerm("", 1, 0, 0), "/", MathObject.firstfactor);
                //                kertoja.supista(); // jos kertoja onkin lauseke niin nyt ei 1/(x+1) hajota kaikkea
                multiplier.reduce() // ?
                this.multiply(MathObject.secondfactor);
                this.multiply(multiplier);
                return true;
              }
              // (3+x)/(3+x)
              if (MathObject.isBracketed()) {
                // nyt jaetaan vain täysin samanlaiset puolet
                // voisi lisätä myös >> (x+2x^2)/(1+2x) >> =2
                if (this.isEqual(MathObject)) {
                  this.content = [];
                  this.content.push(new MathTerm("", 1, 0, 0));
                } else {
                  return false;
                }
              }
              return false;
            };

            this.isEqual = function(MathObject) {
              // TODO crappy and unnecessary deep cloning
              // use array with checked indexes or something
              if (MathObject.isBracketed()) {
                var newObject = jQuery.extend(true, {}, MathObject);
                for (var i = 0; i < this.content.length; i++) {
                  var check = false;
                  for (var j = 0; j < newObject.content.length; j++) {
                    if (this.content[i].isEqual(newObject.content[j])) {
                      newObject.content.splice(j, 1);
                      check = true;
                      break;
                    }
                  }
                  if (!check) return false;
                }
                return newObject.content.length === 0;
              } else {
                return false;
              }
            };

            this.isTerm = function() {
              return false;
            };
            this.isOperation = function() {
              return false;
            };
            this.isBracketed = function() {
              return true;
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

            this.toLatexWithoutBrackets = function() {
              var latex = this.minussign ? "-\\left(" : "";
              if (this.exponent) {
                latex += "\\left("
              }
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
              if (this.minussign || this.exponent) {
                latex += "\\right)";
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

            this.toLatex = function() {
              var latex = this.minussign ? "-\\left(" : "\\left(";
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
              latex += "\\right)";
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
          return bracketed;
        });
