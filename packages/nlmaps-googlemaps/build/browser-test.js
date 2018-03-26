(function () {
  'use strict';

  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var emitonoff = createCommonjsModule(function (module) {
    var EmitOnOff = module.exports = function (thing) {
      if (!thing) thing = {};

      thing._subs = [];
      thing._paused = false;
      thing._pending = [];

      /**
       * Sub of pubsub
       * @param  {String}   name name of event
       * @param  {Function} cb   your callback
       */
      thing.on = function (name, cb) {
        thing._subs[name] = thing._subs[name] || [];
        thing._subs[name].push(cb);
      };

      /**
       * remove sub of pubsub
       * @param  {String}   name name of event
       * @param  {Function} cb   your callback
       */
      thing.off = function (name, cb) {
        if (!thing._subs[name]) return;
        for (var i in thing._subs[name]) {
          if (thing._subs[name][i] === cb) {
            thing._subs[name].splice(i);
            break;
          }
        }
      };

      /**
       * Pub of pubsub
       * @param  {String}   name name of event
       * @param  {Mixed}    data the data to publish
       */
      thing.emit = function (name) {
        if (!thing._subs[name]) return;

        var args = Array.prototype.slice.call(arguments, 1);

        if (thing._paused) {
          thing._pending[name] = thing._pending[name] || [];
          thing._pending[name].push(args);
          return;
        }

        for (var i in thing._subs[name]) {
          thing._subs[name][i].apply(thing, args);
        }
      };

      thing.pause = function () {
        thing._paused = true;
      };

      thing.resume = function () {
        thing._paused = false;

        for (var name in thing._pending) {
          for (var i = 0; i < thing._pending[name].length; i++) {
            thing.emit(name, thing._pending[name][i]);
          }
        }
      };

      return thing;
    };
  });

  var geoLocateDefaultOpts = {
    follow: false
  };

  function positionHandler(position) {
    this.emit('position', position);
  }
  function positionErrorHandler(error) {
    this.emit('error', error);
  }

  var GeoLocator = function GeoLocator(opts) {
    var state = Object.assign({}, geoLocateDefaultOpts, opts);

    return {
      start: function start() {
        state.started = true;
        navigator.geolocation.getCurrentPosition(positionHandler.bind(this), positionErrorHandler.bind(this), { maximumAge: 60000 });
        return this;
      },
      stop: function stop() {
        state.started = false;
        return this;
      },
      isStarted: function isStarted() {
        return state.started;
      },
      log: function log() {
        // eslint-disable-next-line no-console
        console.log(state);
        return this;
      }
    };
  };

  function geoLocator(opts) {
    if ('geolocation' in navigator) {
      var geolocator = emitonoff(GeoLocator(opts));
      geolocator.on('position', function () {
        this.stop();
      });
      return geolocator;
    } else {
      var error = 'geolocation is not available in your browser.';
      throw error;
    }
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 52, lng: 5 },
    zoom: 8
  });
  var ElaMap = bgLayer(map);

  var mapTypeIds = ['Brt Achtergrondkaart', 'roadmap'];
  map.mapTypes.set('Brt Achtergrondkaart', ElaMap);
  map.setOptions({
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: mapTypeIds
    }

  });
  map.setMapTypeId('Brt Achtergrondkaart');
  var geolocator = geoLocator();
  var control = geoLocatorControl(geolocator, map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(control);

}());
