'use strict';

angular.module('CooperativeIndoorMap')
  .service('MapMovementEvents', ['ApiService', function(ApiService) {
    return {

      /**
       * Connects the events
       * @param  {Object}   map      the map
       * @param  {Function} callback
       */
      connectMapEvents: function(map, callback) {
        // catches any map movements (drag, zoom, resize, ...)
        map.on('moveend', function(e) {
          var bounds = map.getBounds();
          callback({
            'nE': [bounds._northEast.lat, bounds._northEast.lng],
            'sW': [bounds._southWest.lat, bounds._southWest.lng]
          });
        });
      },
    };
  }]);
