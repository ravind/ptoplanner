app.factory('chartGenerator', function(ptoManager) {
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
            reset: function() {
                this.curIndex = 0;
            },
            next: function() {
                var nextPto = null;
                while (!nextPto & this.curIndex < ptoList.length) {
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
            getBalance: function() {
                return curBalance;
            },
            setBalance: function(newValue) {
                curBalance = newValue;
            },
            getOldBalance: function() {
                return oldBalance;
            },
            hasChanged: function() {
                return curBalance != oldBalance;
            },
            commit: function() {
                oldBalance = curBalance;
            }
        };

        return retObj;
    }

    function addData(tracker, date, data) {
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

    factory.getChartData = function() {
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
