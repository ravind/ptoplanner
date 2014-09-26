app.factory('chartGenerator', function(ptoManager, $rootScope) {
"use strict";

  var factory = {},
      ptoList,
      floatsList,
      startingBalance,
      prorateStart,
      prorateEnd,
      hireYearVar,
      empStatusVar;

  function init() {
    ptoList = ptoManager.getPtoList();
    floatsList = ptoManager.getFloats();
    startingBalance = ptoManager.getStartingBalance();
    prorateStart = ptoManager.getProrateStart();
    prorateEnd = ptoManager.getProrateEnd();
    hireYearVar = ptoManager.getHireYearVar();
    empStatusVar = ptoManager.getEmpStatusVar();
  }
  init();

  function getPtoIterator(ptoType) {
    var ptoIterator = {
      curIndex: 0,
      reset: function() { this.curIndex = 0; },
      next: function() {
        var nextPto = null;

        /* the singel "&"" is bitwise AND.
        ** This operator expects two numbers and retuns a number.
        ** In case they are not numbers, they are cast to numbers.
        */
        while (!nextPto & this.curIndex < ptoList.length) {
          //if (ptoList[this.curIndex].ptoType == ptoType) {
            nextPto = ptoList[this.curIndex];
          //}
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
    if ( tracker.hasChanged() ) {
      var oldDate = getPreviousDay(date);
      if (oldDate.getFullYear() == date.getFullYear()) {
        if (data.length === 0 || (data.length > 0 && data[data.length - 1][0].valueOf() != oldDate.valueOf())) {
          data.push([oldDate.valueOf(), tracker.getOldBalance()]);
        }
      }
      data.push( [date.valueOf(), tracker.getBalance()] );
      tracker.commit();
    } else if (new Date(date.getFullYear(), 11, 31) - date === 0) {
      data.push([date.valueOf(), tracker.getBalance()]);
    }
  }

  factory.getChartData = function() {
    init();
    var balanceData = [],
      lossData = [],
      ptoIterator = getPtoIterator(0),
      curYear = $rootScope.getFullYear,
      endDate = new Date(prorateEnd),
      curDate = new Date(prorateStart),
      curPto = ptoIterator.next(),
      accrued = balanceTracker(startingBalance),
      lost = balanceTracker(0);
    lost.commit();

    while (curDate.valueOf() <= endDate.valueOf()) {
      //if its the 15th or last day of the month
      //increase the accrued by the emps accrue amount
      if (isLastDayOfMonth(curDate) || curDate.getDate() == 15) {
        accrued.setBalance(accrued.getBalance() + (hireYearVar/empStatusVar) / 3);
      }

      //if days are in PTO list then subtract
        if (curPto !== null && curPto.dateFrom <= curDate.valueOf() && curDate.valueOf() <= curPto.dateTo) {
          //if current date is not a floating holiday
          if( curPto.floats.indexOf( curDate.valueOf() ) < 0 ){
            var n = curDate.getDay();
            //weekends do not count against PTO
            if (n !== 0 && n != 6) {
              //if its not a weekend day then subtract from PTO
              var ptoVar = (curPto.halfDays) ? 4 : 8;
              //if PTO is set as half days then subtract 4 hours intead of 8
              accrued.setBalance(accrued.getBalance() - ptoVar);
            }
          }
        }

      //get total hours earned todate variable
      if( ( curDate.getMonth() + "-" + curDate.getDate() ) === ( $rootScope.nowDate.getMonth() + "-" + $rootScope.nowDate.getDate() ) ){
        $rootScope.todateHoursAvailable = accrued.getBalance().toFixed(2);
        $rootScope.todateHoursLost = lost.getBalance().toFixed(2);
      }
      //if accrued has gone over 80
      //set the lost balance and set accrued to 80
      if (accrued.getBalance() > ( 80 / empStatusVar ) ) {
        lost.setBalance(lost.getBalance() + accrued.getBalance() - ( 80 / empStatusVar ) );
        accrued.setBalance( 80 / empStatusVar );
      }

      //push the date.valueOf and balance to array ["1411501806158","72.2"]
      addData(accrued, curDate, balanceData);
      addData(lost, curDate, lossData);

      //increase date by one day before next loop
      curDate.setDate(curDate.getDate() + 1);

      //setup next date from ptoList
      if (curPto !== null && curPto.dateTo < curDate) {
        curPto = ptoIterator.next();
      }

    }

    return {
      ptoBalance: balanceData,
      ptoBalanceEnd: balanceData[balanceData.length - 1],
      lostBalance: lossData,
      lostBalanceEnd: lossData[lossData.length - 1]
    };
  };

  return factory;
});
