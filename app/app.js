/// <reference path="//ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js" />

var app = angular.module('ptoPlanner', []);

app.run(function($rootScope) {
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
    var newDate = new Date();
    var curYear = newDate.getFullYear();
    $rootScope.getFullYear = curYear;
    $rootScope.curQuarter = parseInt(newDate.getMonth() / 3 ) + 1;
    $rootScope.nowDateToTime = newDate.getTime();
    $rootScope.gettime = newDate.getTime();
    var thanksDay = function(year) {
        var first = new Date(year, 10, 1);
        var day_of_week = first.getDay();
        return 22 + (11 - day_of_week) % 7;
    };

    var lat = 0;
    $rootScope.holidays = [
        [new Date( curYear,0,1).getTime(), lat],//1st
        [new Date( curYear,4,25).getTime(), lat],//memorial
        [new Date( curYear,8,1).getTime(), lat],//labor
        [new Date( curYear,10,thanksDay(curYear) ).getTime(), lat],//thanks
        [new Date( curYear,11,25).getTime(), lat]//xmas
    ];
});
