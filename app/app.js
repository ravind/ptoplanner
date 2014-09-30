
var app = angular.module('ptoPlanner', []);

app.run(function($rootScope) {
"use strict";

    var newDate = new Date();
    var curYear = newDate.getFullYear();
    var curQuarter = parseInt(newDate.getMonth() / 3) + 1;
    //var datepickers for reuse
    var $fromDP = $("#from");
    var $toDP = $("#to");

    $rootScope.nowDate = newDate;
    $rootScope.gettime = newDate.getTime();
    $rootScope.getFullYear = curYear;
    $rootScope.curQuarter = curQuarter;

    $rootScope.ptoBalance = 0;
    $rootScope.lostBalance = 0;
    $rootScope.todateHoursAvailable = 0;
    $rootScope.todateHoursLost = 0;

    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    };
    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    };

    //bind jqueryUI datepicker to
    $('[data-dp]').each(function() {
      var $this = $(this);
      var dpData = $this.data("dp");
      //if it has quarter end month number add min & max
      if(dpData.qEnd){
        $this.datepicker({
          minDate: new Date(curYear, dpData.qEnd - 3, 1),
          maxDate: new Date(curYear, dpData.qEnd, 0)
        });
      }else{ //otherwise bind without min & max
        $this.datepicker({
          minDate: new Date("01/01/"+curYear),
          maxDate: new Date("12/31/"+curYear)
        });
      }
    });
    //Bind datepicker with min & max to the from & to inputs
    $fromDP.datepicker({
        minDate: new Date("01/01/"+curYear),
        maxDate: new Date("12/31/"+curYear),
        onClose: function(selectedDate) {
          if(selectedDate){
            $("#to").datepicker("option", "minDate", selectedDate);
          }
        }
    });
    $toDP.datepicker({
        minDate: new Date("01/01/"+curYear),
        maxDate: new Date("12/31/"+curYear),
        onClose: function(selectedDate) {
          if(selectedDate){
            $("#from").datepicker("option", "maxDate", selectedDate);
          }
        }
    });

    $rootScope.resetDP = function(){
      $toDP.datepicker("option", "minDate", "01/01/"+curYear);
      $fromDP.datepicker("option", "maxDate", "12/31/"+curYear);
    };

});
