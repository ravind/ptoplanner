app.controller('ptoController', function ($scope, ptoManager, floatingHolidayChecker) {
    $scope.startingBalance = ptoManager.getStartingBalance();
    $scope.ptoList = ptoManager.getPtoList();
    $scope.ptoTypes = ptoManager.getPtoTypes();

    $scope.addPto = function () {
        var fromDate = new Date(Date.parse($scope.newPto.dateFrom));
        var toDate = new Date(Date.parse($scope.newPto.dateTo));
        ptoManager.addPto(fromDate.valueOf(), toDate.valueOf(), $scope.newPto.ptoType, $scope.newPto.note);
    }

    $scope.removePto = function (id) {
        ptoManager.removePto(id);
    }

    $scope.startingBalanceChanged = function () {
        ptoManager.setStartingBalance($scope.startingBalance);
    }

    $scope.dateFromChanged = function () {
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
    }

    $scope.dateToChanged = function () {
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
        $scope.floatingHolidayResult = floatingHolidayChecker.getResults();
    }
});