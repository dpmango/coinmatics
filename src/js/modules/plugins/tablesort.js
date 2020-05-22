////////////////////
// TABLE SORT
////////////////////
(function($, APP) {
  APP.Plugins.Tablesort = {
    init: function() {
      var _this = this;

      var $tables = $('[js-sortable-table]');
      if ($tables.length === 0) return;
      $tables.each(function(i, table) {
        new Tablesort(table);
      });
    },
  };
})(jQuery, window.APP);
