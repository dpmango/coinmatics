////////////////////
// TABLE SORT
////////////////////
(function($, APP) {
  APP.Plugins.Tablesort = {
    data: {
      tablesort: undefined,
    },
    init: function() {
      var _this = this;

      var $tables = $('[js-sortable-table]');
      if ($tables.length === 0) return;
      $tables.each(function(i, table) {
        _this.data.tablesort = new Tablesort(table, {
          descending: true,
        });

        // table.addEventListener('beforeSort', function() {
        //   alert('Table is about to be sorted!');
        // });

        // table.addEventListener('afterSort', function() {
        //   alert('Table sorted!');
        // });
      });
    },
    update: function() {
      alert('table refresh called (use after html changes)');
      this.data.tablesort.refresh();
    },
  };
})(jQuery, window.APP);
