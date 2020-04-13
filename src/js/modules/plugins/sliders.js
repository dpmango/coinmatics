//////////
// SLIDERS
//////////
(function($, APP) {
  APP.Plugins.Sliders = {
    data: {
      swipers: [],
      responsiveSwipers: {
        productsSwiper: {
          instances: [],
          enableOn: 991,
        },
      },
    },
    init: function(fromPjax) {
      if (!fromPjax) {
        this.initSwipers();
        this.initSwiperDataTree();
        this.initResponsiveSwipers();
        this.listenResize();
      }
    },
    reinit: function() {
      // without resize listeners double check
      this.initSwipers();
      this.initSwiperDataTree();
      this.initResponsiveSwipers();
    },
    update: function(selector) {
      var $swiper;
      // if selector passed - update only with selector
      if (selector) {
        $swiper = $(`${selector}.swiper-container-initialized`);
      } else {
        $swiper = $('.swiper-container-initialized');
      }

      if ($swiper.length > 0) {
        $swiper.each(function(i, swiper) {
          $(swiper)[0].swiper.update();
        });
      }
    },
    listenResize: function() {
      _window.on('resize', debounce(this.initResponsiveSwipers.bind(this), 200));
    },
    initSwipers: function() {
      var _this = this;
      var $page = $('.page').last();

      // TRADERS gallery (initialization as a group)
      // TRADERS main is dependand on thumbs
      var haveTradersThumbs = $page.find('.js-swiper-traders-thumbs').length > 0;
      var haveTradersMain = $page.find('.js-swiper-traders').length > 0;
      if (haveTradersThumbs && haveTradersMain) {
        var selector = '.js-swiper-traders-thumbs:not(.swiper-container-initialized)';
        var $thumbs = $page.find(selector);

        $thumbs.each(function(i, thumb) {
          var id = $(thumb).data('swiper-group-id');
          new Swiper(thumb, {
            watchOverflow: true,
            setWrapperSize: false,
            slidesPerView: 3,
            normalizeSlideIndex: true,
            slideToClickedSlide: true,
            on: {
              init: function() {
                initTradersSwiper(id, this);
              },
            },
            breakpoints: {
              1201: {
                slidesPerView: 5,
              },
            },
          });
        });
      }

      function initTradersSwiper(id, thumbsInstance) {
        // Traders main
        var selector = `.js-swiper-traders[data-swiper-group-id="${id}"]`;
        if ($page.find(selector).length > 0) {
          tradersSwiperRouter(selector, thumbsInstance);
          // _window.on(
          //   'resize',
          //   debounce(function() {
          //     tradersSwiperRouter(selector, thumbsInstance);
          //   }, 200)
          // );
        }
      }

      function tradersSwiperRouter(selector, thumbsInstance) {
        var options = {
          loop: false,
          watchOverflow: true,
          setWrapperSize: false,
          slidesPerView: 'auto',
          normalizeSlideIndex: false,
          centeredSlides: true,
          autoHeight: true,
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
          },
          thumbs: {
            swiper: thumbsInstance,
          },
        };

        if (window.innerWidth <= 767) {
          options = $.extend(options, {
            spaceBetween: 4,
          });
        } else {
          options = $.extend(options, {
            effect: 'fade',
            fadeEffect: {
              crossFade: true,
            },
            // simulateTouch: false,
          });
        }

        // initial initialization
        // var instance = $(selector)[0].swiper;
        // var cond = instance ? (instance.destroyed ? false : true) : false;

        // if (cond) {
        //   instance.destroy(true, true);
        // }
        new Swiper(selector, options);
      }
    },
    initSwiperDataTree: function() {
      var productsSwiper = '.js-products-swiper';
      if ($(productsSwiper).length > 0) {
        this.initSwiperTree(productsSwiper, 'productsSwiper');
      }
    },
    initResponsiveSwipers: function() {
      var productsSwiper = '.js-products-swiper';
      if ($(productsSwiper).length > 0) {
        this.responsiveSwiperConstructor(productsSwiper, 'productsSwiper', {
          watchOverflow: true,
          setWrapperSize: false,
          spaceBetween: 0,
          slidesPerView: 'auto',
          freeMode: true,
          freeModeSticky: true,
        });
      }
    },
    initSwiperTree: function(selector, name) {
      var _this = this;
      _this.data.responsiveSwipers[name].instances = [];
      $(selector).each(function(i, sw) {
        _this.data.responsiveSwipers[name].instances.push(undefined);
      });
    },
    responsiveSwiperConstructor: function(selector, objName, options) {
      var dataObj = this.data.responsiveSwipers[objName];

      $(selector).each(function(idx, element) {
        if (window.innerWidth <= dataObj.enableOn) {
          if (dataObj.instances[idx] === undefined) {
            dataObj.instances[idx] = new Swiper(element, options);
          }
        } else {
          if (dataObj.instances[idx] !== undefined) {
            dataObj.instances[idx].destroy(true, true);
            dataObj.instances[idx] = undefined;
          }
        }
      });

      this.data.responsiveSwipers[objName] = dataObj;
    },

    destroy: function() {
      // ... code ...
    },
  };
})(jQuery, window.APP);
