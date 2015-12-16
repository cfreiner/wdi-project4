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
    $scope.badSearchLeft = false;
    $scope.badSearchRight = false;
    $scope.cap = function(str) {
      return str.split(' ').map(function(item) {
        if(item === 'of') {
          return item;
        } else {
          return item.charAt(0).toUpperCase() + item.substr(1);
        }
      }).join(' ');
    };
    $scope.search = function(q, side) {
      q = $scope.cap(q);
      Article.get({q:q}, function(data) {
        if(side === 'left') {
          if(data.status === 400){
            $scope.badSearchLeft = true;
            return;
          }
          $scope.badSearchLeft = false;
          $scope.titleLeft = 'Article: ' + q;
          $scope.dataLeft = data.words;
          $scope.scoreLeft = 'Score: ' + data.score;
        } else if(side === 'right') {
          if(data.status === 400){
            $scope.badSearchRight = true;
            return;
          }
          $scope.badSearchLeft = false;
          $scope.titleRight = 'Article: ' + q;
          $scope.dataRight = data.words;
          $scope.scoreRight = 'Score: ' + data.score;
        }
      });
    };
  }])
  .controller('GroupCtrl', ['$scope', 'Search', function($scope, Search) {
    // $(document).ready(function() {
    //   $('select').material_select();
    // });

    // $scope.initSelect = function() {
    //   $('select').material_select();
    // };

    $scope.data = [];
    $scope.group = 'qbs';
    $scope.$watch('group', function(newVal, oldVal) {
      console.log('in watch');
      $scope.getGroup(newVal);
    });
    $scope.getGroup = function(group) {
      Search.query({name: group}, function(data) {
        $scope.data = data;
      });
    };
    $scope.setGroup = function(group) {
      $scope.group = group;
    };
  }]);
