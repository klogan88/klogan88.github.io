(function() {
    "use strict";

    function controller() {
        var vm = this;

        //Tells the loading gif to turn hide.  Will be set to false after the API call returns.
        vm.isLoading = true;
    }

    //Component representing the map visualization.
    angular
        .module('crimeComponents')
        .directive('mapVisualization', function($http) {
            return {
                restrict: 'E',
                templateUrl: 'app/components/map-visualization.directive.html',
                scope: {
                    mapVisUrl: '@'
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: true,
                link: function(scope, element, attr, ctrl) {

                    var map;

                    //Set up the leaflet map here.
                    function initMap() {

                        //Grap some map textures to use in our app.
                        var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                            mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';

                        //Create the new tiles.
                        var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
                            streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

                        //Init the map.
                        map = L.map('map', {
                            center: [47.5952, -122.3316], //Center in on CenturyLink Field on the map
                            zoom: 15,
                            layers: [streets]
                        });

                        //A couple different map variations, a grayscale color scheme and one with detailed streets.
                        var baseLayers = {
                            "Grayscale": grayscale,
                            "Streets": streets
                        };

                        L.control.layers(baseLayers).addTo(map);
                    }

                    //Make the API call from the url passed into the directive.
                    function getData() {
                        $http.get(ctrl.mapVisUrl).
                            success(function(data, status, headers, config) {
                                processData(data); //Process the result.
                                ctrl.isLoading = false; //Tell the loadingGif to turn off, we're done.

                            }).
                            error(function(data, status, headers, config) {
                                ctrl.isLoading = false;
                            });
                    }

                    //Process the data from the API endpoint.  Create a new layer and add it to the map.
                    function processData(data) {

                        //Create the new Layer and add the data points
                        var crimeMarkers = new L.LayerGroup();
                        for(var i = 0; i < data.length; i++) {

                            //Create coordinates for each crime.
                            var coords = [Number(data[i].incident_location.latitude), Number(data[i].incident_location.longitude)];

                            //Set some data for the popups.  We look at the location and the description.
                            var location = data[i].hundred_block_location;
                            var description = data[i].event_clearance_description;
                            L.marker(coords).bindPopup('<div>Location: ' + location + '</div>' + '<div>Description: ' + description + '</div>').addTo(crimeMarkers);
                        }

                        //Add the new layer to the map.
                        map.addLayer(crimeMarkers);
                    }

                    //Call the functionsS
                    initMap();
                    getData();
                }
            };
        });

})();
