angular.module('WikiCtrls', ['WikiServices', 'D3Directives'])
  .controller('SearchCtrl', ['$scope', 'Article', '$window', function($scope, Article, $window) {
    $scope.badSearch = false;
    $scope.cap = function(str) {
      return str.split(' ').map(function(item) {
        if(item === 'of' || item === 'the' || item.indexOf(')') !== -1) {
          return item;
        } else {
          return item.charAt(0).toUpperCase() + item.substr(1);
        }
      }).join(' ');
    };
    $scope.search = function(q) {
      q = $scope.cap(q);
      Article.get({q:q}, function(data) {
        $scope.badSearch = false;
        $scope.title = 'Article: ' + q;
        $scope.data = data.words;
        $scope.score = 'Score: ' + data.score;
      }, function(error) {
        $scope.badSearch = true;
        return;
      });
    };

    $scope.texttyping = ['Enter the title of a Wikipedia article to see how <span class="pos">positive</span> or <span class="neg">negative</span> the tone of the article is. Higher scores indicate more positive sentiment.'];
    //TypedJS
    $(function() {
       $(document.getElementById("create-text")).typed({
         strings: $scope.texttyping,
         typeSpeed: 20,
         startDelay: 1000,
         contentType: "html",
         showCursor: false,
         backDelay: 1000,
         backSpeed: 0,
         cursorChar: " :"
       });
     });

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
          $scope.badSearchLeft = false;
          $scope.titleLeft = 'Article: ' + q;
          $scope.dataLeft = data.words;
          $scope.scoreLeft = 'Score: ' + data.score;
        } else if(side === 'right') {
          $scope.badSearchRight = false;
          $scope.titleRight = 'Article: ' + q;
          $scope.dataRight = data.words;
          $scope.scoreRight = 'Score: ' + data.score;
        }
      }, function(error) {
        if(side === 'left') {
          $scope.badSearchLeft = true;
          return;
        } else if(side === 'right') {
          $scope.badSearchRight = true;
          return;
        }
      });
    };
  }])
  .controller('GroupCtrl', ['$scope', 'Search', function($scope, Search) {
    $scope.data = [];
    $scope.group = 'qbs';
    $scope.$watch('group', function(newVal, oldVal) {
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
