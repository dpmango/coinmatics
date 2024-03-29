//////////
// Chart
//////////
(function($, APP) {
  APP.Plugins.Chart = {
    data: {
      charts: [],
    },
    init: function(fromPjax) {
      this.resetData();
      this.extendControllers();
      if (!fromPjax) {
        this.listenScroll();
      }
    },
    resetData: function() {
      this.data.charts = [];
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
      var _this = this;
      if ($chart.length === 0) return;
      if ($chart.is('.is-rendered')) return;

      var chartCtx = $chart[0].getContext('2d');

      // getting data- attributes
      var elData = {
        labels: $chart.data('labels'),
        values: $chart.data('values'),
        groupLabels: $chart.data('group-labels'),
        type: $chart.data('type'),
      };

      var isSimpleChart = elData.type === 'simple';
      var isMonoColorChart = elData.type === 'monocolor';

      // seed (can be removed on prod)
      if (elData.values === 'seed') {
        elData.values = _this.seedValues();
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
            borderWidth: isSimpleChart ? 2 : 4,
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
              display: isSimpleChart ? false : true,
              ticks: {
                fontColor: '#75809F',
                fontFamily: "'Montserrat Alternates', sans-serif",
                fontSize: 10,
                fontStyle: '600',
                padding: 5,
                // to much callbacks, moved to pre-init transform
                // alt - afterTickToLabelConversion
                // callback: function(dataLabel, index) {
                //   // Hide the label of every 2nd dataset. return null to hide the grid line too
                //   var skip = index % 2 === 0;
                //   return index % 2 === 0 ? dataLabel : '';
                // },
              },
              gridLines: {
                color: isMonoColorChart ? '#FAFBFD' : 'rgba(117, 128, 159, 0.1)',
                zeroLineColor: isMonoColorChart ? 'rgba(0,0,0,0)' : 'rgba(117, 128, 159, 0.1)',
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
      };

      // initialize
      var chartinstance = new Chart(chartCtx, {
        type: isSimpleChart || isMonoColorChart ? 'line' : 'RedNegativeLine',
        data: data,
        options: options,
      });

      this.data.charts.push({
        element: $chart,
        instance: chartinstance,
      });

      $chart.addClass('is-rendered');
    },
    extendControllers: function() {
      Chart.defaults.RedNegativeLine = Chart.helpers.clone(Chart.defaults.line);
      Chart.controllers.RedNegativeLine = Chart.controllers.line.extend({
        update: function() {
          try {
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
            let _stroke = ctx.stroke;
            var pxRatio = this.chart.chart.currentDevicePixelRatio;
            ctx.stroke = function() {
              ctx.save();
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
              ctx.shadowColor = 'rgba(24, 220, 166, 0.56)';
              // ctx.shadowBlur = 8 * pxRatio;
              ctx.shadowBlur = 4;
              _stroke.apply(this, arguments);
              ctx.restore();
            };

            this.chart.data.datasets[0].borderColor = gradient;
          } catch (e) {}

          return Chart.controllers.line.prototype.update.apply(this, arguments);
        },
      });
    },
    seedValues: function() {
      return [
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
    },
  };
})(jQuery, window.APP);
