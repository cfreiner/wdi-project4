angular.module('D3Directives', ['D3Services'])
  .directive('barChart', ['d3', function(d3) {
    return {
      restrict: 'E'
    };
  }]);
