angular.module('WikiCtrls', ['WikiServices'])
  .controller('SearchCtrl', ['$scope','Article', function($scope, Article) {
    $scope.results = '';
    $scope.search = function(q) {
      Article.query({q:q}, function(data) {
        $scope.results = data;
      });
    };
  }]);
