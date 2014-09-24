app.factory('ptoManager', function(dataStore) {
  "use strict";
  var factory, ptoKey, sbKey, ptoList;

  function init() {
    factory = {};
    ptoKey = "ptoList";
    dataStore.setDefault(ptoKey, {
      items: [],
      cnt: 0,
      holidays: {},
      floats: {},
      sbKey: 0,
      hireYearVar: 20
    });
    ptoList = dataStore.getObject(ptoKey);
  }

  init();


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

  factory.getPtoTypes = function() {
    var ptoTypes = ["PTO","Standard Holiday","Floating Holiday"];
    return ptoTypes;
  };

  factory.getFloats = function() {
    return ptoList.floats;
  };

  factory.getHolidays = function() {
    return ptoList.holidays;
  };

  factory.getStartingBalance = function() {
    return ptoList.sbKey;
  };
  factory.setStartingBalance = function(startingBalance) {
    ptoList.sbKey = startingBalance;
    dataStore.setObject(ptoKey, ptoList);
  };


  factory.getHireYears = function() {
    var hireYears = [ {label: "More than 2 yrs ago", val: 20}, {label: "Less than 2 yrs ago", val: 15} ];
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

  factory.addPto = function(from, to, type, note, hasFloatStart, hasFloatEnd) {
    ptoList.cnt += 1;
    var newPto = {
      id: ptoList.cnt,
      dateFrom: from,
      dateTo: to,
      ptoType: type,
      comment: note,
      hasFloatStart: hasFloatStart,
      hasFloatEnd: hasFloatEnd
    };
    ptoList.items.push(newPto);
    ptoList.items.sort(function(a, b) {
      return a.dateFrom.valueOf() - b.dateFrom.valueOf();
    });
    dataStore.setObject(ptoKey, ptoList);
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
