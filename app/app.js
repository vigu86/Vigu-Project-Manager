var viguProjectManager = angular.module("ViguProjectManager", ['ngRoute']);

viguProjectManager.config(['$routeProvider', function($routeProvider) {

	$routeProvider
		.when('/projects', {
			templateUrl: 'views/projects/projects.html',
			controller: 'projectsCtrl'
		})
		.when('/timesheets', {
			templateUrl: 'views/timesheets/timesheets.html',
			controller: 'timesheetsCtrl'
		})
		.otherwise({
			redirectTo: '/projects'
		});

}]);
