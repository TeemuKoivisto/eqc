EqcApp.controller("CalculateController", function($scope) {

  $scope.latex = "1+2+3=34";
  $scope.solvefields = [{
    order: 0,
    type: "editable",
    leftside: "",
    rightside: "3\\left(3+4\\right)-\\frac{3}{5}=2n",
    solution: {
      result: "true",
      variables: [{
        key: "n",
        solutions: ["10.2"]
      }],
      combinations: [
        "n=10.2"
      ]
    },
    solved: ""
  }]
});
