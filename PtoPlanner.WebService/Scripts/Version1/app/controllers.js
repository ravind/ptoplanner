app.controller('ptoController', function ($scope, ptoManager, settingsManager, floatingHolidayChecker) {

    function init() {
        $scope.ptoTypes = ptoManager.getPtoTypes();
        $scope.empStatuses = settingsManager.getEmployeeStatuses();

        settingsManager.getAllYears(function (data) {
            $scope.yearList = data;

            //Select current year if present in list, otherwise select latest year in list
            var curYear = new Date().getFullYear();
            var selYear = null;
            for (var i = 0; i < data.length; i++) {
                selYear = data[i];
                if (selYear == curYear) break;
            }
            $scope.selectedYear = selYear;
            selectedYearChanged();
        });
    };

    init();

    $scope.saveSettings = function () {
        if ($scope.curSettings.ProrateStart) {
            $scope.curSettings.ProrateStart = new Date(Date.parse($scope.curSettings.ProrateStart));
        }
        if ($scope.curSettings.ProrateEnd) {
            $scope.curSettings.ProrateEnd = new Date(Date.parse($scope.curSettings.ProrateEnd));
        }
        settingsManager.saveSettings($scope.curSettings, function (success) {
            if (success) {
                refreshSettings();
            } else {
                alert("Error saving Settings.");
            }
        });
    }

    $scope.savePto = function () {
        if ($scope.currentPto.Url) {
            $scope.removePto($scope.currentPto.Url);
            $scope.currentPto.Url = "";
        }
        $scope.currentPto.StartDate = new Date(Date.parse($scope.currentPto.StartDate));
        $scope.currentPto.EndDate = new Date(Date.parse($scope.currentPto.EndDate));
        ptoManager.savePto($scope.currentPto, function (success) {
            if (success)
            {
                refreshPtoList();
                $scope.currentPto = ptoManager.getNewPto();
            } else {
                alert("Error saving PTO.");
            }
        });
    }

    $scope.editPto = function (obj) {
        var startDate = new Date(obj.StartDate);
        var endDate = new Date(obj.EndDate);
        obj.StartDate = startDate.toLocaleDateString();
        obj.EndDate = endDate.toLocaleDateString();
        $scope.currentPto = obj;

    };

    $scope.removePto = function (url) {
        ptoManager.removePto(url, function (success) {
            if (success) {
                refreshPtoList();
            } else {
                alert("Error deleting PTO.");
            }
        });
    }

    $scope.selectedYearChanged = selectedYearChanged;
    function selectedYearChanged() {
        $scope.currentPto = ptoManager.getNewPto();
        refreshSettings();
        refreshPtoList();
    }

    function refreshSettings()
    {
        settingsManager.getSettings($scope.selectedYear, function (data) {
            $scope.curSettings = data;
        });
    }

    function refreshPtoList()
    {
        ptoManager.refreshPtoList($scope.selectedYear, function (data) {
            $scope.ptoList = data;
        });
    }

    $scope.dateFromChanged = function () {
        if ($scope.ptoForm.dateFrom.$valid && isValidDate($scope.ptoForm.dateFrom.$modelValue)) {
            if (!$scope.currentPto.EndDate | $scope.ptoForm.dateTo.$invalid) {
                $scope.currentPto.EndDate = $scope.currentPto.StartDate;
            } else {
                var fromDate = Date.parse($scope.currentPto.StartDate);
                var toDate = Date.parse($scope.currentPto.EndDate);

                if (toDate <= fromDate) {
                    $scope.currentPto.EndDate = $scope.currentPto.StartDate;
                }
            }
        }
    }

    $scope.dateToChanged = function () {
        if ($scope.ptoForm.dateTo.$valid && isValidDate($scope.ptoForm.dateTo.$modelValue)) {
            if (!$scope.currentPto.StartDate | $scope.ptoForm.dateFrom.$invalid) {
                $scope.currentPto.StartDate = $scope.currentPto.EndDate;
            } else {
                var fromDate = Date.parse($scope.currentPto.StartDate);
                var toDate = Date.parse($scope.currentPto.EndDate);

                if (toDate <= fromDate) {
                    $scope.currentPto.StartDate = $scope.currentPto.EndDate;
                }
            }
        }
    }

    function isValidDate(input)
    {
        var isValid = false;
        var parsed = Date.parse(input);
        if (!isNaN(parsed)) {
            var tempDate = new Date(parsed);
            if (tempDate.getFullYear() == new Date().getFullYear()) {
                isValid = true;
            }
        }
        return isValid;
    }

    $scope.$watch('ptoList', updateFloatingHolidays, true);

    function updateFloatingHolidays() {
        $scope.floatingHolidayResult = floatingHolidayChecker.getResults($scope.ptoList);
    }
});