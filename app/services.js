app.service('dataStore', function () {
    "use strict";

    var defaults = [];

    this.setDefault = function (key, object) {
        defaults[key] = object;
    };

    this.getObject = function (key) {
        var obj = localStorage.getObject(key);
        if (obj === null) {
            if (defaults[key] !== null) {
                obj = defaults[key];
            }
        }
        return obj;
    };

    this.setObject = function (key, object) {
        localStorage.setObject(key, object);
    };
});

app.factory('ptoManager', function (dataStore) {
    "use strict";
    var factory, ptoKey, sbKey, ptoList;

    function init() {
        factory = {};
        ptoKey = "ptoList";
        sbKey = "startingBalance";
        dataStore.setDefault(ptoKey, { items: [], cnt: 0 });
        dataStore.setDefault(sbKey, 0);
        ptoList = dataStore.getObject(ptoKey);
    }

    init();

    factory.getPtoTypes = function () {
        var ptoTypes = new Array(3);
        ptoTypes[0] = "PTO";
        //ptoTypes[1] = "Standard Holiday";
        ptoTypes[2] = "Floating Holiday";
        return ptoTypes;
    };

    factory.getPtoList = function () {
        return ptoList.items;
    };

    factory.addPto = function (from, to, type, note) {
        ptoList.cnt += 1;
        var newPto = { id: ptoList.cnt, dateFrom: from, dateTo: to, ptoType: type, comment: note };
        ptoList.items.push(newPto);
        ptoList.items.sort(function (a, b) {
            return a.dateFrom.valueOf() - b.dateFrom.valueOf();
        });
        dataStore.setObject(ptoKey, ptoList);
    };

    factory.removePto = function (id) {
        for (var i = ptoList.items.length - 1; i >= 0; i--) {
            if (ptoList.items[i].id === id) {
                ptoList.items.splice(i, 1);
                break;
            }
        }
        dataStore.setObject(ptoKey, ptoList);
    };

    factory.getStartingBalance = function () {
        return dataStore.getObject(sbKey);
    };

    factory.setStartingBalance = function (startingBalance) {
        dataStore.setObject(sbKey, startingBalance);
    };

    return factory;
});

app.factory('chartGenerator', function (ptoManager) {
    "use strict";

    var factory = {};
    var ptoList, startingBalance;

    function init() {
        ptoList = ptoManager.getPtoList();
        startingBalance = ptoManager.getStartingBalance();
    }

    init();

    function getPtoIterator(ptoType) {
        var ptoIterator = {
            curIndex: 0,
            reset: function () { this.curIndex = 0; },
            next: function () {
                var nextPto = null;
                while (!nextPto & this.curIndex < ptoList.length ) {
                    if (ptoList[this.curIndex].ptoType == ptoType) {
                        nextPto = ptoList[this.curIndex];
                    }
                    this.curIndex++;
                }
                return nextPto;
            }
        };

        return ptoIterator;
    }

    function isLastDayOfMonth(dateToCheck) {
        var lastDayOfMonth = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth() + 1, 0).getDate();
        return dateToCheck.getDate() == lastDayOfMonth;
    }

    function getPreviousDay(startDate) {
        var newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() - 1);
        return newDate;
    }

    function balanceTracker(initialValue) {
        var curBalance = initialValue;
        var oldBalance = -1;

        var retObj = {
            getBalance: function () {
                return curBalance;
            },
            setBalance: function (newValue) {
                curBalance = newValue;
            },
            getOldBalance: function () {
                return oldBalance;
            },
            hasChanged: function () {
                return curBalance != oldBalance;
            },
            commit: function () {
                oldBalance = curBalance;
            }
        };

        return retObj;
    }

    function addData(tracker, date, data)
    {
        if (tracker.hasChanged()) {
            var oldDate = getPreviousDay(date);
            if (oldDate.getFullYear() == date.getFullYear()) {
                if (data.length === 0 || (data.length > 0 && data[data.length - 1][0].valueOf() != oldDate.valueOf())) {
                    data.push([oldDate.valueOf(), tracker.getOldBalance()]);
                }
            }
            data.push([date.valueOf(), tracker.getBalance()]);
            tracker.commit();
        } else if (new Date(date.getFullYear(), 11, 31) - date === 0) {
            data.push([date.valueOf(), tracker.getBalance()]);
        }
    }

    factory.getChartData = function () {
        init();
        var balanceData = [];
        var lossData = [];
        var ptoIterator = getPtoIterator(0);
        var curYear = new Date().getFullYear();
        var curDate = new Date(curYear, 0, 1);
        var curPto = ptoIterator.next();
        var accrued = balanceTracker(startingBalance);
        var lost = balanceTracker(0);
        lost.commit();
        while (curDate.getFullYear() == curYear) {
            if (isLastDayOfMonth(curDate) || curDate.getDate() == 15) {
                accrued.setBalance(accrued.getBalance() + 20 / 3);
            }

            if (curPto !== null && curPto.dateFrom <= curDate.valueOf() && curDate.valueOf() <= curPto.dateTo) {
                var n = curDate.getDay();
                if (n !== 0 && n != 6) {
                    accrued.setBalance(accrued.getBalance() - 8);
                }
            }

            if (accrued.getBalance() > 80) {
                lost.setBalance(lost.getBalance() + accrued.getBalance() - 80);
                accrued.setBalance(80);
            }

            addData(accrued, curDate, balanceData);
            addData(lost, curDate, lossData);

            curDate.setDate(curDate.getDate() + 1);
            if (curPto !== null && curPto.dateTo < curDate) {
                curPto = ptoIterator.next();
            }
        }

        return {
            ptoBalance: balanceData,
            lostBalance: lossData
        };
    };

    return factory;
});

app.factory('floatingHolidayChecker', function (ptoManager) {
    "use strict";
    var factory = {};
    var ptoList;

    function init() {
        ptoList = ptoManager.getPtoList();
    }

    init();

    function getSearchFilter(startDate, endDate) {
        var filter = function (value, index, ar) {
            if (value.ptoType == 2 && startDate <= value.dateFrom && value.dateFrom <= endDate) {
                return true;
            } else {
                return false;
            }
        };
        return filter;
    }

    factory.getResults = function () {
        var curYear = new Date().getFullYear();
        var result = [];
        var q = 0;

        for (q; q < 4; q++) {
            var startDate = new Date(curYear, q * 3, 1);
            var endDate = new Date(curYear, q * 3 + 3, 0);
            var filt = getSearchFilter(startDate.valueOf(), endDate.valueOf());
            var qname = q + 1;
            qname = "Q" + qname;

            var floatingHolidays = ptoList.filter(filt);
            if (floatingHolidays.length === 0) {
                result.push({info:qname + " floating holiday not used.",type:"danger"});
            } else if (floatingHolidays.length > 1) {
                result.push({info:"Cannot use " + floatingHolidays.length + " floating holidays in " + qname + ".",type:"warning"});
            }
        }

        return result;
    };

    return factory;
});
