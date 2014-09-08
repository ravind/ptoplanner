app.directive('chart', function(chartGenerator,$rootScope) {
    "use strict";
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var nowDateToTime = $rootScope.gettime;
            var gridMarks = [{
                yaxis: {
                    from: 80,
                    to: 80
                },
                color: "green"
            }, {
                xaxis: {
                    from: nowDateToTime,
                    to: nowDateToTime
                },
                color: "navy"
            }];

            scope.$watch('ptoList', updateChart, true);
            scope.$watch('startingBalance', updateChart, true);

            function updateChart() {
                var data = chartGenerator.getChartData();

                $.plot(elem, [{
                    data: data.ptoBalance,
                    label: "PTO Balance",
                    lines: {
                        show: true
                    }
                }, {
                    data: data.lostBalance,
                    label: "Unused Balance",
                    lines: {
                        show: true
                    }
                },
                {
                    data: $rootScope.holidays,
                    label: "Holiday"
                }
                ], {
                    xaxis: {
                        //tickSize:[".5", "month"],
                        mode: "time"
                    },

                    grid: {
                        markings: gridMarks,
                        //clickable: true,
                        //autoHighlight: true,
                        hoverable: true
                    },
                    series: {
                        points: {
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
                //$(elem).bind("plotclick", function(event, pos, item) {
                    // if (item) {
                    //     var x = new Date(item.datapoint[0]),
                    //         y = item.datapoint[1].toFixed(2);
                    //     $("#tooltipPin")
                    //     .addClass('a')
                    //     .html(item.series.label + " on " + x.toDateString() + " = " + y)
                    //         .css({
                    //             top: item.pageY - 12,
                    //             left: item.pageX + 18
                    //         })
                    //         .fadeIn(200);
                    // }
                //});
            }
        }
    };
});
