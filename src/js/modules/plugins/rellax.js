//////////
// RELLAX
//////////
(function($, APP) {
  APP.Plugins.Rellax = {
    init: function() {
      var rellax = new Rellax('.js-rellax', {
        speed: -2,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false,
      });
    },
  };
})(jQuery, window.APP);
