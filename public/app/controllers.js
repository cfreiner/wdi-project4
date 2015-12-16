angular.module('WikiCtrls', ['WikiServices', 'D3Directives'])
  .controller('SearchCtrl', ['$scope', 'Article', '$window', function($scope, Article, $window) {
    $scope.badSearch = false;
    $scope.cap = function(str) {
      return str.split(' ').map(function(item) {
        if(item === 'of') {
          return item;
        } else {
          return item.charAt(0).toUpperCase() + item.substr(1);
        }
      }).join(' ');
    };
    $scope.search = function(q) {
      q = $scope.cap(q);
      Article.get({q:q}, function(data) {
        if(data.status === 400){
          $scope.badSearch = true;
          return;
        }
        $scope.badSearch = false;
        $scope.title = 'Article: ' + q;
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
  }])
  .controller('VersusCtrl', ['$scope', 'Article', function($scope, Article) {
    $scope.search = function(q, side) {
      Article.get({q:q}, function(data) {
        if(side === 'left') {
          $scope.titleLeft = 'Article: ' + q;
          $scope.dataLeft = data.words;
          $scope.scoreLeft = 'Score: ' + data.score;
        } else if(side === 'right') {
          $scope.titleRight = 'Article: ' + q;
          $scope.dataRight = data.words;
          $scope.scoreRight = 'Score: ' + data.score;
        }
      });
    };
  }]);
