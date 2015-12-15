angular.module('WikiCtrls', ['WikiServices', 'D3Directives'])
  .controller('SearchCtrl', ['$scope', 'Article', '$window', function($scope, Article, $window) {
    $scope.score;
    $scope.title;
    $scope.search = function(q) {
      $scope.title = 'Article: ' + q;
      Article.get({q:q}, function(data) {
        $scope.data = data.words;
        $scope.score = 'Score: ' + data.score;
      });
    };
  }])
  .controller('WordCtrl', ['$scope', 'Word', function($scope, Word) {
    $scope.words = [];
    $scope.score = 0;
    Word.query(function success(data) {
      $scope.words = data;
    }, function error(data) {
      console.log('Error: ', data);
    });
  }]);
