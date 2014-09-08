app.directive('chart', function(chartGenerator,$rootScope) {
    "use strict";
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

            scope.$watch('ptoList', updateChart, true);
            scope.$watch('startingBalance', updateChart, true);

            function updateChart() {
                var data = chartGenerator.getChartData();

                $.plot(elem, [{
                    data: data.ptoBalance,
                    label: "PTO Balance",
                    lines: {
                        show: true
                    },
                    points: {
                        symbol: "diamond" // or "diamond", "triangle", "cross"
                    }
                }, {
                    data: data.lostBalance,
                    label: "Unused Balance",
                    lines: {
                        show: true
                    },
                    points: {
                        symbol: "square" // or "diamond", "triangle", "cross"
                    }
                },
                {
                    data: $rootScope.holidays,
                    label: "Holiday",
                    points: {
                        symbol: "triangle" // or "diamond", "triangle", "cross"
                    }
                }
                ], {
                    xaxis: {
                        //tickSize:[".5", "month"],
                        mode: "time"
                    },

                    grid: {
                        markings: [{
                            yaxis: {
                                from: 80,
                                to: 80
                            },
                            lineWidth:5,
                            color: "#ccc"
                        }, {
                            xaxis: {
                                from: $rootScope.gettime,
                                to: $rootScope.gettime
                            },
                            lineWidth:5,
                            color: "#ddd"
                        }],
                        borderWidth: {top: 1, right: 1, bottom: 1, left: 1},
                        borderColor: {top: "#ccc", right: "#ccc", bottom: "#ccc", left: "#ccc"},
                        //clickable: true,
                        //autoHighlight: true,
                        hoverable: true
                    },
                    series: {
                        points: {
                            //symbol: "square", // or "diamond", "triangle", "cross"
                            show: true
                        }
                    }
                });

                $(elem).bind("plothover", function(event, pos, item) {
                    if (item) {
                        var x = new Date(item.datapoint[0]),
                            y = (item.series.label !== "Holiday") ? " = " + item.datapoint[1].toFixed(2) : '';

                        $("#tooltip").html(item.series.label + " - " + x.toDateString() + y)
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
