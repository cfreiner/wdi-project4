//Credit to Gregory Hilkert at ng-newsletter for their tutorial on creating a D3 service in angular.
//Source: http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module('D3Services', [])
  .factory('d3', ['$document', '$q', '$rootScope', function($document, $q, $rootScope) {
    //Promise action that will complete later
    var deferred = $q.defer();
    //Function to load d3 into the browser
    function onScriptLoad() {
      //$apply used to call functions outside Angular, but in the context of Angular scope
      $rootScope.$apply(function() {
        deferred.resolve(window.d3);
      });
    }

    //Create the D3 script tag and append it to the body
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'https://d3js.org/d3.v3.min.js';
    scriptTag.onreadystatechange = function() {
      if(this.readyState === 'complete') {
        onScriptLoad();
      }
    };
    //Reassign the script tag's onload function to the custom function above
    scriptTag.onload = onScriptLoad;
    var body = $document[0].getElementsByTagName('body')[0];
    body.appendChild(scriptTag);

    //Returns a promise, so when this service is used it must be fulfilled with a then
    return {
      d3: function() {
        return deferred.promise;
      }
    };
  }]);
