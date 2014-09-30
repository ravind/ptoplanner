app.directive('chart', function(chartGenerator, $rootScope) {
  "use strict";
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {

      scope.$watch('ptoList', updateChart, true);
      scope.$watch('floatsList', updateChart, true);
      scope.$watch('startingBalance', updateChart, true);
      scope.$watch('prorateStart', updateChart, true);
      scope.$watch('prorateEnd', updateChart, true);
      scope.$watch('empStatusVar', updateChart, true);
      scope.$watch('hireYearVar', updateChart, true);

      function updateChart() {
        var data = chartGenerator.getChartData();

        $rootScope.ptoBalance = (data.ptoBalanceEnd && data.ptoBalanceEnd.length) ? Math.floor( data.ptoBalanceEnd[1] ) : 0;
        $rootScope.lostBalance = (data.lostBalanceEnd && data.lostBalanceEnd.length) ? Math.floor( data.lostBalanceEnd[1] ) : 0;

        $.plot(elem, [{
            data: data.ptoBalance,
            label: "PTO Balance",
            lines: {
              show: true
            },
            color:"#fff",
            points: {
              fillColor: "#fff"
            }
          }, {
            data: data.lostBalance,
            label: "Unused Balance",
            lines: {
              show: true
            },
            color:"#ffcb32",
            points: {
              fillColor: "#ffcb32",
              symbol: "triangle" // or "diamond", "square", "cross"
            }
          }
          //, {
          //     data: $rootScope.holidays,
          //     label: "Holiday"
          // }
        ], {
          //colors: ["white", "cyan", "#cb4b4b", "#4da74d", "#9440ed"],
          xaxis: {
            //tickSize:[".5", "month"],
            mode: "time"
          },
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
                from: 80 / scope.empStatusVar,
                to: 80 / scope.empStatusVar
              },
              lineWidth: 2,
              color: "#111"
            }, {
              xaxis: {
                from: $rootScope.gettime,
                to: $rootScope.gettime
              },
              lineWidth: 2,
              color: "#555"
            }]
          },
          series: {
            //shadowSize: 4,
            points: {
              show: true
            },
            lines: {
              lineWidth: 2,
              fill: true,
              fillColor: "rgba(255, 255, 255, 0.17)"
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
                left: item.pageX + 22
              })
              .show();
          } else {
            $("#tooltip").hide();
          }
        });
        //$(elem).bind("plotclick", function(event, pos, item) {
        //});
      }
    }
  };
});
