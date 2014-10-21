
var app = angular.module('ptoPlanner', ['ngResource']);

app.run(function ($rootScope) {
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

    function getLastMonday(month) {
      var d = new Date();
      d.setDate(1); // Roll to the first day of ...
      d.setMonth(month);//the month after because of zero base
      do { // Roll the days backwards until Monday.
        d.setDate(d.getDate() - 1);
      } while (d.getDay() !== 1);

      return new Date( curYear, d.getMonth(), d.getDate() );
    }

    function getThanksDay() {
        var first = new Date(curYear, 10, 1);
        var day_of_week = first.getDay();
        var thanksday = 22 + (11 - day_of_week) % 7;
        return new Date(curYear,10,thanksday);
    }

    function getHoliday(y,m,d){
      var date = new Date(y,m,d);
      //push sunday to monday
      if(date.getDay() === 0){
        date.setDate(date.getDate() + 1);
      }
      //push saturday to friday
      if(date.getDay() === 6){
        date.setDate(date.getDate() - 1);
        //if new years moved to previous year push it the other way
        if(date.getDate() === 31){
          date.setDate(date.getDate() + 3);
        }
      }
      return date;
    }

    // Memorial Day | Last Monday in May
    // Labor Day | First Monday in Sept
    // Thanksgiving Day | Last Thursday in Nov
    $rootScope.h1 = getHoliday(curYear,0,1);   // New Year's Day
    $rootScope.h2 = getLastMonday(5);// memorial may monday
    $rootScope.h3 = getHoliday(curYear,6,4);   // Independence Day
    $rootScope.h4 = getLastMonday(9);// labor sep monday
    $rootScope.h5 = getThanksDay();// thanks nov thursday
    $rootScope.h6 = getHoliday(curYear,11,25); // Christmas Day


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
