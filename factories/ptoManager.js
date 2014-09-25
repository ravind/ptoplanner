app.factory('ptoManager', function(dataStore) {
  "use strict";
  var factory, ptoKey, sbKey, ptoList;

  function init() {
    factory = {};
    ptoKey = "ptoList";
    dataStore.setDefault(ptoKey, {
      items: [ {"id": 1,"dateFrom": 1397451600000,"dateTo": 1397797200000,"ptoType": 0,"comment": "Example PTO","floats": []}],
      cnt: 0,
      holidays: {},
      floats: {},
      sbKey: 0,
      hireYearVar: 20,
      empStatusVar: 1,
      prorateStart: "01/01/2014",
      prorateEnd: "12/31/2014"
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
  factory.addPto = function(from, to, type, note) {
    ptoList.cnt += 1;
    var newPto = {
      id: ptoList.cnt,
      dateFrom: from,
      dateTo: to,
      ptoType: type,
      comment: note
    };
    ptoList.items.push(newPto);
    ptoList.items.sort(function(a, b) {
      return a.dateFrom.valueOf() - b.dateFrom.valueOf();
    });
    dataStore.setObject(ptoKey, ptoList);
  };
  factory.getPtoTypes = function() {
    var ptoTypes = ["PTO","Standard Holiday","Floating Holiday"];
    return ptoTypes;
  };
  factory.getPtoList = function() {
    //add floating holidays
    $.each(ptoList.items, function(k,v){
      ptoList.items[k].floats = [];
      for(var key in ptoList.floats){
        var asdf = new Date(ptoList.floats[key].date).valueOf();
        if(v.dateFrom <= asdf && asdf <= v.dateTo ){
          ptoList.items[k].floats.push(asdf);
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
    ptoList.floats[id]= {used:true};
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
