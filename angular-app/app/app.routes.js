var EqcApp = angular.module("EqcApp", ["ui.router"]);

EqcApp.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

    $stateProvider
		.state("main", {
			controller: "MainController",
			templateUrl: "templates/main/main.html"
		})
    .state("main.calculate", {
			url: "/",
			controller: "CalculateController",
			templateUrl: "templates/calculate/calculate.html"
		})
});
