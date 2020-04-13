//////////
// Scaler Desktop
//////////
(function($, APP) {
  APP.Plugins.Scaler = {
    init: function(fromPjax) {
      this.getScaler();
      this.setScaler();
      if (!fromPjax) {
        this.listenResize();
      }
    },
    getScaler: function() {
      var $images = $('.page')
        .last()
        .find('.js-scaler');

      if ($images.length > 0) {
        $images.each(function(i, img) {
          var $img = $(img);
          var mobileArPx = $img.css('padding-bottom');
          var imgWidth = $img.width();
          var mobileArPercent;
          if (mobileArPx.indexOf('%') !== -1) {
            mobileArPercent = mobileArPx;
          } else {
            mobileArPercent = (mobileArPx.slice(0, -2) / imgWidth) * 100 + '%';
          }
          // save mobile ar value in %
          $img.attr('data-ar-desktop', mobileArPercent);
        });
      }
    },
    listenResize: function() {
      _window.on('resize', debounce(this.setScaler.bind(this), 100));
    },
    setScaler: function() {
      var $images = $('.page')
        .last()
        .find('.js-scaler');

      if ($images.length > 0) {
        var wWidth = window.innerWidth;
        $images.each(function(i, img) {
          var $img = $(img);
          var mobileAr = $img.data('ar-576');
          var tabletAr = $img.data('ar-768');
          var desktopAr = $img.data('ar-1200');
          var initialAr = $img.data('ar-desktop');

          if (mobileAr) {
            if (wWidth <= 576) {
              $img.css({ 'padding-bottom': APP.Plugins.Scaler.setAr(mobileAr) });
            } else {
              $img.css({ 'padding-bottom': APP.Plugins.Scaler.setAr(initialAr) });
            }
          }

          if (tabletAr) {
            if (wWidth <= 767) {
              $img.css({ 'padding-bottom': APP.Plugins.Scaler.setAr(tabletAr) });
            } else {
              $img.css({ 'padding-bottom': APP.Plugins.Scaler.setAr(initialAr) });
            }
          }

          if (desktopAr) {
            if (wWidth <= 1200) {
              $img.css({ 'padding-bottom': APP.Plugins.Scaler.setAr(desktopAr) });
            } else {
              $img.css({ 'padding-bottom': APP.Plugins.Scaler.setAr(initialAr) });
            }
          }
        });
      }
    },
    setAr: function(ar) {
      // please also check _media.sass for possible values
      if (ar === '1:1') {
        return '100%';
      } else if (ar === '16:9') {
        return '56.25%';
      } else if (ar === '4:3') {
        return '75%';
      } else if (ar === '21:9') {
        return '42.85%';
      } else if (ar === '6:4') {
        return '66.666%';
      } else if (ar === '4:6') {
        return '150%';
      } else if (ar.split('/').length) {
        var arAsWidthHeight = ar.split('/');
        if (arAsWidthHeight.length === 2) {
          return (parseInt(arAsWidthHeight[0]) / parseInt(arAsWidthHeight[1])) * 100 + '%';
        }
      }

      return ar;
    },
  };
})(jQuery, window.APP);
