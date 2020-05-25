//////////
// Roadmap
//////////
(function($, APP) {
  APP.Components.Roadmap = {
    init: function(fromPjax) {
      this.setWidth();
      this.initPS();
      if (!fromPjax) {
        this.listenScroll();
      }
    },
    setWidth: function() {
      var $scrollX = $('.js-set-width');

      if ($scrollX.length === 0) return;
      $scrollX.each(function(i, el) {
        var $el = $(el);
        var $childs = $el.children();
        if ($childs.length === 0) return;
        var width = 0;
        $childs.each(function(i, col) {
          width = width + $(col).width();
        });
        $el.css('width', width);
      });
    },
    listenScroll: function() {
      // _window.on('scroll', throttle(this.scrollX.bind(this), 25));
      _window.on('scroll', this.scrollX.bind(this));
      // prevent manual scroll
      $('.js-scroll-x').on('mousewheel', this.scrollXManual.bind(this));
    },
    initPS: function() {
      var container = document.querySelector('.js-scroll-x');
      var isWebkit = 'webkitRequestAnimationFrame' in window;
      // firefox & IE fix
      if (!isWebkit && !APP.Browser().data.isMobile) {
        var ps = new PerfectScrollbar(container, {
          handlers: [],
          wheelPropagation: true,
        });

        // container.addEventListener('ps-scroll-x', function(e) {
        //   e.preventDefault();
        //   e.stopPropagation();
        // });
      }
    },
    scrollXManual: function(e) {
      if (!APP.Browser().data.isMobile) {
        e.preventDefault();
      }
    },
    scrollX: function() {
      // scrollX animations
      var $scrollX = $('.js-scroll-x');
      if (APP.Browser().data.isMobile) return;

      if ($scrollX.length === 0) return;
      $scrollX.each(function(i, el) {
        var $el = $(el);
        var elTop = $el.offset().top;
        var elHeight = $el.height();
        var scrollWidth = el.scrollWidth;
        var scroll = APP.Plugins.ScrollBlock.getData();
        var isInViewportStart = scroll.y + window.innerHeight > elTop;
        var isInViewportEnd = scroll.y > elTop + elHeight;

        if (scroll.blocked) return;

        if (isInViewportStart && !isInViewportEnd) {
          var percentScrolled =
            (scroll.y + window.innerHeight - elTop) / (elHeight + window.innerHeight);
          $el.scrollLeft(percentScrolled * (scrollWidth - window.innerWidth));
          // $el.animate({ scrollLeft: percentScrolled * (scrollWidth - window.innerWidth) }, 25);
        }
      });
    },
  };
})(jQuery, window.APP);
