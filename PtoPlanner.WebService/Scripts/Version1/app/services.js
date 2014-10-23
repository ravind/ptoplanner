app.factory('settingsManager', function ($http) {
    var factory, settings;

    function init() {
        factory = {};
    }

    init();

    factory.getEmployeeStatuses = function () {
        var empStats = [
            { id: 1, name: "Full Time" },
            { id: 2, name: "Part Time" }
        ];
        return empStats;
    }

    factory.getAllYears = function (callback) {
        $http.get('/api/Settings/Years')
        .success(function (data, status, headers, config) {
            callback(data);
        })
        .error(function (data, status, headers, config) {
            console.log("Error fetching Years: " + status + ", " + data);
            callback(null);
        });
    }

    factory.getSettings = function (year, callback) {
        $http.get('/api/Settings/' + year)
        .success(function (data, status, headers, config) {
            callback(data);
        })
        .error(function (data, status, headers, config) {
            if (status == 404) {
                var retVal = {
                    Url: "",
                    EmployeeStatus: 1,
                    HireYear: null,
                    ProrateStart: null,
                    ProrateEnd: null,
                    PtoCarriedOver: 0,
                    SettingsYear: year
                };
                callback(retVal);
            } else {
                console.log("Error fetching Settings: " + status + ", " + data);
                callback(null);
            }
        });
    }

    factory.saveSettings = function (settingObj, callback)
    {
        if(settingObj.Url == "") {
            $http.post('/api/Settings', settingObj)
            .success(function (data, status, headers, config) {
                callback(true);
            })
            .error(function (data, status, headers, config) {
                console.log("Error inserting Settings: " + status + ", " +data);
                callback(false);
            });
        } else {
            $http.put(settingObj.Url, settingObj)
            .success(function (data, status, headers, config) {
                callback(true);
            })
            .error(function (data, status, headers, config) {
                console.log("Error updating Settings: " + status + ", " + data);
                callback(false);
            });
        }
    }

    return factory;
});

app.factory('ptoManager', function ($http) {
    var factory;
    
    function init() {
        factory = {};
    }

    init();

    factory.getPtoTypes = function () {
        var ptoTypes = [
            { id: 1, name: "PTO" },
            { id: 2, name: "Floating Holiday" }
        ];
        return ptoTypes;
    }

    factory.refreshPtoList = function (year, callback) {
        $http.get('/api/PtoList/' + year)
        .success(function (data, status, headers, config) {
            callback(data);
        })
        .error(function (data, status, headers, config) {
            console.log("Error fetching PtoList: " + status + ", " + data);
            callback(null);
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
                callback(true);
            })
            .error(function (data, status, headers, config) {
                console.log("Error Inserting PTO: " + status + ", " + data);
                callback(false);
            });
        } else {
            $http.put(ptoObj.Url, ptoObj)
            .success(function (data, status, headers, config) {
                callback(true);
            })
            .error(function(data, status, headers, config) {
                console.log("Error updating PTO: " + status + ", " + data);
                callback(false);
            });
        }
    }

    factory.removePto = function (url, callback) {
        if (url != "") {
            $http.delete(url)
            .success(function (data, status, headers, config) {
                callback(true);
            })
            .error(function (data, status, headers, config) {
                console.log("Error Deleting PTO: " + status + ", " + data);
                callback(false);
            });
        }
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

    factory.getChartData = function (currentSettings, ptoList) {
        if (!currentSettings) return;
        if (!ptoList || !ptoList instanceof Array) return;
        
        m_ptoList = ptoList;
        var balanceData = new Array();
        var lossData = new Array();
        var ptoIterator = getPtoIterator(1);
        var curYear = new Date().getFullYear();
        var curDate = new Date(curYear, 0, 1);
        var curPto = ptoIterator.next();
        var accrued = balanceTracker(currentSettings.PtoCarriedOver);
        var lost = balanceTracker(0);
        lost.commit();
        while (curDate.getFullYear() == curYear) {
            if (isLastDayOfMonth(curDate) || curDate.getDate() == 15) {
                accrued.setBalance(accrued.getBalance() + 20 / 3);
            }

            if (curPto != null && Date.parse(curPto.StartDate) <= curDate.valueOf() && curDate.valueOf() <= Date.parse(curPto.EndDate)) {
                var n = curDate.getDay();
                if (n != 0 && n != 6) {
                    var hoursUsed = curPto.HalfDays ? 4 : 8;
                    accrued.setBalance(accrued.getBalance() - hoursUsed);
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

app.factory('holidayManager', function () {
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

    factory.getFloatingHolidays = function (ptoList) {
        if (!ptoList) return;

        var curYear = new Date().getFullYear();
        var result = new Array();

        for (var q = 0; q < 4; q++) {
            var startDate = new Date(curYear, q * 3, 1);
            var endDate = new Date(curYear, q * 3 + 3, 0);
            var filt = getSearchFilter(startDate.valueOf(), endDate.valueOf());
            var qname = q + 1;
            qname = "Q" + qname;
            
            var floatingHolidays = ptoList.filter(filt);
            if (floatingHolidays.length == 0) {
                result.push({name: qname, date: null});
            } else {
                result.push({name: qname, date: floatingHolidays[0].StartDate});
            }
        }

        return result;
    }

    return factory;
});