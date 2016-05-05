EqcApp.directive('mathfield', function($interval) {
  return {
    restrict: 'E',
    template: '<div>\n' +
      '<span id="leftside"></span>\n' +
      '<span id="equalssign"></span>\n' +
      '<span class="rightside" id="rightside"></span>\n' +
      '</div>',
    replace: true,
    scope: {
      field: '=',
      recreate: '&'
    },
    link: function(scope, element, attrs, ngModel) {
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
        if (scope.field.type === 'embedded-editable') {
          $(leftfield).addClass("embedded");
          $(rightfield).addClass("editable");
        } else if (scope.field.type === 'editable-editable') {
          $(leftfield).addClass("editable");
          equalsfield.appendChild(equalstext);
          $(equalsfield).addClass("embedded");
          $(rightfield).addClass("editable");
        } else if (scope.field.type === 'editable') {
          $(rightfield).addClass("editable");
        } else if (scope.field.type === 'embedded') {
          $(rightfield).addClass("embedded")
        } else {
          equalstext = document.createTextNode("undefined type");
          equalsfield.appendChild(equalstext);
          $(equalsfield).addClass("editable");
        }

        $(element).find("span.editable").each(function(index) {
          //                    console.log($(this).attr('id'));
          var field = MathQuill.MathField(this, {
            //                    spaceBehavesLikeTab: true,
            //                    leftRightIntoCmdGoes: 'up',
            //                    restrictMismatchedBrackets: true,
            //                    sumStartsWithNEquals: true,
            //                    supSubsRequireOperand: true,
            //                    charsThatBreakOutOfSupSub: '+-=<>',
            ////                autoSubscriptNumerals: true,
            //                    autoCommands: 'pi theta sqrt sum',
            //                    autoOperatorNames: 'sin cos etc',
            //                    substituteTextarea: function () {
            //                        return document.createElement('textarea');
            //                    },
            handlers: {
              enter: function() {
                leftquill.latex('heei');
                leftquill.revert();
                //                            console.log("asfd", mathq.latex());
                //                            console.log(scope.field.assignment);
              }
            }
          });
          leftquill = $(this).attr('id') === 'leftside' ? field : leftquill;
          rightquill = $(this).attr('id') === 'rightside' ? field : rightquill;
        });

        $(element).find("span.embedded").each(function() {
          var field = MathQuill.StaticMath(this);
          leftquill = $(this).attr('id') === 'leftside' ? field : leftquill;
          rightquill = $(this).attr('id') === 'rightside' ? field : rightquill;
        });
      };

      setTypeAndCreate();
      //            scope.$watch(function() { console.log("asdf");}, function () {
      //                console.log("watch triggered");
      //            })

      //            scope.$watch(ngModel, function () {
      //                console.log("ng model", ngModel);
      //            })
      var types = ['editable-editable', 'editable', 'embedded-editable'];
      scope.$watch('field', function(newVal, oldVal) {
        //                console.log("watch triggered", oldVal, newVal);
        //                console.log("ja indexof " + types.indexOf(newVal.type));
        if (oldVal.type !== newVal.type && types.indexOf(newVal.type) !== -1) {
          if (typeof rightquill !== "undefined") {
            rightquill.revert();
          }
          if (typeof leftquill !== "undefined") {
            leftquill.revert();
          }
          setTypeAndCreate();
          //                    return;
        }
        if (typeof rightquill !== "undefined") {
          rightquill.latex(scope.field.rightside);
        }
        if (typeof leftquill !== "undefined") {
          leftquill.latex(scope.field.leftside);
        }
      }, true);

      //            var latexWatcher = $interval(function () {
      ////                console.log("ea", typeof rightquill);
      //                if (typeof rightquill !== "undefined") {
      ////                    console.log(rightquill.latex() + " and " + scope.field.rightside);
      //                    rightquill.latex(scope.field.rightside);
      //                }
      //                if (typeof leftquill !== "undefined") {
      ////                    console.log(leftquill.latex() + " and " + scope.field.leftside);
      //                    leftquill.latex(scope.field.leftside);
      //                }
      //            }, 500);
      //            scope.$on('$destroy', function () {
      //                $interval.cancel(latexWatcher);
      //            });
    }
  };
});
