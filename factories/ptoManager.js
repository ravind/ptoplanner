app.factory('ptoManager', function(dataStore) {
  "use strict";
  var factory, ptoKey, sbKey, ptoList;

  function init() {
    factory = {};
    ptoKey = "ptoList";
    //sbKey = "startingBalance";
    dataStore.setDefault(ptoKey, {
      items: [],
      cnt: 0,
      holidays: {},
      floats: {},
      sbKey: 0
    });
    //dataStore.setDefault(sbKey, 0);
    ptoList = dataStore.getObject(ptoKey);
  }

  init();

  factory.getPtoTypes = function() {
    var ptoTypes = [];
    ptoTypes[0] = "PTO";
    ptoTypes[1] = "Standard Holiday";
    ptoTypes[2] = "Floating Holiday";
    return ptoTypes;
  };

  // factory.getItems = function() {
  //     return ptoList;
  // };

  factory.getPtoList = function() {
    return ptoList.items;
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
    //dataStore.setObject(sbKey, startingBalance);
    ptoList.sbKey = startingBalance;
    dataStore.setObject(ptoKey, ptoList);
  };

  factory.addPto = function(from, to, type, note, hasFloat) {
    ptoList.cnt += 1;
    var newPto = {
      id: ptoList.cnt,
      dateFrom: from,
      dateTo: to,
      ptoType: type,
      comment: note,
      hasFloat: hasFloat
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
