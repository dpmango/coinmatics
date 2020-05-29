////////////////////
// STACK TABLE
////////////////////
(function($, APP) {
  APP.Plugins.Stacktable = {
    init: function(fromPjax) {
      var _this = this;

      var $tables = $('.page')
        .last()
        .find('[js-stacktable]');
      if ($tables.length === 0) return;
      $tables.each(function(i, table) {
        $(table).stacktable();
      });

      this.copyAttrs();
      this.listenHovers();
    },
    copyAttrs: function() {
      // coppy tr attributes from original table to cloned
      var $tableOriginal = $('.page')
        .last()
        .find('[js-stacktable]');
      var $tableTarget = $('.page')
        .last()
        .find('.stacktable.small-only');

      if ($tableOriginal.length === 0) return;
      var $rowsOriginal = $tableOriginal.find('tbody tr');
      var $rowsTarget = $tableTarget.find('tr:not(:first-child)');
      var orininalCellsCount = $rowsOriginal.first().find('td').length;

      $rowsOriginal.each(function(i, tr) {
        var fromSearch = i * orininalCellsCount;
        var $linkedRows = $rowsTarget.slice(fromSearch, fromSearch + orininalCellsCount);

        if ($linkedRows.length) {
          $linkedRows.each(function(i, ttr) {
            if (i === 0) {
              $(ttr).addClass('is-name');
            }
            $(ttr).attr('data-for', $(tr).index());

            // clone attributes one by one
            $.each(tr.attributes, function() {
              if (this.specified) {
                $(ttr).attr(this.name, this.value);
              }
            });
          });
        }
      });
    },
    listenHovers: function() {
      var _this = this;
      $('.page')
        .last()
        .find('.stacktable.small-only tr')
        .on('mouseenter', function() {
          $('.stacktable.small-only tr.is-name').removeClass('is-hovered');
          _this.findNameRow(this).addClass('is-hovered');
        });
    },
    findNameRow: function(tr) {
      var $tr = $(tr);
      var dataId = $tr.data('for');
      return $tr.siblings('.is-name[data-for="' + dataId + '"]');
    },
  };
})(jQuery, window.APP);
