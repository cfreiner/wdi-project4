angular.module('WikiServices', ['ngResource'])
  .factory('Article', ['$resource', function($resource) {
    return $resource('/api/search/');
  }])
  .factory('Word', ['$resource', function($resource) {
    return $resource('/api/words/');
  }]);
