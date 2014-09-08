app.factory('ptoManager', function(dataStore) {
    "use strict";
    var factory, ptoKey, sbKey, ptoList;

    function init() {
        factory = {
            curYear:dataStore.curYear,
            curQuarter:dataStore.curQuarter
        };
        ptoKey = "ptoList";
        sbKey = "startingBalance";
        dataStore.setDefault(ptoKey, {
            items: [],
            cnt: 0
        });
        dataStore.setDefault(sbKey, 0);
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

    factory.getPtoList = function() {
        return ptoList.items;
    };

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

    factory.removePto = function(id) {
        for (var i = ptoList.items.length - 1; i >= 0; i--) {
            if (ptoList.items[i].id === id) {
                ptoList.items.splice(i, 1);
                break;
            }
        }
        dataStore.setObject(ptoKey, ptoList);
    };

    factory.getStartingBalance = function() {
        return dataStore.getObject(sbKey);
    };

    factory.setStartingBalance = function(startingBalance) {
        dataStore.setObject(sbKey, startingBalance);
    };

    return factory;
});
