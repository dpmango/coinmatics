//////////
// Trader
//////////
(function($, APP) {
  APP.Components.Trader = {
    init: function(fromPjax) {
      if (!fromPjax) {
        this.clickListeners();
        this.listenScroll();
      }
    },
    clickListeners: function() {
      $('[js-trader-period-select]').on('selectric-change', function(event, element, selectric) {
        var selectValue = $(this).val();

        // update chart
        var $chart = $('.js-trader-period-chart');
        if ($chart.length === 0) return;
        var chartInst = APP.Plugins.Chart.data.charts.find(x => x.element.is($chart)).instance;
        if (!chartInst) return;

        // chartInst.data.labels.push(label);
        chartInst.data.datasets.forEach(dataset => {
          // any new array or push/remove
          dataset.data = APP.Plugins.Chart.seedValues();
        });

        chartInst.update();
      });
    },
    listenScroll: function() {
      // _window.on('scroll', throttle(this.scrollX.bind(this), 100));
    },
  };
})(jQuery, window.APP);
