var app = angular.module('P4', ['ngRoute', 'WikiCtrls']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '/app/views/search.html',
    controller: 'SearchCtrl'
  })
  .when('/words', {
    templateUrl: '/app/views/words.html',
    controller: 'WordCtrl'
  })
  .when('/versus', {
    templateUrl: '/app/views/versus.html',
    controller: 'VersusCtrl'
  })
  .otherwise({
    templateUrl: '/app/views/404.html'
  });
  $locationProvider.html5Mode(true);
}]);
