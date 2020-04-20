//////////
// MODALS
//////////
(function($, APP) {
  APP.Plugins.Modals = {
    data: {
      startWindowScroll: 0,
      lastModal: undefined,
    },
    init: function(fromPjax) {
      if (!fromPjax) {
        this.clickListeners();
        this.modalListeners();
      }
    },
    modalListeners: function() {
      var _this = this;

      _document
        .on($.modal.BEFORE_OPEN, function(event, modal) {
          setTimeout(function() {
            modal.$blocker.addClass('mfp-ready');
          }, 50);
        })
        .on($.modal.OPEN, function(event, modal) {
          _this.data.lastModal = modal;
          APP.Plugins.ScrollBlock.disableScroll();

          var $inputs = modal.$blocker.find('input');
          if ($inputs.length > 0) {
            $inputs.first().focus();
          }
        })
        .on($.modal.BEFORE_CLOSE, function(event, modal) {
          modal.$blocker.addClass('mfp-removing');
        })
        .on($.modal.CLOSE, function(event, modal) {
          _this.data.lastModal = undefined;
          APP.Plugins.ScrollBlock.enableScroll();
        });
    },
    openModal: function(target) {
      var $content = $(target);
      var mainClass = $content.data('animation') ? $content.data('animation') : 'fade-zoom';

      // prevent opening same modal
      if (this.data.lastModal && this.data.lastModal.$elm.attr('id') === $content.attr('id')) {
        return;
      } else {
        if ($.modal.isActive()) {
          $.modal.close();
          setTimeout(function() {
            $content.modal({
              blockerClass: `${mainClass} `,
            });
          }, 300);
        } else {
          $content.modal({
            blockerClass: `${mainClass} `,
          });
        }
      }
    },
    clickListeners: function() {
      _document.on('click', '.js-popup', function(e) {
        var $link = $(this);
        var target = $link.attr('href');

        APP.Plugins.Modals.openModal(target);

        return false;
      });

      _document.on('click', '.js-close-popup, .mfp-close', function() {
        $.modal.close();
      });
      _document.on('click', '.modal', function(e) {
        if ($(e.target).closest('.popup-dialog').length === 0) {
          $.modal.close();
        }
      });
    },
  };
})(jQuery, window.APP);
