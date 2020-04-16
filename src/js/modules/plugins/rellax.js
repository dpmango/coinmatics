//////////
// RELLAX
//////////
(function($, APP) {
  APP.Plugins.Rellax = {
    data: {
      rellax: undefined,
    },
    init: function() {
      var rellax = new Rellax('.js-rellax', {
        // speed: -2,
        center: true,
        // wrapper: null,
        round: true,
        vertical: true,
        horizontal: false,
      });

      this.data.rellax = rellax;

      // lax.setup(); // init

      // const updateLax = () => {
      //   lax.update(window.scrollY);
      //   window.requestAnimationFrame(updateLax);
      // };

      // window.requestAnimationFrame(updateLax);
    },
    update: function() {
      if (this.data.rellax) {
        this.data.rellax.refresh();
      }
    },
    destroy: function() {
      this.data.rellax.destroy();
      this.data.rellax = undefined;
    },
    freeze: function() {
      var $rellax = $('.js-rellax');
      if ($rellax.length === 0) return;

      $rellax.each(function(i, el) {
        var $el = $(el);
        // var matrixTransform = $el.css('transform').split(',')[5];
        // var translate = matrixTransform.substring(0, matrixTransform.length - 1);
        // $el.css('margin-top', translate);
        $el.addClass('frozen');
      });
    },
    unfreeze: function() {
      var $rellax = $('.js-rellax');
      if ($rellax.length === 0) return;

      $rellax.each(function(i, el) {
        var $el = $(el);
        // $el.css('margin-top', 0);
        $el.removeClass('frozen');
      });
    },
  };
})(jQuery, window.APP);
