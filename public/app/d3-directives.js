angular.module('D3Directives', ['D3Services'])
  .directive('bar', ['d3', '$window', function(d3, $window) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {
        d3.d3().then(function(d3) {
          var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%');

          var margin = parseInt(attrs.margin, 10) || 20;
          var barHeight = parseInt(attrs.barHeight, 10) || 20;
          var barPadding = parseInt(attrs.barPadding, 10) || 5;

          window.onresize = function() {
            scope.$apply();
          };

          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });

          scope.render = function(data) {
            svg.selectAll('*').remove();

            // If we don't pass any data, return out of the element
            if (!data) return;

            // setup variables
            var width = d3.select(element[0]).node().offsetWidth - margin,
                // calculate the height
                height = scope.data.length * (barHeight + barPadding),
                // Use the category20() scale function for multicolor support
                color = d3.scale.category20(),
                // our xScale
                xScale = d3.scale.linear()
                  .domain([0, d3.max(data, function(d) {
                    return d.score;
                  })])
                  .range([0, width]);

            // set the height based on the calculations above
            svg.attr('height', height);

            //create the rectangles for the bar chart
            svg.selectAll('rect')
              .data(data).enter()
                .append('rect')
                .attr('height', barHeight)
                .attr('width', 140)
                .attr('x', Math.round(margin/2))
                .attr('y', function(d,i) {
                  return i * (barHeight + barPadding);
                })
                .attr('fill', function(d) { return color(d.score); })
                .transition()
                  .duration(1000)
                  .attr('width', function(d) {
                    return xScale(d.score);
                  });
          };

        });
      }
    };
  }]);