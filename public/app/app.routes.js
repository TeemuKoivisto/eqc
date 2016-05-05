var EqcApp = angular.module("EqcApp", ["ui.router"]);

EqcApp.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

    $stateProvider
		// .state("main", {
		// 	url: "/",
		// 	controller: "MainController",
		// 	templateUrl: "app/components/main/main.html"
		// })
    .state("calculate", {
			url: "/",
			controller: "CalculateController",
			templateUrl: "app/components/calculate/calculate.html"
		})
});
