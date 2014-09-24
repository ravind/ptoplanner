
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

    $('[data-dp]').each(function() {
      var $this = $(this);
        var dpData = $this.data("dp");
        $this.datepicker({
          minDate: new Date(curYear, dpData.qEnd - 3, 1),
          maxDate: new Date(curYear, dpData.qEnd, 0)
        });
    });
    $("#from").datepicker({
        onClose: function(selectedDate) {
            $("#to").datepicker("option", "minDate", selectedDate);
        }
    });
    $("#to").datepicker({
        onClose: function(selectedDate) {
            $("#from").datepicker("option", "maxDate", selectedDate);
        }
    });

    var newDate = new Date();
    var curYear = newDate.getFullYear();
    var curQuarter = parseInt(newDate.getMonth() / 3) + 1;
    var firstOfYear = new Date(curYear,0,1); //jan 1
    var total = new Date(curYear,11,31) - firstOfYear;
    var progress = new Date() - firstOfYear;

    $rootScope.getFullYear = curYear;
    $rootScope.curQuarter = curQuarter;
    $rootScope.gettime = newDate.getTime();
    $rootScope.nowDate = newDate;
    $rootScope.ptoBalance = 0;
    $rootScope.lostBalance = 0;
    $rootScope.todateHoursAvailable = 0;
    $rootScope.todateHoursLost = 0;
    $rootScope.todateHoursEarned = Math.floor( 20 * (progress/ total) );
    $rootScope.todateHoursUsed = "--";

    // var thanksDay = function(year) {
    //     var first = new Date(year, 10, 1);
    //     var day_of_week = first.getDay();
    //     return 22 + (11 - day_of_week) % 7;
    // };
    // var lat = 0;


});
