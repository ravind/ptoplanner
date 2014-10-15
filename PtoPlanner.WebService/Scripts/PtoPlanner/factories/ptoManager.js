app.factory('ptoManager', function(dataStore, $rootScope) {
  "use strict";
  var factory, ptoKey, sbKey, ptoList;

  function init() {
    factory = {};
    ptoKey = "ptoList";
    dataStore.setDefault(ptoKey, {
      items: [ {"id": 1,"dateFrom": 1397451600000,"dateTo": 1397797200000,"ptoType": 0,"comment": "Example PTO","floats": []}],
      cnt: 0,
      holidays: {},//{ h1:false, h2:false, h3:false, h4:false, h5:false, h6:false }
      floats: {},//{ q1:{date:null,used:false}, q2:{date:null,used:false}, q3:{date:null,used:false}, q4:{date:null,used:false} }
      sbKey: 0, //carry over from previous year
      hireYearVar: 20, //20 or 15
      empStatusVar: 1, //1 or 2
      prorateStart: "01/01/2014",
      prorateEnd: "12/31/2014",
      halfDays: false
    });
    ptoList = dataStore.getObject(ptoKey);
  }

  init();

  //Starting Balance Carry Over
  factory.getStartingBalance = function() {
    return ptoList.sbKey;
  };
  factory.setStartingBalance = function(startingBalance) {
    ptoList.sbKey = startingBalance;
    dataStore.setObject(ptoKey, ptoList);
  };

  //prorate Start Date
  factory.getProrateStart = function() {
    return ptoList.prorateStart || "01/01/2014";
  };
  factory.setProrateStart = function(prorateStart) {
    ptoList.prorateStart = prorateStart;
    dataStore.setObject(ptoKey, ptoList);
  };

  //prorate End Date
  factory.getProrateEnd = function() {
    return ptoList.prorateEnd || "12/31/2014";
  };
  factory.setProrateEnd = function(prorateEnd) {
    ptoList.prorateEnd = prorateEnd;
    dataStore.setObject(ptoKey, ptoList);
  };

  //Hire Year Variable
  factory.getHireYears = function() {
    var hireYears = [ {label: "Before 2013", val: 20}, {label: "After 2012", val: 15} ];
    return hireYears;
  };
  factory.getHireYearVar = function() {
    if(!ptoList.hireYearVar){
      ptoList.hireYearVar = 20;
    }
    return ptoList.hireYearVar;
  };
  factory.setHireYearVar = function(hireYearVar) {
    ptoList.hireYearVar = hireYearVar;
    dataStore.setObject(ptoKey, ptoList);
  };

  //Employee Status Variable
  factory.getEmpStates = function() {
    var empStates = [ {label: "Full time", val: 1}, {label: "Part time", val: 2} ];
    return empStates;
  };
  factory.getEmpStatusVar = function() {
    if(!ptoList.empStatusVar){
      ptoList.empStatusVar = 1;
    }
    return ptoList.empStatusVar;
  };
  factory.setEmpStatusVar = function(empStatusVar) {
    ptoList.empStatusVar = empStatusVar;
    dataStore.setObject(ptoKey, ptoList);
  };

  //PTO items
  factory.addPto = function(from, to, type, note, halfDays) {
    ptoList.cnt += 1;
    var newPto = {
      id: ptoList.cnt,
      dateFrom: from,
      dateTo: to,
      ptoType: type,
      comment: note,
      halfDays: halfDays
    };
    ptoList.items.push(newPto);
    ptoList.items.sort(function(a, b) {
      return a.dateFrom.valueOf() - b.dateFrom.valueOf();
    });
    dataStore.setObject(ptoKey, ptoList);
  };
  factory.getPtoTypes = function() {
    //var ptoTypes = ["PTO","Standard Holiday","Floating Holiday"];
    var ptoTypes = ["PTO"];
    return ptoTypes;
  };
  factory.getPtoList = function() {
    //add floating holidays
    $.each(ptoList.items, function(k,v){
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
  factory.removePto = function(id) {
    var i = ptoList.items.length - 1;
    while (i >= 0) {
      if (ptoList.items[i].id === id) {
        ptoList.items.splice(i, 1);
        break;
      }
      i--;
    }
    dataStore.setObject(ptoKey, ptoList);
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
    dataStore.setObject(ptoKey, ptoList);
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
