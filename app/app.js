/// <reference path="//ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js" />

var app = angular.module('ptoPlanner', []);

app.run(function() {
    "use strict";

    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    };

    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    };

    //$("input.date").datepicker();
    $("#from").datepicker({
        //defaultDate: "+1w",
        changeMonth: true,
        //showButtonPanel: true,
        onClose: function(selectedDate) {
            $("#to").datepicker("option", "minDate", selectedDate);
        }
    });
    $("#to").datepicker({
        //defaultDate: "+1w",
        changeMonth: true,
        //showButtonPanel: true,
        onClose: function(selectedDate) {
            $("#from").datepicker("option", "maxDate", selectedDate);
        }
    });
});
