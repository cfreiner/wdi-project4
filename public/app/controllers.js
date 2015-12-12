angular.module('WikiCtrls', ['WikiServices'])
  .controller('SearchCtrl', ['$scope','Article', function($scope, Article) {
    $scope.search = function(q) {
      Article.query({q:q}, function(data) {

      })
    }
  }]);
