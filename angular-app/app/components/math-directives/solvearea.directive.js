EqcApp.directive("solvearea", function() {
  return {
    restrict: "E",
    templateUrl: "templates/math-directives/solvearea.html",
    scope: {
      type: "=",
      solved: "=",
      solvefields: "="
    },
    controller: function($scope) {
      $scope.solveinfos = [];

      // for solvefield
      this.getType = function() {
        return $scope.type;
      }

      this.setFieldOrder = function() {
        for (var i = 0; i < $scope.solvefields.length; i++) {
          $scope.solvefields[i].order = i;
        }
        $scope.$apply();
      };

      this.createSolvefield = function(order) {
        console.log("createSolvefield");
        if ($scope.solvefields.length < 15) {
          $scope.solvefields.splice(order + 1, 0, {
            order: order + 1,
            type: $scope.solvefields[order].type,
            leftside: $scope.solvefields[order].leftside,
            rightside: $scope.solvefields[order].rightside,
            solution: $scope.solvefields[order].solution,
            solved: ""
          });
          this.setFieldOrder();
        }
      };

      this.removeSolvefield = function(order) {
        console.log("removeSfield");
        if ($scope.solvefields.length > 1) {
          $scope.solvefields.splice(order, 1);
          this.setFieldOrder();
        }
      };

      // this is so fail... x_x
      // $scope doesn"t know directive and can"t use the regular solveExercise
      // as it is not recognized by the template
      var context = this;
      $scope.solve = function(order) {
        context.solveExercise(order);
      }

      $scope.$on("solve", function(event, data) {
        // console.log("event kaapattu", data);
        $scope.solve(0);
        data.resolve();
      })

      this.solveExercise = function(order) {
        Logdef.timerStart("solveExercise");
        console.log("solving " + order);
        if ($scope.type === "solve") {
          var solved = "true";
          for (var i = 0; i < $scope.solvefields.length; i++) {
            if ($scope.solvefields[i].type === "editable") {
              // if (i !== $scope.solvefields.length-1 || $scope.solvefields[i].solution.combinations.length === 0) {
              var latex = $scope.solvefields[i].rightside;
              // if ($scope.solvefields[i].rightside.indexOf("=") === -1) {
              // // latex += "=" + $scope.solvefields[i].rightside;
              // latex += $scope.solvefields[i].rightside;
              // } else {
              // latex = $scope.solvefields[i].rightside;
              // }

              /*var result = CalculatorSolver.checkEquationIsSolution(latex, $scope.solvefields[i].solution);*/
              console.log(eqc)
              var equation = eqc.Parser.parseEquation(latex);
              console.log(equation.toLatex())
              var result = "";

              if (result !== "false") {
                $scope.solvefields[i].solved = result;
                solved = result;
              } else {
                $scope.solvefields[i].solved = result;
                solved = result;
                break;
              }
              // } else {
              // // last solvefield, should be at least one correct combination
              // var result = CalculatorSolver.checkEquationIsSolution($scope.solvefields[i].rightside, $scope.solvefields[i].solution);
              // $scope.solvefields[i].solved = result;
              // solved = result;
              // }
            }
          }
          if ($scope.solved !== "true") {
            $scope.solved = solved;
          }
        } else if ($scope.type === "check") {
          // solves the latex inside mathquill editable and compares to
          // solvefield"s solution value
          // console.log("what fucking is solvefield ", $scope.solvefields[order]);
          var equation = $scope.solvefields[order].leftside;
          equation += $scope.solvefields[order].type === "editable-editable" ? "=" : "";
          equation += $scope.solvefields[order].rightside;
          // console.log("checking " + equation);

          /*var result = CalculatorSolver.checkEquationIsSolution(equation, $scope.solvefields[order].solution);*/
          var result = "";
          // var result = CalculatorSolver.checkStuff(equation, $scope.solvefields[order].solution);
          // console.log("result is " + result);

          $scope.solvefields[order].solved = result;
          if ($scope.solved !== "true" && result === "true") {
            $scope.solved = "true";
          } else if ($scope.solved !== "true") {
            $scope.solved = result;
          }
        } else if ($scope.type === "show") {
          // solves equation and shows each step
          var equation = $scope.solvefields[order].leftside;
          equation += $scope.solvefields[order].type === "editable-editable" ? "=" : "";
          equation += $scope.solvefields[order].rightside;
          console.log("showing " + equation);

          /*var solutionlist = CalculatorSolver.solveEquationLogged(equation);*/
          var solutionlist = [];
          if (solutionlist.length > 0) {
            this.replaceFieldsWithSolution(solutionlist);
          }
        }
        Logdef.timerEnd("solveExercise");
      };

      this.replaceFieldsWithSolution = function(solutionlist) {
        // console.log("replacing stuff");
        console.log("", solutionlist)
        var newlist = [],
          infos = [];
        for (var i = 0; i < solutionlist.length; i++) {
          newlist.push({
            order: i,
            type: "editable",
            // ei tukea embedded editablella jne. koska latexia ei ole jaettu
            leftside: "",
            rightside: solutionlist[i].latex,
            solution: $scope.solvefields[0].solution,
            solved: ""
          });
          infos.push({
            step: solutionlist[i].stepName,
            formula: solutionlist[i].formula
          });
        }
        $scope.solvefields = newlist;
        $scope.solveinfos = infos;
        //console.log($scope.solveinfos);
      }
    }
  }
});

