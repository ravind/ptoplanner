app.controller('ptoController', function($scope, ptoManager, $rootScope) {
"use strict";
  $scope.startingBalance = ptoManager.getStartingBalance();
  $scope.prorateStart = ptoManager.getProrateStart();
  $scope.prorateEnd = ptoManager.getProrateEnd();

  $scope.ptoList = ptoManager.getPtoList();

  $scope.holidayList = ptoManager.getHolidays();
  $scope.floatsList = ptoManager.getFloats();

  $scope.hireYears = ptoManager.getHireYears();
  $scope.hireYearVar = ptoManager.getHireYearVar();

  $scope.empStates = ptoManager.getEmpStates();
  $scope.empStatusVar = ptoManager.getEmpStatusVar();

  $scope.newPto = {ptoType: 1,Url: null,dateFrom: null,dateTo: null,note: null, halfDays:false};

  $scope.resetPto = function() {
    $scope.newPto.ptoType = 1;
    $scope.newPto.Url = null;
    $scope.newPto.dateFrom = null;
    $scope.newPto.dateTo = null;
    $scope.newPto.note = null;
    $scope.newPto.halfDays = false;
    $rootScope.resetDP();
  };
  $scope.removePto = function(ptoURL) {
      ptoManager.removePto(ptoURL);
  };
  $scope.addPto = function() {
    if ($scope.newPto.Url) {
      ptoManager.removePto($scope.newPto.Url);
    }
    var fromDate = new Date( Date.parse( $scope.newPto.dateFrom ) );
    var toDate = new Date( Date.parse( $scope.newPto.dateTo ) );
    ptoManager.addPto(fromDate.toJSON(), toDate.toJSON(), $scope.newPto.ptoType, $scope.newPto.note, $scope.newPto.halfDays);
    $scope.resetPto();
  };
  $scope.editPto = function (obj) {
    var fromDate = new Date(obj.StartDate);
    var toDate = new Date(obj.EndDate);
    $scope.newPto.dateFrom = fromDate.toLocaleDateString();
    $scope.newPto.dateTo = toDate.toLocaleDateString();
    $scope.newPto.note = obj.Note;
    $scope.newPto.halfDays = obj.HalfDays;
    $scope.newPto.ptoType = obj.PtoType;
    $scope.newPto.Url = obj.Url;
  };

  $scope.changeFloats = function(id) {
    if ($scope.floatsList[id].used) {
      ptoManager.addFloat(id);
    } else {
      ptoManager.offFloat(id);
    }
  };
  $scope.dateFloats = function(id) {
    if (isValidDate($scope.floatsList[id].date)) {
      ptoManager.addFloat(id, $scope.floatsList[id].date);
    }
  };

  $scope.changeHoliday = function(id) {
    if ($scope.holidayList[id]) {
      ptoManager.addHoliday(id);
    } else {
      ptoManager.delHoliday(id);
    }
  };


  $scope.setupSettingsChanged = function () {

      ptoManager.setSettings($scope.startingBalance, $scope.prorateStart, $scope.prorateEnd, $scope.hireYearVar, $scope.empStatusVar);

  };

  //$scope.startingBalanceChanged = function() {
  //  ptoManager.setStartingBalance($scope.startingBalance);
  //};

  //$scope.prorateStartChanged = function() {
    //  ptoManager.setProrateStart($scope.prorateStart);
  //};

  //$scope.prorateEndChanged = function() {
  //  ptoManager.setProrateEnd($scope.prorateEnd);
  //};

  //$scope.hireYearVarChanged = function() {
  //  ptoManager.setHireYearVar($scope.hireYearVar);
  //};

  //$scope.empStatusVarChanged = function() {
  //  ptoManager.setEmpStatusVar($scope.empStatusVar);
  //};



  $scope.dateFromChanged = function() {
    if ($scope.ptoForm.dateFrom.$valid && isValidDate($scope.ptoForm.dateFrom.$modelValue)) {
      if (!$scope.newPto.dateTo | $scope.ptoForm.dateTo.$invalid) {
        $scope.newPto.dateTo = $scope.newPto.dateFrom;
      } else {
        var fromDate = Date.parse($scope.newPto.dateFrom);
        var toDate = Date.parse($scope.newPto.dateTo);

        if (toDate <= fromDate) {
          $scope.newPto.dateTo = $scope.newPto.dateFrom;
        }
      }
    }
  };

  $scope.dateToChanged = function() {
    if ($scope.ptoForm.dateTo.$valid && isValidDate($scope.ptoForm.dateTo.$modelValue)) {
      if (!$scope.newPto.dateFrom | $scope.ptoForm.dateFrom.$invalid) {
        $scope.newPto.dateFrom = $scope.newPto.dateTo;
      } else {
        var fromDate = Date.parse($scope.newPto.dateFrom);
        var toDate = Date.parse($scope.newPto.dateTo);

        if (toDate <= fromDate) {
          $scope.newPto.dateFrom = $scope.newPto.dateTo;
        }
      }
    }
  };

  function isValidDate(input) {
    var isValid = false;
    var parsed = Date.parse(input);
    if (!isNaN(parsed)) {
      var tempDate = new Date(parsed);
      if (tempDate.getFullYear() == $rootScope.getFullYear) {
        isValid = true;
      }
    }
    return isValid;
  }


  $scope.$watch('ptoList.', updateDaysUsed, true);

  function updateDaysUsed() {
    var i = 0;
    $scope.daysUsed = 0;
    $scope.todateHoursUsed = 0;
    while(i < $scope.ptoList.length){

      var dateTo = $scope.ptoList[i].dateTo;
      var dateFrom = $scope.ptoList[i].dateFrom;
      //var diff = ( dateTo - dateFrom ) / 86400000; //24*60*60*1000
      var diff = 0;

      var ptoVar = ($scope.ptoList[i].halfDays) ? 0.5 : 1;

      var whileDate = new Date(dateFrom);
      var targetDate = new Date(dateTo);
      //loop through the PTO to not log weekends
      while( whileDate.valueOf() <= targetDate.valueOf() ){
            var n = whileDate.getDay();
            if (n !== 0 && n != 6) {
              //if its not a weekend day then use it
              diff += ptoVar;
            }
        //increase date by one day before next loop
        whileDate.setDate( whileDate.getDate() + 1 );
      }

      var floatLength = ($scope.ptoList[i].floats) ? $scope.ptoList[i].floats.length : 0;
      var holidaysLength = ($scope.ptoList[i].holidays) ? $scope.ptoList[i].holidays.length : 0;
      var change = diff - floatLength;
      var adjust = change - holidaysLength;

      $scope.daysUsed += adjust;

      //!!!
      //this does not count while you are currently on PTO
      if ( $rootScope.nowDate.valueOf() > dateFrom) {
        $scope.todateHoursUsed += adjust;
      }

      i++;
    }
  }

});
