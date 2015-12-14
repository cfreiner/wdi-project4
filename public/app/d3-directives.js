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

          scope.render = function(data) {

            //Clear the existing SVG
            svg.selectAll('*').remove();

            var diameter = window.innerWidth/2;

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
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

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
  }])
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
