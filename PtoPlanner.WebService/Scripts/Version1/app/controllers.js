app.controller('ptoController', function ($scope, ptoManager, settingsManager, holidayManager) {

    function init() {
        $scope.ptoTypes = ptoManager.getPtoTypes();
        $scope.empStatuses = settingsManager.getEmployeeStatuses();
        $scope.hireYears = settingsManager.getHireYears();

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
        $scope.currentPto.StartDate = new Date(Date.parse($scope.currentPto.StartDate));
        $scope.currentPto.EndDate = new Date(Date.parse($scope.currentPto.EndDate));
        ptoManager.savePto($scope.currentPto, function (success) {
            if (success)
            {
                refreshPtoList();
                $scope.currentPto = ptoManager.getNewPto();
                updatePtoDatePickers();
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
        updatePtoDatePickers();
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
        $scope.standardHolidays = holidayManager.getStandardHolidays($scope.selectedYear);
        updateDatePickers();
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

    function updateDatePickers()
    {
        var curYear = $scope.selectedYear;

        //bind jqueryUI datepicker to
        $('[data-dp]').each(function () {
            var $this = $(this);
            $this.datepicker("destroy");
            $this.datepicker({
                minDate: new Date("01/01/" + curYear),
                maxDate: new Date("12/31/" + curYear)
            });
        });

        updatePtoDatePickers();
    }

    function updatePtoDatePickers()
    {
        var curYear = $scope.selectedYear;

        //Bind datepicker with min & max to the from & to inputs
        $dateFrom = $("#dateFrom");
        $dateTo = $("#dateTo");
        $dateFrom.datepicker("destroy");
        $dateFrom.datepicker({
            minDate: new Date("01/01/" + curYear),
            maxDate: new Date("12/31/" + curYear),
            onClose: function (selectedDate) {
                if (selectedDate) {
                    $dateTo.datepicker("option", "minDate", selectedDate);
                }
            }
        });

        $dateTo.datepicker("destroy");
        $dateTo.datepicker({
            minDate: new Date("01/01/" + curYear),
            maxDate: new Date("12/31/" + curYear),
            onClose: function (selectedDate) {
                if (selectedDate) {
                    $dateFrom.datepicker("option", "maxDate", selectedDate);
                }
            }
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

    $scope.$on('onLastRepeated', function (scope, element, attrs) {
        var curYear = $scope.selectedYear;
        //bind jqueryUI datepicker to
        $('[data-qdp]').each(function () {
            var $this = $(this);
            $this.datepicker("destroy");
            var dpData = $this.data("qdp");
            //if it has quarter end month number add min & max
            if (dpData.qEnd) {
                $this.datepicker({
                    minDate: new Date(curYear, dpData.qEnd - 3, 1),
                    maxDate: new Date(curYear, dpData.qEnd, 0)
                });
            }
        });
    });

    $scope.$watch('ptoList', updateFloatingHolidays, true);
    function updateFloatingHolidays() {
        $scope.floatingHolidays = holidayManager.getFloatingHolidays($scope.ptoList);
    }

    $scope.$watch('floatingHolidays', saveFloatingHolidays, true);
    function saveFloatingHolidays() {
        var fhList = $scope.floatingHolidays;

        if (fhList) {
            for (var i = 0; i < fhList.length; i++) {
                holidayManager.saveFloatingHoliday(fhList[i], function (success) {
                    if (success) {
                        refreshPtoList();
                    }
                });
            }
        }
    }
    $scope.$watch('ptoList', updateDaysUsed, true);

    function updateDaysUsed() {
        //cancel if no list yet
        if (!$scope.ptoList) {
            return;
        }

        var i = 0;

        var floatDays = { pre: [], post: [] };
        var halfDays = { pre: [], post: [] };
        var fullDays = { pre: [], post: [] };
        var newDate = new Date();

        $scope.yeDaysUsed = 0;
        $scope.tdDaysUsed = 0;

        while (i < $scope.ptoList.length) {

            var whileDate = new Date($scope.ptoList[i].StartDate);
            var targetDate = new Date($scope.ptoList[i].EndDate);

            //loop through the PTO to not log weekends
            while (whileDate.valueOf() <= targetDate.valueOf()) {

                var n = whileDate.getDay();

                //if its not a weekend day then use it
                if (n !== 0 && n != 6) {
                    var pp = "post";
                    if (newDate.valueOf() > whileDate.valueOf()) {
                        pp = "pre";
                    }

                    if ($scope.ptoList[i].HalfDays) {
                        //push halfs
                        halfDays[pp].push(whileDate.valueOf());
                    } else {
                        //push full days
                        fullDays[pp].push(whileDate.valueOf());
                    }

                }
                //increase date by one day before next loop
                whileDate.setDate(whileDate.getDate() + 1);
            }

            i++;
        }

        var standardHoliDates = $.map($scope.standardHolidays, function (v, k) {
            return v.date.valueOf();
        });
        var floatingHoliDates = $.map($scope.floatingHolidays, function (v, k) {
            return new Date(v.date).valueOf();
        });

        //remove  holidays from pto dates
        fullDays.pre = fullDays.pre.filter(function (el) {
            return standardHoliDates.indexOf(el) < 0;
        });
        halfDays.pre = halfDays.pre.filter(function (el) {
            return standardHoliDates.indexOf(el) < 0;
        });
        fullDays.post = fullDays.post.filter(function (el) {
            return standardHoliDates.indexOf(el) < 0;
        });
        halfDays.post = halfDays.post.filter(function (el) {
            return standardHoliDates.indexOf(el) < 0;
        });
        //remove floating holidays from pto dates
        fullDays.pre = fullDays.pre.filter(function (el) {
            return floatingHoliDates.indexOf(el) < 0;
        });
        halfDays.pre = halfDays.pre.filter(function (el) {
            return floatingHoliDates.indexOf(el) < 0;
        });
        fullDays.post = fullDays.post.filter(function (el) {
            return floatingHoliDates.indexOf(el) < 0;
        });
        halfDays.post = halfDays.post.filter(function (el) {
            return floatingHoliDates.indexOf(el) < 0;
        });

        $scope.tdDaysUsed = fullDays.pre.length + (halfDays.pre.length / 2);

        var fullDayslength = fullDays.pre.length + fullDays.post.length;
        var halfDayslength = halfDays.pre.length + halfDays.post.length;
        $scope.yeDaysUsed = fullDayslength + (halfDayslength / 2);
    }
});