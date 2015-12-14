angular.module('WikiServices', ['ngResource'])
  .factory('Article', ['$resource', function($resource) {
    return $resource('/api/search/');
  }])
