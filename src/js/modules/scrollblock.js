//////////
// ScrollBlock
//////////

// disable / enable scroll by setting negative margin to page-content eq. to prev. scroll
// this methods helps to prevent page-jumping on setting body height to 100%

(function($, APP) {
  APP.Plugins.ScrollBlock = {
    data: {
      y: _window.scrollTop(),
      blocked: false,
      direction: undefined,
      lastForScrollDir: 0,
      fillGapMethod: 'padding',
      scrolllDisabled: false,
    },
    getData: function() {
      return this.data;
    },
    fillScrollbarGap: function() {
      // this.fillGapTarget($('.header').get(0));
      this.fillGapTarget(document.body);
    },
    unfillScrollbarGap: function() {
      // this.unfillGapTarget($('.header').get(0));
      this.unfillGapTarget(document.body);
    },
    disableScroll: function() {
      // prevent double lock
      if ($('body').is('.body-lock') || $('body').is('.body-m-lock')) return;
      if (this.data.scrolllDisabled) return;
      // which elements are scrollable when scroll is locked?
      var $blockers = $('.blocker');

      if ($blockers.length > 0) {
        $blockers.each(function(i, el) {
          disablePageScroll(el);
        });
        this.data.scrolllDisabled = true;
        this.data.blocked = true;
        // console.log('disabling scroll', $blockers);
        if (APP.Browser().data.isMobile) {
          $('body').addClass('body-m-lock');
        } else {
          // this.fillScrollbarGap();
          $('body').addClass('body-lock');
        }
      }
    },

    enableScroll: function(target) {
      if ($('.blocker').length) return;
      var _this = this;

      clearQueueScrollLocks();
      enablePageScroll();
      this.data.scrolllDisabled = false;
      this.data.blocked = false;
      this.data.direction = 'up';
      // console.log('enabling scroll');
      if (APP.Browser().data.isMobile) {
        $('body').removeClass('body-m-lock');
      } else {
        // this.unfillScrollbarGap();
        $('body').removeClass('body-lock');
      }
    },
    getWindowScroll: function() {
      if (this.data.blocked) return;

      var wScroll = _window.scrollTop();
      this.data.y = wScroll;
      this.data.direction = wScroll > this.data.lastForScrollDir ? 'down' : 'up';

      this.data.lastForScrollDir = wScroll <= 0 ? 0 : wScroll;
    },
    listenScroll: function() {
      _window.on('scroll', this.getWindowScroll.bind(this));
    },
    fillGapTarget: function($target) {
      if ($target instanceof Node) {
        let scrollBarWidth;
        scrollBarWidth = this.getScrollBarWidth($target, true);

        var computedStyle = window.getComputedStyle($target);

        var fillGapMethod = this.data.fillGapMethod;
        if (fillGapMethod === 'margin') {
          var currentMargin = parseFloat(computedStyle.marginRight);
          $target.style.marginRight = `${currentMargin + scrollBarWidth}px`;
        } else if (fillGapMethod === 'width') {
          $target.style.width = `calc(100% - ${scrollBarWidth}px)`;
        } else if (fillGapMethod === 'max-width') {
          $target.style.maxWidth = `calc(100% - ${scrollBarWidth}px)`;
        } else if (fillGapMethod === 'padding') {
          var currentPadding = parseFloat(computedStyle.paddingRight);
          $target.style.paddingRight = `${currentPadding + scrollBarWidth}px`;
        }
      }
    },
    unfillGapTarget: function($target) {
      if ($target instanceof Node) {
        var fillGapMethod = this.data.fillGapMethod;

        if (fillGapMethod === 'margin') {
          $target.style.marginRight = '';
        } else if (fillGapMethod === 'width') {
          $target.style.width = '';
        } else if (fillGapMethod === 'max-width') {
          $target.style.maxWidth = '';
        } else if (fillGapMethod === 'padding') {
          $target.style.paddingRight = '';
        }
      }
    },
    getScrollBarWidth: function($target) {
      if ($target instanceof Node) {
        var documentWidth = document.documentElement.clientWidth;
        var windowWidth = window.innerWidth;
        var currentWidth = windowWidth - documentWidth;
        return currentWidth;
      } else {
        return 0;
      }
    },
  };
})(jQuery, window.APP);