EqcApp.directive("solvefield", function($interval) {
  return {
    restrict: "E",
    templateUrl: "templates/math-directives/solvefield.html",
    replace: true,
    scope: {
      field: "="
    },
    require: "^solvearea",
    link: function(scope, element, attrs, solveareaCtrl) {
      var commands = [{
        types: "check-solve-show",
        keys: "Enter",
        command: "solveExercise",
        args: 1
      }, {
        types: "solve",
        keys: "Shift-Enter",
        command: "createSolvefield",
        args: 1
      }, {
        types: "solve",
        keys: "Shift-Backspace",
        command: "removeSolvefield",
        args: 1
      }];

      var lefttext = document.createTextNode(scope.field.leftside);
      var equalstext = document.createTextNode("=");
      var righttext = document.createTextNode(scope.field.rightside);
      var leftfield = element.find("#leftside")[0];
      var equalsfield = element.find("#equalssign")[0];
      var rightfield = element.find("#rightside")[0];
      var leftquill, rightquill;

      leftfield.appendChild(lefttext);
      rightfield.appendChild(righttext);

      var setTypeAndCreate = function() {
        if (scope.field.type === "embedded-editable") {
          leftfield.className = "embedded";
          rightfield.className = "editable";
        } else if (scope.field.type === "editable-editable") {
          leftfield.className = "editable";
          equalsfield.appendChild(equalstext);
          equalsfield.className = "embedded";
          rightfield.className = "editable";
        } else if (scope.field.type === "editable") {
          rightfield.className = "editable";
        } else {
          equalstext = document.createTextNode("undefined type");
          equalsfield.appendChild(equalstext);
          equalsfield.className = "editable";
        }
        var start = performance.now();
        Logdef.timerStart("solvefield MathField each")
          // element.find().
        $(element).find("span.editable").each(function(index) {
          var field = MathQuill.MathField(this, {
            spaceBehavesLikeTab: true,
            capturingKeyEvents: true,
            handlers: {
              captureKeyEvent: function(special) {
                refresh();
                for (var i = 0; i < commands.length; i++) {
                  // commands[i].types.indexOf(solveareaCtrl.type)
                  if (commands[i].types.indexOf(solveareaCtrl.getType()) !== -1 && commands[i].keys === special.key) {
                    console.log("executing command " + commands[i].command);
                    //                                if (commands[i].args !=)
                    // console.log("executing from ", scope.field);
                    special.evt.preventDefault();
                    solveareaCtrl[commands[i].command](scope.field.order);
                    scope.$apply();
                  }
                }
              },
              afterCaptureKeyEvent: function() {
                refresh();
              }
            }
          });
          leftquill = $(this).attr("id") === "leftside" ? field : leftquill;
          rightquill = $(this).attr("id") === "rightside" ? field : rightquill;
        });
        Logdef.timerEnd("solvefield MathField each")

        $(element).find("span.embedded").each(function() {
          var field = MathQuill.StaticMath(this);
          leftquill = $(this).attr("id") === "leftside" ? field : leftquill;
          rightquill = $(this).attr("id") === "rightside" ? field : rightquill;
        });
      };

      setTypeAndCreate();

      var refresh = function() {
        if (leftquill) {
          scope.field.leftside = leftquill.latex();
        }
        if (rightquill) {
          scope.field.rightside = rightquill.latex();
        }
      }
    }
  }
});
