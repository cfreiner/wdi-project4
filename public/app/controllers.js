angular.module('WikiCtrls', ['WikiServices', 'D3Directives'])
  .controller('SearchCtrl', ['$scope', 'Article', '$window', function($scope, Article, $window) {
    $scope.results = '';
    $scope.search = function(q) {
      Article.get({q:q}, function(data) {
        $scope.data = data.words;
      });
    };
  }]);
