app.service('dataStore', function() {
  "use strict";

    var defaults = [];

    this.setDefault = function(key, object) {
        defaults[key] = object;
    };

    this.getObject = function(key) {
        var obj = localStorage.getObject(key);
        if (obj === null) {
            if (defaults[key] !== null) {
                obj = defaults[key];
            }
        }
        return obj;
    };

    this.setObject = function(key, object) {
        localStorage.setObject(key, object);
    };

});
