//////////
// Chart
//////////
(function($, APP) {
  APP.Plugins.Chart = {
    init: function(fromPjax) {
      this.extendControllers();
      this.listenScroll();
    },
    renderAllCharts: function() {
      // var _this = this;
      // var $charts = $('.js-chart');
      // if ($charts.length === 0) return;
      // $charts.each(function(i, chart) {
      // _this.renderChart(chart);
      // });
    },
    listenScroll: function() {
      // Attached animation on entering viewport
      var $charts = $('.js-chart-scroll:not(.is-rendered)');

      if ($charts.length === 0) return;
      $charts.each(function(i, el) {
        var $el = $(el);
        var elWatcher = scrollMonitor.create($el);

        elWatcher.enterViewport(
          throttle(
            function() {
              APP.Plugins.Chart.renderChart($el);
            },
            100,
            {
              leading: true,
            }
          )
        );
      });
    },
    // manual initialization
    renderChart: function($chart) {
      if ($chart.length === 0) return;
      if ($chart.is('.is-rendered')) return;

      var chartCtx = $chart[0].getContext('2d');

      // getting data- attributes
      var elData = {
        labels: $chart.data('labels'),
        values: $chart.data('values'),
        groupLabels: $chart.data('group-labels'),
      };

      // seed (can be removed on prod)
      if (elData.values === 'seed') {
        elData.values = [
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
          seedRandom(),
        ];
      }

      // groupping labels
      if (elData.groupLabels) {
        var adjustedLabels = [];
        elData.labels.forEach(function(label) {
          var empties = Array(parseInt(elData.groupLabels) - 1).fill('');
          adjustedLabels.push(label);
          adjustedLabels.push(...empties);
        });

        elData.labels = adjustedLabels;
      }

      var data = {
        labels: elData.labels,
        datasets: [
          {
            yAxisID: 'y-axis-0',
            backgroundColor: 'transparent',
            borderColor: '#18DCA6',
            fill: true,
            borderWidth: 4,
            data: elData.values,
            // doesnt work
            // borderColor: function(context) {
            //   var index = context.dataIndex;
            //   var value = context.dataset.data[index];
            //   return value < 0 ? '#AF4052' : '#18DCA6';
            // },
            pointRadius: 0,
            tension: 0.4,
          },
        ],
      };

      var options = {
        // responsive
        maintainAspectRatio: false,
        onResize: () => {},
        // legends
        legend: {
          display: false,
        },
        tooltips: {
          display: false,
        },
        elements: {
          point: {
            display: false,
          },
        },
        // scales
        scales: {
          xAxes: [
            {
              display: true,
              ticks: {
                // to much callbacks, moved to pre-init transform
                // alt - afterTickToLabelConversion
                // callback: function(dataLabel, index) {
                //   // Hide the label of every 2nd dataset. return null to hide the grid line too
                //   var skip = index % 2 === 0;
                //   return index % 2 === 0 ? dataLabel : '';
                // },
              },
              gridLines: {
                color: 'rgba(117, 128, 159, 0.2)',
                zeroLineColor: 'rgba(117, 128, 159, 0.2)',
                drawBorder: false,
              },
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        // layout
        layout: {},
        // plugins
        // plugins: {
        //   deferred: {
        //     xOffset: 1,
        //     yOffset: '10%',
        //     delay: 500,
        //   },
        // },
      };

      // initialize
      new Chart(chartCtx, {
        type: 'RedNegativeLine',
        data: data,
        options: options,
      });

      $chart.addClass('is-rendered');
    },
    extendControllers: function() {
      Chart.defaults.RedNegativeLine = Chart.helpers.clone(Chart.defaults.line);
      Chart.controllers.RedNegativeLine = Chart.controllers.line.extend({
        update: function() {
          // get the min and max values
          var min = Math.min.apply(null, this.chart.data.datasets[0].data);
          var max = Math.max.apply(null, this.chart.data.datasets[0].data);
          var yScale = this.getScaleForId(this.getDataset().yAxisID);

          // figure out the pixels for these and the value 0
          var top = yScale.getPixelForValue(max);
          var zero = yScale.getPixelForValue(0);
          var bottom = yScale.getPixelForValue(min);

          // build a gradient that switches color at the 0 point
          var ctx = this.chart.chart.ctx;
          var gradient = ctx.createLinearGradient(0, top, 0, bottom);
          var ratio = Math.min((zero - top) / (bottom - top), 1);
          gradient.addColorStop(0, '#18DCA6');
          gradient.addColorStop(ratio, '#18DCA6');
          gradient.addColorStop(ratio, '#AF4052');
          gradient.addColorStop(1, '#AF4052');

          // shadow blur
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowColor = 'rgba(24, 220, 166, 0.56)';
          ctx.shadowBlur = 8;

          this.chart.data.datasets[0].borderColor = gradient;

          return Chart.controllers.line.prototype.update.apply(this, arguments);
        },
      });
    },
  };
})(jQuery, window.APP);
