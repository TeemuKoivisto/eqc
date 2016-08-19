EqcApp.directive("editablefield", function() {
  return {
    restrict: "E",
    template:
      "<div class='editable-math'>" +
        "<span class='mfield' id='editablefield'></span>" +
      "</div>",
    replace: true,
    scope: {
      latex: "="
    },
    link: function(scope, element, attrs) {
      var quilled;
      scope.render = function() {
        var text = document.createTextNode(scope.latex);
        var field = element.find("#editablefield")[0];
        field.appendChild(text);
        quilled = MathQuill.MathField(field);
        quilled.latex(scope.latex);
      };
      scope.render();
    }
  };
});
