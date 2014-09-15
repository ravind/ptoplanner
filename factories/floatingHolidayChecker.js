app.factory('floatingHolidayChecker', function(ptoManager, $rootScope) {
  "use strict";
  var factory = {};
  var ptoList;

  function init() {
    ptoList = ptoManager.getPtoList();
  }

  init();

  function getSearchFilter(startDate, endDate) {
    var filter = function(value, index, ar) {
      if (value.ptoType == 2 && startDate <= value.dateFrom && value.dateFrom <= endDate) {
        return true;
      } else {
        return false;
      }
    };
    return filter;
  }

  factory.getResults = function() {
    var result = [];
    var q = 0;
    while (q < 4) { //for (q; q < 4; q++) {
      var startDate = new Date($rootScope.getFullYear, q * 3, 1),
        endDate = new Date($rootScope.getFullYear, q * 3 + 3, 0),
        filt = getSearchFilter(startDate.valueOf(), endDate.valueOf()),
        qname = q + 1,
        qType = (q < $rootScope.curQuarter) ? "danger" : "info";
      qname = "Q" + qname;

      var floatingHolidays = ptoList.filter(filt);
      if (floatingHolidays.length === 0) {
        result.push({
          info: qname + " floating holiday not used.",
          type: qType
        });
      } else if (floatingHolidays.length > 1) {
        result.push({
          info: "Cannot use " + floatingHolidays.length + " floating holidays in " + qname + ".",
          type: "warning"
        });
      }

      q++;
    }

    return result;
  };

  return factory;
});
