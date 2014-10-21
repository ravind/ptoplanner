app.directive('chart', function (chartGenerator) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var gridMarks = [{ yaxis: { from: 80, to: 80 }, color: "#ff0000" }];

            scope.$watch('ptoList', updateChart, true);
            scope.$watch('startingBalance', updateChart, true);

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                "background-color": "#fee",
                opacity: 0.80
            }).appendTo("body");

            function updateChart() {
                var data = chartGenerator.getChartData();
                $.plot(elem, [{ data: data.ptoBalance, label: "PTO Balance" }, { data: data.lostBalance, label: "Unused Balance" }], {
                    xaxis: { mode: "time" },
                    minTickSize: [1, "month"],
                    grid: { markings: gridMarks, hoverable: true },
                    series: { points: { show: true }, lines: { show: true } }
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