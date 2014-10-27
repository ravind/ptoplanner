app.directive('chart', function (chartGenerator) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var gridMarks = [{ yaxis: { from: 80, to: 80 }, color: "#ff0000" }];
            var getTime = new Date().getTime();
            scope.$watch('ptoList', dataChanged, true);
            scope.$watch('curSettings', dataChanged, true);

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                "background-color": "#fee",
                opacity: 0.80
            }).appendTo("body");

            function dataChanged(){
                updateChart(scope.curSettings, scope.ptoList, scope.standardHoliDates, scope.floatingHoliDates);
            }

            function updateChart(currentSettings, ptoList, standardHoliDates, floatingHoliDates) {

                var data = chartGenerator.getChartData(currentSettings, ptoList, standardHoliDates, floatingHoliDates);
                if(!data){
                    return;
                }
                scope.todateHoursAvailable = data.todateHoursAvailable;
                scope.todateHoursLost = data.todateHoursLost;
                scope.todateEarned = data.todateEarned;
                scope.lostBalance = Math.floor(data.lostBalanceEnd[1]);
                scope.ptoBalance = Math.floor(data.ptoBalanceEnd[1]);

                if (!data) return;
                $.plot(elem, [{
                    data: data.ptoBalance,
                    label: "PTO Balance",
                    lines: {
                        show: true
                    },
                    color: "#fff",
                    points: {
                        fillColor: "#fff"
                    }
                }, {
                    data: data.lostBalance,
                    label: "Expired Balance",
                    lines: {
                        show: true
                    },
                    color: "#ffcb32",
                    points: {
                        fillColor: "#ffcb32",
                        symbol: "triangle" // or "diamond", "square", "cross"
                    }
                }], {
                    xaxis: {
                        mode: "time"
                    },
                    minTickSize: [1, "month"],
                    grid: {
                        aboveData: false,
                        borderWidth: 0,
                        borderColor: "#fff",
                        color: "#fff",
                        //backgroundColor: '#555',
                        margin: 5,
                        labelMargin: 8,
                        //axisMargin: 0,
                        //clickable: true,
                        //autoHighlight: true,
                        hoverable: true,
                        markings: [{
                            yaxis: {
                                from: data.empStatusVar,
                                to: data.empStatusVar
                            },
                            lineWidth: 2,
                            color: "#111"
                        }, {
                            xaxis: {
                                from: getTime,
                                to: getTime
                            },
                            lineWidth: 2,
                            color: "#555"
                        }]
                    },
                    series: {
                        points: { show: true },
                        lines: {
                            lineWidth: 2,
                            fill: true,
                            fillColor: "rgba(255, 255, 255, 0.17)"
                        }
                    }
                });


                $(elem).bind("plothover", function (event, pos, item) {
                    if (item) {
                        var x = new Date(item.datapoint[0]),
                            y = item.datapoint[1].toFixed(2);

                        $("#tooltip").html(item.series.label + " on " + x.toDateString() + " = " + y)
                            .css({ top: item.pageY + 5, left: item.pageX + 5 })
                            .fadeIn(200);
                    } else {
                        $("#tooltip").hide();
                    }
                });
            }
        }
    };
});

app.directive('onLastRepeat', function () {
    return function (scope, element, attrs) {
        if (scope.$last) setTimeout(function () {
            scope.$emit('onLastRepeated', element, attrs);
        }, 1);
    };
})