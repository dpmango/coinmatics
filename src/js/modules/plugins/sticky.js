//////////
// STICKY KIT
//////////
(function($, APP) {
  APP.Plugins.Sticky = {
    init: function(fromPjax) {
      this.initStickyKit();
      if (!fromPjax) {
        this.listenResize();
      }
    },
    listenResize: function() {
      _window.on('resize', debounce(this.initStickyKit.bind(this), 100));
    },
    initStickyKit: function() {
      var $elements = $('.page')
        .last()
        .find('.js-sticky');

      if ($elements.length === 0) return;

      $elements.each(function(i, sticky) {
        var $sticky = $(sticky);
        var dataOffsetTop = $sticky.data('offset-top')
          ? parseInt($sticky.data('offset-top'), 10)
          : 100;
        var stopWatching = $sticky.data('stop') ? mediaCondition($sticky.data('stop')) : null;

        if (stopWatching === null || !stopWatching) {
          if (!$sticky.is('.is-sticky-attached')) {
            // console.log('attaching sticky kit');
            $sticky.stick_in_parent({
              // eslint-disable-next-line camelcase
              offset_top: dataOffsetTop,
            });
            $sticky.addClass('is-sticky-attached');
          }
        } else {
          if ($sticky.is('.is-sticky-attached')) {
            // console.log('detaching sticky kit');
            $sticky.trigger('sticky_kit:detach');
            $sticky.removeClass('is-sticky-attached');
          }
        }
      });
    },
    update: function() {
      var $sticky = $('.js-sticky.is-sticky-attached');
      if ($sticky.length === 0) return;

      $sticky.trigger('sticky_kit:recalc');
      setTimeout(function() {
        $sticky.trigger('sticky_kit:recalc');
      }, 150);
    },
  };
})(jQuery, window.APP);
