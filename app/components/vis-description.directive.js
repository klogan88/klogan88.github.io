(function() {
    "use strict";

    function controller() {
        var vm = this;

    }

    //A directive for the header for the map visualization.  Loads the template and displays it.
    angular
        .module('crimeComponents')
        .directive('visDescription', function() {
            return {
                restrict: 'E',
                templateUrl: 'app/components/vis-description.directive.html',
                controller: controller,
                controllerAs: 'vm'
            };
        });

})();
