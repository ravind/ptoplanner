

app.factory('ptoManager', function (dataStore, $rootScope, pto, Setup) {
  "use strict";
  var factory, ptoKey, ptoList = {}, scope = {year:2014};

  function init() {
    factory = {};
    ptoKey = "ptoList";
    ptoList.items = pto.query({ year: 2014 });
    ptoList.settings = Setup.query();
    console.log(ptoList.settings);
  }

  init();


  factory.setSettings = function (startingBalance, prorateStart, prorateEnd, hireYearVar, empStatusVar) {
      ptoList.settings.PtoCarriedOver = startingBalance;
      ptoList.settings.ProrateStart = prorateStart;
      ptoList.settings.ProrateEnd = prorateEnd;
      ptoList.settings.HireYear = hireYearVar;
      ptoList.settings.EmployeeStatus = empStatusVar;
      var setObj = {
        "SettingsYear": 2014,
        "PtoCarriedOver": startingBalance,
        "HireYear": hireYearVar,
        "EmployeeStatus": empStatusVar,
        "ProrateStart": prorateStart,
        "ProrateEnd": prorateEnd
    }
    //dataStore.setObject("Settings", setObj);
    Setup.update(setObj);
  };
  //Starting Balance Carry Over
  factory.getStartingBalance = function () {
      if (!ptoList.settings.PtoCarriedOver) {
          ptoList.settings.PtoCarriedOver = 0;
      }
      return ptoList.settings.PtoCarriedOver;
  };
  //prorate Start Date
  factory.getProrateStart = function() {
      if (!ptoList.settings.ProrateStart) {
          ptoList.settings.ProrateStart = "01/01/2014";
      }
      return ptoList.settings.ProrateStart;
  };

  //prorate End Date
  factory.getProrateEnd = function() {
      if (!ptoList.settings.ProrateEnd) {
          ptoList.settings.ProrateEnd = "12/31/2014";
      }
      return ptoList.settings.ProrateEnd;
  };


  //Hire Year Variable
  factory.getHireYears = function() {
    return [ {label: "Before 2013", val: 20}, {label: "After 2012", val: 15} ];
  };
  factory.getHireYearVar = function() {
    if(!ptoList.settings.HireYear){
      ptoList.settings.HireYear = 20;
    }
    return ptoList.settings.HireYear;
  };

    
  //Employee Status Variable
  factory.getEmpStates = function() {
    return [ {label: "Full time", val: 1}, {label: "Part time", val: 2} ];
  };
  factory.getEmpStatusVar = function() {
      if (!ptoList.settings.EmployeeStatus) {
          ptoList.settings.EmployeeStatus = 1;
      }
      return ptoList.settings.EmployeeStatus;
  };

  //PTO items
  factory.addPto = function(from, to, note, halfDays, type) {
    //ptoList.cnt += 1;
    var newPto = {
        //"PersonId": 1,
        "StartDate": from,
        "EndDate": to,
        "Note": note,
        "HalfDays": halfDays,
        "PtoType": type
    };
    ptoList.items.push(newPto);
    ptoList.items.sort(function(a, b) {
        return a.StartDate.valueOf() - b.EndDate.valueOf();
    });
    dataStore.setObject(ptoKey, newPto);
  };


  factory.getPtoList = function() {
    //add floating holidays

    $.each(ptoList.items, function (k, v) {
      ptoList.items[k].floats = [];
      for(var key in ptoList.floats){
        var val = new Date(ptoList.floats[key].date).valueOf();
        if(v.dateFrom <= val && val <= v.dateTo ){
          ptoList.items[k].floats.push(val);
        }
      }
      //add standard holidays
      ptoList.items[k].holidays = [];
      for(var h in ptoList.holidays){
        //get the date of the holiday
        var val2 = $rootScope[h].valueOf();
        //if holiday is in PTO range
        if(v.dateFrom <= val2 && val2 <= v.dateTo ){
          //add standard holiday date to PTO item
          ptoList.items[k].holidays.push(val2);
          //set standard holiday as used
          ptoList.holidays[h] = true;
        }
      }
    });
    return ptoList.items;
  };

  factory.removePto = function (id) {
    var i = ptoList.items.length - 1;
    while (i >= 0) {
        if (ptoList.items[i].Url === id) {
            ptoList.items.splice(i, 1);
            break;
            }
        i--;
    }
    dataStore.delObject(id);
  };

  //floating holidays
  factory.getFloats = function() {
    return ptoList.floats;
  };
  factory.addFloat = function(id, qdate) {
    if (!ptoList.floats) {
      ptoList.floats = {};
    }
    ptoList.floats[id] = {used:true};
    if (qdate) {
      ptoList.floats[id].date = qdate;
    }
    dataStore.setObject(ptoKey, {
        StartDate: qdate,
        EndDate: qdate,
        HalfDays: false,
        Note: id,
        PtoType: 2
    });
  };
  factory.offFloat = function(id) {
    ptoList.floats[id].used = false;
    ptoList.floats[id].date = null;
    dataStore.setObject(ptoKey, ptoList);
  };

  //standard holidays
  factory.getHolidays = function() {
    return ptoList.holidays;
  };
  factory.addHoliday = function(id) {
    if (!ptoList.holidays) {
      ptoList.holidays = {};
    }
    ptoList.holidays[id] = true;
    dataStore.setObject(ptoKey, ptoList);
  };
  factory.delHoliday = function(id) {
    ptoList.holidays[id] = false;
    dataStore.setObject(ptoKey, ptoList);
  };

  return factory;
});
