//////////
// PARALLAX
//////////
(function($, APP) {
  APP.Plugins.Parallax = {
    init: function(fromPjax) {
      if (APP.Browser().data.isIe) return;

      var $parallax = $('.js-parallax:not(.is-parallax-attached)');
      if ($parallax.length === 0) return;

      $parallax.each(function(idx, parallax) {
        var $el = parallax;
        var parallaxInstance = new Parallax(parallax);
        // $el.addClass('is-parallax-attached');
      });
    },
  };
})(jQuery, window.APP);
