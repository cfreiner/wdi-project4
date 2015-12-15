angular.module('D3Directives', ['D3Services'])
  .directive('bubbleChart', ['d3', '$window', function(d3, $window) {
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

          //Make the watch function below work
          window.onresize = function() {
            scope.$apply();
          };

          //Watch for window resize, re-render on change
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });

          // Watch for data, re-render on change
          scope.$watchCollection('data', function(newVals, oldVals) {
            scope.render(scope.data);
          });

          scope.render = function(data) {

            //Clear the existing SVG
            svg.selectAll('*').remove();

            var diameter = window.innerWidth * 0.75;

            //Create bubble chart layout
            var bubble = d3.layout.pack()
              .sort(null)
              .size([diameter, diameter])
              .padding(15);

            svg.attr("width", diameter)
              .attr("height", diameter)
              .attr("class", "bubble");

            //Append nodes for each data point
            var node = svg.selectAll(".node")
              .data(bubble.nodes({children: data}))
              .enter()
              .append("g")
              .attr("class", "node")
              .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
              });

            node.append("title")
              .text(function(d) { return d.word; });

            node.append("circle")
              .attr("r", function(d) { return d.r; })
              .attr("class", function(d) { return d.valence; });

            node.append("text")
              .text(function(d) { return d.word; })
              .style("font-size", function(d) { return (d.r/2); })
              .style("text-anchor", "middle");
          };

        });
      }
    };
  }]);
