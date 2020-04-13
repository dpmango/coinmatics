//////////
// Chart
//////////
(function($, APP) {
  APP.Plugins.Chart = {
    init: function() {
      var $charts = $('.js-chart');
      if ($charts.length === 0) return;
      $charts.each(function(i, chart) {
        var $chart = $(chart);
        var chartCtx = chart.getContext('2d');

        var elData = {
          labels: $chart.data('labels'),
          values: $chart.data('values'),
        };

        var data = {
          labels: elData.labels,
          datasets: [
            {
              backgroundColor: 'transparent',
              borderColor: '#18DCA6',
              data: elData.values,
            },
          ],
        };

        var options = {
          color: function(context) {
            var index = context.dataIndex;
            var value = context.dataset.data[index];
            return value < 0 ? '#AF4052' : '#18DCA6';
          },
          legend: {
            display: false,
          },
          tooltips: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                display: true,
              },
            ],
            yAxes: [
              {
                display: false,
              },
            ],
          },
        };

        // initialize
        var chart = new Chart(chartCtx, {
          type: 'line',
          data: data,
          options: options,
        });
      });
    },
  };
})(jQuery, window.APP);

// var config = {
//   type: 'line',
//   data: {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//     datasets: [{
//       label: 'Unfilled',
//       fill: false,
//       backgroundColor: window.chartColors.blue,
//       borderColor: window.chartColors.blue,
//       data: [
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor()
//       ],
//     }, {
//       label: 'Dashed',
//       fill: false,
//       backgroundColor: window.chartColors.green,
//       borderColor: window.chartColors.green,
//       borderDash: [5, 5],
//       data: [
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor()
//       ],
//     }, {
//       label: 'Filled',
//       backgroundColor: window.chartColors.red,
//       borderColor: window.chartColors.red,
//       data: [
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor(),
//         randomScalingFactor()
//       ],
//       fill: true,
//     }]
//   },
//   options: {
//     responsive: true,
//     title: {
//       display: true,
//       text: 'Chart.js Line Chart'
//     },
//     tooltips: {
//       mode: 'index',
//       intersect: false,
//     },
//     hover: {
//       mode: 'nearest',
//       intersect: true
//     },
//     scales: {
//       xAxes: [{
//         display: true,
//         scaleLabel: {
//           display: true,
//           labelString: 'Month'
//         }
//       }],
//       yAxes: [{
//         display: true,
//         scaleLabel: {
//           display: true,
//           labelString: 'Value'
//         }
//       }]
//     }
//   }
// };

// window.onload = function() {
//   var ctx = document.getElementById('canvas').getContext('2d');
//   window.myLine = new Chart(ctx, config);
// };
