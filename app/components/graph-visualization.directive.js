(function() {
    "use strict";

    function controller() {
        var vm = this;

        vm.isLoading = true;
    }

    angular
        .module('crimeComponents')
        .directive('graphVisualization', function($http) {
            return {
                restrict: 'E',
                templateUrl: 'app/components/graph-visualization.directive.html',
                controller: controller,
                controllerAs: 'vm',
                link: function(scope, element, attr, ctrl) {
                    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';

                    var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
                        streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

                    var map = L.map('map', {
                        center: [47.5952, -122.3316],
                        zoom: 15,
                        layers: [streets]
                    });

                    var baseLayers = {
                        "Grayscale": grayscale,
                        "Streets": streets
                    };

                    L.control.layers(baseLayers).addTo(map);


                    function processData(data) {

                        var crimeMarkers = new L.LayerGroup();
                        for(var i = 0; i < data.length; i++) {

                            var coords = [Number(data[i].incident_location.latitude), Number(data[i].incident_location.longitude)];

                            var location = data[i].hundred_block_location;
                            var description = data[i].event_clearance_description;
                            L.marker(coords).bindPopup('<div>Location: ' + location + '</div>' + '<div>Description: ' + description + '</div>').addTo(crimeMarkers);
                        }

                        map.addLayer(crimeMarkers);
                    }

                    $http.get('https://data.seattle.gov/resource/3k2p-39jp.json?$where=within_circle(incident_location, 47.5952, -122.3316, 1609.34)').
                        success(function(data, status, headers, config) {
                            console.log("Success.......");
                            processData(data);
                            ctrl.isLoading = false;

                        }).
                        error(function(data, status, headers, config) {
                            console.log("Fail.......");
                            ctrl.isLoading = false;
                        });
                }
            };
        });

})();
