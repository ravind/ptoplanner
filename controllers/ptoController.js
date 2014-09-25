app.controller('ptoController', function($scope, ptoManager, $rootScope) { //removed floatingHolidayChecker
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

  $scope.ptoTypes = ptoManager.getPtoTypes();
  $scope.newPto = {ptoType: 0,id: null,dateFrom: null,dateTo: null,note: null};

  $scope.resetPto = function() {
    $scope.newPto.id = null;
    $scope.newPto.dateFrom = null;
    $scope.newPto.dateTo = null;
    $scope.newPto.note = null;
  };
  $scope.removePto = function(id) {
    ptoManager.removePto(id);
  };
  $scope.addPto = function() {
    if ($scope.newPto.id) {
      ptoManager.removePto($scope.newPto.id);
    }
    var fromDate = new Date(Date.parse($scope.newPto.dateFrom));
    var toDate = new Date(Date.parse($scope.newPto.dateTo));
    ptoManager.addPto(fromDate.valueOf(), toDate.valueOf(), $scope.newPto.ptoType, $scope.newPto.note);
    $scope.resetPto();
  };
  $scope.editPto = function(obj) {
    var fromDate = new Date(obj.dateFrom);
    var toDate = new Date(obj.dateTo);
    $scope.newPto.id = obj.id;
    $scope.newPto.dateFrom = fromDate.toLocaleDateString();
    $scope.newPto.dateTo = toDate.toLocaleDateString();
    $scope.newPto.note = obj.comment;
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

  $scope.startingBalanceChanged = function() {
    ptoManager.setStartingBalance($scope.startingBalance);
  };

  $scope.prorateStartChanged = function() {
    ptoManager.setProrateStart($scope.prorateStart);
  };

  $scope.prorateEndChanged = function() {
    ptoManager.setProrateEnd($scope.prorateEnd);
  };

  $scope.hireYearVarChanged = function() {
    ptoManager.setHireYearVar($scope.hireYearVar);
  };

  $scope.empStatusVarChanged = function() {
    ptoManager.setEmpStatusVar($scope.empStatusVar);
  };

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

  //$scope.$watch('ptoList', updateFloatingHolidays, true);
  //function updateFloatingHolidays() {
  //$scope.floatingHolidayResult = floatingHolidayChecker.getResults();
  //}

  $scope.$watch('ptoList', updateDaysUsed, true);

  function updateDaysUsed() {
    var i = 0;
    $scope.daysUsed = 0;
    while(i < $scope.ptoList.length){
      var dateTo = $scope.ptoList[i].dateTo;
      var dateFrom = $scope.ptoList[i].dateFrom;
      var diff = ( dateTo - dateFrom ) / 86400000; //24*60*60*1000
      var adjust = (diff + 1) - $scope.ptoList[i].floats.length;
      $scope.daysUsed += adjust;
      i++;
    }
  }

});
