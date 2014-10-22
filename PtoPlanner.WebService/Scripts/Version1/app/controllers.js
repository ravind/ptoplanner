app.controller('ptoController', function ($scope, ptoManager, floatingHolidayChecker) {
    $scope.startingBalance = ptoManager.getStartingBalance();
    ptoManager.updatePtoList(function (success) {
        if (success) {
            $scope.ptoList = ptoManager.getPtoList();
        } else {
            alert("Error fetching PTO List.");
        }
    });
    $scope.ptoTypes = ptoManager.getPtoTypes();
    $scope.currentPto = ptoManager.getNewPto();

    $scope.savePto = function () {
        $scope.currentPto.StartDate = new Date(Date.parse($scope.currentPto.StartDate));
        $scope.currentPto.EndDate = new Date(Date.parse($scope.currentPto.EndDate));
        ptoManager.savePto($scope.currentPto, function (success) {
            if (success)
            {
                $scope.ptoList = ptoManager.getPtoList();
                $scope.currentPto = ptoManager.getNewPto();
            } else {
                alert("Error saving PTO.");
            }
        });
    }

    $scope.removePto = function (url) {
        ptoManager.removePto(url, function (success) {
            if (success) {
                $scope.ptoList = ptoManager.getPtoList();
            } else {
                alert("Error deleting PTO.");
            }
        });
    }

    $scope.startingBalanceChanged = function () {
        ptoManager.setStartingBalance($scope.startingBalance);
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