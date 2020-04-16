//////////
// HEADER
//////////
(function($, APP) {
  APP.Components.Header = {
    data: {
      cursor: {
        x: 0,
        y: 0,
        target: undefined,
      },
      classes: {
        fixedClass: 'is-fixed',
        visibleClass: 'is-fixed-visible',
        bodyFixed: 'is-header-fixed',
        bodyFixedVisible: 'is-header-fixed-visible',
      },
      header: {
        container: undefined,
        bottomPoint: undefined,
      },
      timer: undefined,
    },
    init: function(fromPjax) {
      if (!fromPjax) {
        this.getHeaderParams();
        this.clickListeners();
        this.listenCursor();
        this.listenScroll();
        this.listenResize();
      }

      this.closeMobileNavi();
      this.closeMegaMenu();
      this.setMenuClass();
      this.controlHeaderClass();
    },
    getHeaderParams: function() {
      var $header = $('.header');
      var headerOffsetTop = 0;
      var headerHeight = $header.outerHeight() + headerOffsetTop;

      this.data.header = {
        container: $header,
        bottomPoint: headerHeight,
      };
    },
    closeMobileNavi: function() {
      $('.js-hamburger').removeClass('is-active');
      $('.mobile-navi').removeClass('is-active');

      APP.Plugins.ScrollBlock.enableScroll();
    },
    closeMegaMenu: function(withScrollBlock) {
      if ($('.js-megamenu.is-active').length === 0) return;

      if (withScrollBlock) {
        if (APP.Browser().data.isMobile && $('.panel.is-active').length === 0) {
          // APP.Dev.LogOnScreen.showLog('enabling megamenu scroll');
          APP.Plugins.ScrollBlock.enableScroll();
        }
      }
      $('.js-megamenu-trigger a').removeClass('is-active');
      $('.js-megamenu').removeClass('is-active');
      $('body').removeClass('is-megamenu-active');
    },
    closeMegaMenuByTarget: function($target) {
      var _this = this;
      var isNotScroller = $target.closest('.megamenu__scroller').length === 0;
      var isNotHeader = $target.closest('.header').length === 0;

      if (isNotScroller && isNotHeader) {
        _this.closeMegaMenu(true);
      }
    },
    openMegaMenu: function(e) {
      var _this = this;
      var $curLink = $(this);
      var targetId = $curLink.data('for');
      var $targetMenu = $('.js-megamenu[data-id="' + targetId + '"]');

      APP.Components.Header.clickOrHoverTimeoutRouter(e, function() {
        APP.Components.Header.closeMegaMenu();

        if ($targetMenu.length > 0) {
          $curLink.addClass('is-active');
          $targetMenu.addClass('is-active');
          $targetMenu.find('.megamenu__scroller').animate({ scrollTop: 0 }, 'fast');
          if (APP.Browser().data.isMobile) {
            // APP.Dev.LogOnScreen.showLog('disabling megamenu scroll');
            APP.Plugins.ScrollBlock.disableScroll();
          }
          $('body').addClass('is-megamenu-active');
        }
      });
    },
    clickListeners: function() {
      var _this = this;

      // hamburger & mobile navi
      _document
        .on('click', '.js-hamburger', function() {
          $(this).toggleClass('is-active');
          $('.mobile-navi').toggleClass('is-active');

          if ($(this).is('.is-active')) {
            APP.Plugins.ScrollBlock.disableScroll();
          } else {
            APP.Plugins.ScrollBlock.enableScroll();
          }
        })
        .on('click', function(e) {
          var $target = $(e.target);
          var isNotHeader = $target.closest('.header').length === 0;
          var isNotScroller = $target.closest('.mobile-navi__scroller').length === 0;

          if (isNotHeader && isNotScroller) {
            _this.closeMobileNavi();
          }
        })
        .on('click', '.js-close-mobile-navi', function(e) {
          _this.closeMobileNavi();
        });

      // megamenu
      _document
        // hover triggers for opening menu
        .on('click mouseenter', '.js-megamenu-trigger a', _this.openMegaMenu)
        .on('mouseleave', '.js-megamenu-trigger a', function() {
          clearTimeout(APP.Components.Header.data.timer);
        });

      // close of hovering outside menu
      _document
        .on(
          'mouseleave',
          '.megamenu__scroller',
          debounce(
            function() {
              if (!APP.Browser().data.isMobile) {
                var $target = $(_this.data.cursor.target);
                _this.closeMegaMenuByTarget($target);
              }
            },
            150,
            { leading: false, trailing: true }
          )
        )
        // close on hovering outside menu (up on desktop)
        .on(
          'mouseleave',
          '.header',
          debounce(
            function() {
              if (!APP.Browser().data.isMobile) {
                var $target = $(_this.data.cursor.target);
                _this.closeMegaMenuByTarget($target);
              }
            },
            150,
            { leading: false, trailing: true }
          )
        )
        // close by direct click on close element (mobile)
        // no need as triggered mouseleave
        // .on('click', '.js-megamenu-close', function() {
        //   _this.closeMegaMenu(true);
        // })
        // close on both desktop/mobile by clicking outside
        .on('click', function(e) {
          var $target = $(e.target);
          _this.closeMegaMenuByTarget($target);
        });
    },
    listenScroll: function() {
      _window.on('scroll', this.scrollHeader.bind(this));
      _window.on('scroll', debounce(this.scrollHeaderDebouce.bind(this), 1250, { trailing: true }));
    },
    listenResize: function() {
      _window.on('resize', debounce(this.getHeaderParams.bind(this), 100));
    },
    listenCursor: function() {
      document.onmousemove = function(e) {
        APP.Components.Header.data.cursor = {
          x: e.pageX,
          y: e.pageY,
          target: e.target,
        };
      };
    },
    makeHeaderVisible: function() {
      this.data.header.container.addClass(this.data.classes.visibleClass);
      $('body').addClass(this.data.classes.bodyFixedVisible);
      this.data.header.isFixedVisible = true;
    },
    makeHeaderHidden: function() {
      this.data.header.container.removeClass(this.data.classes.visibleClass);
      $('body').removeClass(this.data.classes.bodyFixedVisible);
      this.data.header.isFixedVisible = false;
    },
    scrollHeaderDebouce: function() {
      // always show header after user stop scrolling
      if (this.data.header.container !== undefined) {
        this.makeHeaderVisible();
      }
    },
    scrollHeader: function() {
      var _header = this.data.header;

      if (_header.container !== undefined) {
        // get scroll params from blocker function
        var scroll = APP.Plugins.ScrollBlock.getData();

        if (scroll.blocked) return;

        // hide megamenu when started scrolling
        // this.closeMegaMenu();

        if (scroll.y > _header.bottomPoint) {
          $('body').addClass(this.data.classes.bodyFixed);
          _header.container.addClass(this.data.classes.fixedClass);

          if (scroll.y > _header.bottomPoint * 2 && scroll.direction === 'up') {
            this.makeHeaderVisible();
          } else {
            this.makeHeaderHidden();
          }
        } else {
          // emulate position absolute by giving negative transform on initial scroll
          var normalized = Math.floor(normalize(scroll.y, _header.bottomPoint, 0, 0, 100));
          var reverseNormalized = (100 - normalized) * -1;
          reverseNormalized = reverseNormalized * 1.2; // a bit faster transition

          _header.container.css({
            transform: 'translate3d(0,' + reverseNormalized + '%,0)',
          });

          // this.makeHeaderVisible();
          $('body').removeClass(this.data.classes.bodyFixed);
          _header.container.removeClass(this.data.classes.fixedClass);
        }
      }
    },
    setMenuClass: function() {
      // SET ACTIVE CLASS IN HEADER
      var headerMenuList = $('.header__menu li');
      if (headerMenuList.length === 0) return;

      headerMenuList.each(function(i, val) {
        if (
          $(val)
            .find('a')
            .attr('href') === window.location.pathname.split('/').pop()
        ) {
          $(val).addClass('is-active');
        } else {
          $(val).removeClass('is-active');
        }
      });
    },
    controlHeaderClass: function() {
      this.data.header.container.attr('data-modifier', false);

      var $modifierElement = $('.page')
        .last()
        .find('[js-header-class]');

      if ($modifierElement.length > 0) {
        this.data.header.container.attr('data-modifier', $modifierElement.data('class'));
      }
    },
    clickOrHoverTimeoutRouter: function(event, callback) {
      // router click / enter for mobile
      var eventType = event.type;
      var isMobile = APP.Browser().data.isMobile;
      var isMouse = eventType === 'mouseenter' || eventType === 'mouseover';

      // for mouse hovers and not mobile devices
      if (isMouse && !isMobile) {
        // 150ms pause if hover till going further
        APP.Components.Header.data.timer = setTimeout(callback, 150);
        // callback();
      } else {
        callback();
      }
    },
  };
})(jQuery, window.APP);
