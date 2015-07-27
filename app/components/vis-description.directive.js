(function() {
    "use strict";

    function controller() {
        var vm = this;

    }

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
