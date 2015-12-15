var app = angular.module('P4', ['ngRoute', 'WikiCtrls']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '/app/views/search.html',
    controller: 'SearchCtrl'
  })
  .when('/compiled', {
    templateUrl: '/app/views/compiled.html',
    controller: 'CompiledCtrl'
  })
  .otherwise({
    templateUrl: '/app/views/404.html'
  });
  $locationProvider.html5Mode(true);
}]);
