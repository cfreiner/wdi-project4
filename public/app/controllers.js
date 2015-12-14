angular.module('WikiCtrls', ['WikiServices', 'D3Directives'])
  .controller('SearchCtrl', ['$scope', 'Article', '$window', function($scope, Article, $window) {
    $scope.results = '';
    // $scope.data = [
    //   {label: 'label1', score: 3},
    //   {label: 'label2', score: 5},
    //   {label: 'label3', score: 2},
    //   {label: 'label4', score: 7}
    // ];
    $scope.data = [
      {
        word: 'Test1',
        valence: 'positive',
        value: 1
      },
      {
        word: 'Test2',
        valence: 'negative',
        value: 2
      },
      {
        word: 'Test3',
        valence: 'positive',
        value: 3
      }
    ];
    $scope.search = function(q) {
      Article.get({q:q}, function(data) {
        $scope.results = data;
      });
    };
  }]);
