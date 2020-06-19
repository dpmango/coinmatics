//////////
// Trader
//////////
(function($, APP) {
  APP.Components.Trader = {
    data: {
      sticky: {
        $element: undefined,
        $container: undefined,
        $mobileCta: undefined,
        startPoint: 0,
        endPoint: 0,
      },
    },
    init: function(fromPjax) {
      this.buildStickyParams();
      if (!fromPjax) {
        this.clickListeners();
        this.listenScroll();
        this.listenResize();
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
      _window.on('scroll', throttle(this.stickyCard.bind(this), 10));
    },
    listenResize: function() {
      _window.on('resize', debounce(this.buildStickyParams.bind(this), 100));
    },
    buildStickyParams: function(withoutContainerHeight) {
      var $card = $('.trader-head__content-sticky');
      if ($card.length === 0) return;

      var $container = $card.parent();
      // prevent page jumps when fixed
      if (withoutContainerHeight !== true) {
        $container.css('height', $card.height());
      }

      this.data.sticky.$element = $card;
      this.data.sticky.$container = $container;

      var isMobileWidth = window.innerWidth <= 767;
      var position = $container[0].getBoundingClientRect();

      // define start position
      this.data.sticky.startPoint = $container.offset().top;

      // define stop position
      var $stop = $($card.data('stop'));
      if ($stop.length > 0) {
        var endPoint = $stop.offset().top + $stop.outerHeight() - window.innerHeight;
        if (!isMobileWidth) {
          endPoint =
            endPoint +
            window.innerHeight -
            $container.height() -
            parseInt($stop.css('padding-bottom'));
        }
        this.data.sticky.endPoint = endPoint;
      }

      if (isMobileWidth) {
        $card.attr('style', '');
        this.data.sticky.$mobileCta = $('.trader-head__mobile-cta');
      } else {
        $card.css({ left: position.left, width: position.width });
        if ($stop.length > 0) {
          if (APP.Plugins.ScrollBlock.getData().y > endPoint) {
            $card.css({ left: 0 });
          }
        }
      }
    },
    stickyCard: function() {
      var $card = this.data.sticky.$element;
      var $container = this.data.sticky.$container;
      var $mobileCta = this.data.sticky.$mobileCta;
      var startPoint = this.data.sticky.startPoint;
      var endPoint = this.data.sticky.endPoint;
      var scroll = APP.Plugins.ScrollBlock.getData();
      if (scroll.blocked) return;

      if (!$card) return;

      if (window.innerWidth <= 767) {
        if (scroll.y > 100) {
          $mobileCta.addClass('is-visible');
        } else {
          $mobileCta.removeClass('is-visible');
        }

        if (scroll.y > endPoint + 20) {
          $mobileCta.css({
            position: 'absolute',
            top: endPoint + window.innerHeight - 54 + 20,
            left: 0,
            bottom: 'auto',
          });
        } else {
          $mobileCta.attr('style', '');
          this.buildStickyParams(true);
        }

        return;
      }

      var position = $container[0].getBoundingClientRect();

      if (position.top <= 20) {
        $card.addClass('is-sticky');
      } else {
        $card.removeClass('is-sticky');
      }

      if (scroll.y > endPoint) {
        $card.css({
          position: 'relative',
          top: endPoint - startPoint + 20,
          left: 0,
        });
      } else {
        $card.attr('style', '');
        this.buildStickyParams(true);
      }
    },
  };
})(jQuery, window.APP);
