app.directive('chart', function(chartGenerator) {
    "use strict";
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var nowDateToTime = new Date().getTime();
            var gridMarks = [{
                yaxis: {
                    from: 80,
                    to: 80
                },
                color: "#f69"
            }, {
                xaxis: {
                    from: nowDateToTime,
                    to: nowDateToTime
                },
                color: "lightgreen"
            }];

            scope.$watch('ptoList', updateChart, true);
            scope.$watch('startingBalance', updateChart, true);

            function updateChart() {
                var data = chartGenerator.getChartData();
                $.plot(elem, [{
                    data: data.ptoBalance,
                    label: "PTO Balance"
                }, {
                    data: data.lostBalance,
                    label: "Unused Balance"
                }], {
                    xaxis: {
                        mode: "time"
                        //,tickSize:[".5", "month"]
                    },

                    grid: {
                        markings: gridMarks,
                        hoverable: true
                    },
                    series: {
                        points: {
                            show: true
                        },
                        lines: {
                            show: true
                        }
                    }
                });

                $(elem).bind("plothover", function(event, pos, item) {
                    if (item) {
                        var x = new Date(item.datapoint[0]),
                            y = item.datapoint[1].toFixed(2);

                        $("#tooltip").html(item.series.label + " on " + x.toDateString() + " = " + y)
                            .css({
                                top: item.pageY - 12,
                                left: item.pageX + 18
                            })
                            .fadeIn(200);
                    } else {
                        $("#tooltip").hide();
                    }
                });
            }
        }
    };
});
