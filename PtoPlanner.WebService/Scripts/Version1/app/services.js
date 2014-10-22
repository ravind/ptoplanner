app.service('dataStore', function () {

    var defaults = new Array();

    this.setDefault = function (key, object) {
        defaults[key] = object;
    }

    this.getObject = function (key) {
        var obj = localStorage.getObject(key);
        if (obj === null) {
            if (defaults[key] != null) {
                obj = defaults[key];
            }
        }
        return obj;
    }

    this.setObject = function (key, object) {
        localStorage.setObject(key, object);
    }
});

app.factory('ptoManager', function (dataStore, $http) {
    var factory, sbKey, ptoList;
    
    function init() {
        factory = {};
        sbKey = "startingBalance";
        dataStore.setDefault(sbKey, 0);
        ptoList = new Array();
    }

    init();

    factory.getPtoTypes = function () {
        var ptoTypes = new Array(3);
        ptoTypes[1] = "PTO";
        ptoTypes[2] = "Floating Holiday";
        return ptoTypes;
    }

    factory.getPtoList = function () {
        return ptoList;
    }

    factory.updatePtoList = updatePtoList;
    function updatePtoList(callback) {
        $http.get('/api/PtoList')
        .success(function (data, status, headers, config) {
            ptoList = data;
            callback(true);
        })
        .error(function (data, status, headers, config) {
            console.log("Error fetching PtoList:" + status + ", " + data);
            callback(false)
        });    
    }

    factory.getNewPto = function () {
        var newPto = {
            Url: "",
            StartDate: "",
            EndDate: "",
            Note: "",
            HalfDays: false,
            PtoType: 1
        }
        return newPto;
    }

    factory.savePto = function (ptoObj, callback)
    {
        if (ptoObj.Url == "") {
            $http.post('/api/Pto', ptoObj)
            .success(function (data, status, headers, config) {
                console.log("Pto inserted.");
                updatePtoList(callback);
            })
            .error(function (data, status, headers, config) {
                console.log("Error Inserting: Status-" + status + ", Data-" + data);
                callback(false);
            });
        } else {
            //Code for PUT request comes here
        }
    }

    factory.removePto = function (url, callback) {
        if (url != "") {
            $http.delete(url)
            .success(function (data, status, headers, config) {
                console.log("Pto deleted.");
                updatePtoList(callback);
            })
            .error(function (data, status, headers, config) {
                console.log("Error Deleting: Status-" + status + ", Data-" + data);
                callback(false);
            });
        }
    }

    factory.getStartingBalance = function () {
        return dataStore.getObject(sbKey);
    }

    factory.setStartingBalance = function (startingBalance) {
        dataStore.setObject(sbKey, startingBalance);
    }

    return factory;
});

app.factory('chartGenerator', function () {

    var factory = {};
    var m_ptoList;

    function getPtoIterator(ptoType) {
        var ptoIterator = {
            curIndex: 0,
            reset: function () { this.curIndex = 0 },
            next: function () {
                var nextPto = null;
                while (!nextPto & this.curIndex < m_ptoList.length) {
                    if (m_ptoList[this.curIndex].PtoType == ptoType) {
                        nextPto = m_ptoList[this.curIndex];
                    }
                    this.curIndex++;
                }
                return nextPto;
            }
        }

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
        }

        return retObj;
    }

    function addData(tracker, date, data)
    {
        if (tracker.hasChanged()) {
            var oldDate = getPreviousDay(date);
            if (oldDate.getFullYear() == date.getFullYear()) {
                if (data.length == 0 || (data.length > 0 && data[data.length - 1][0].valueOf() != oldDate.valueOf())) {
                    data.push([oldDate.valueOf(), tracker.getOldBalance()]);
                }
            }
            data.push([date.valueOf(), tracker.getBalance()]);
            tracker.commit();
        } else if (new Date(date.getFullYear(), 11, 31) - date == 0) {
            data.push([date.valueOf(), tracker.getBalance()]);
        }
    }

    factory.getChartData = function (startingBalance, ptoList) {
        if (!startingBalance) return;
        if (!ptoList || !ptoList instanceof Array) return;
        
        m_ptoList = ptoList;
        var balanceData = new Array();
        var lossData = new Array();
        var ptoIterator = getPtoIterator(1);
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

            if (curPto != null && Date.parse(curPto.StartDate) <= curDate.valueOf() && curDate.valueOf() <= Date.parse(curPto.EndDate)) {
                var n = curDate.getDay();
                if (n != 0 && n != 6) {
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
            if (curPto != null && Date.parse(curPto.EndDate) < curDate.valueOf()) {
                curPto = ptoIterator.next();
            }
        }

        return {
            ptoBalance: balanceData,
            lostBalance: lossData
        };
    }

    return factory;
});

app.factory('floatingHolidayChecker', function () {
    var factory = {};

    function getSearchFilter(startDate, endDate) {
        var filter = function (value, index, ar) {
            if (value.PtoType == 2 && startDate <= Date.parse(value.StartDate) && Date.parse(value.StartDate) <= endDate) {
                return true;
            } else {
                return false;
            }
        }
        return filter;
    }

    factory.getResults = function (ptoList) {
        if (!ptoList) return;

        var curYear = new Date().getFullYear();
        var result = "";

        for (var q = 0; q < 4; q++) {
            var startDate = new Date(curYear, q * 3, 1);
            var endDate = new Date(curYear, q * 3 + 3, 0);
            var filt = getSearchFilter(startDate.valueOf(), endDate.valueOf());
            var qname = q + 1;
            qname = "Q" + qname;
            
            var floatingHolidays = ptoList.filter(filt);
            if (floatingHolidays.length == 0) {
                result += qname + " floating holiday not used.\r\n";
            } else if (floatingHolidays.length > 1) {
                result += "Cannot use " + floatingHolidays.length + " floating holidays in " + qname + ".\r\n";
            }
        }

        return result;
    }

    return factory;
});