//////////
// CICKS
//////////
(function($, APP) {
  APP.Plugins.Clicks = {
    init: function() {
      $(document)
        .on('click', '[href="#"]', function(e) {
          e.preventDefault();
        })
        .on('click', '[js-link]', function(e) {
          var dataHref = $(this).data('href');
          if (dataHref && dataHref !== '#') {
            e.preventDefault();
            e.stopPropagation();
            Barba.Pjax.goTo(dataHref);
          }
        })
        // prevent going the same link (if barba is connected)
        .on('click', 'a, [js-link]', function(e) {
          var href = $(this).data('href') || $(this).attr('href');
          var path = window.location.pathname;

          if (href === path.slice(1, path.length)) {
            e.preventDefault();
            e.stopPropagation();
          }
        })
        // scroll to section
        .on('click', 'a[href^="#section"]', function() {
          // section scroll
          var el = $(this).attr('href');
          var topTarget = $(el).offset().top;

          // $('body, html').animate({scrollTop: topTarget}, 1000);
          TweenLite.to(window, 1, {
            scrollTo: { y: topTarget, autoKill: false },
            ease: easingSwing,
          });

          return false;
        })
        // grid toggler
        .on('click', '[js-show-grid]', function() {
          $(this).toggleClass('is-active');
          $('.demo-grid').fadeToggle();
        })
        // cookie cleaner
        .on('click', '[js-clear-localstorage]', function() {
          localStorage.removeItem('cookieAccepted');
          APP.Components.Cookie.showCookie();
        });

      // accardeon
      _document.on('click', '.js-accardeon .accardeon__toggler', function(e) {
        var $title = $(this);
        var $element = $title.parent();
        var $content = $element.find('> .accardeon__content');

        // clear previous active element(s)
        var $siblings = $element.siblings();
        if ($siblings.length > 0) {
          $siblings.each(function(i, element) {
            var $element = $(element);
            var $content = $element.find('> .accardeon__content');

            if ($element.is('.is-active')) {
              $element.removeClass('is-active');
              $content.slideUp();
            }
          });
        }

        // related images
        var imageSelector = $title.closest('.js-accardeon').data('image-selector');
        if (imageSelector) {
          var $images = $(imageSelector);
          var index = $element.index() + 1;
          var $targetImage = $(`${imageSelector} [data-accardeon-tab='${index}']`);

          $targetImage.siblings().hide();
          $targetImage.fadeIn(250);
        }

        // target current element
        if ($element.is('.is-active')) {
          $element.removeClass('is-active');
          $content.slideUp();
        } else {
          $element.addClass('is-active');
          $content.slideDown();
        }
      });

      // tabs
      _document.on('click', '.js-tabs a', function(e) {
        var $link = $(this);
        var $li = $link.parent();
        var $container = $link.closest('.js-tabs');
        var targetTabId = $link.data('target-tab');
        var $targetTab = $('.js-tab-content[data-tab="' + targetTabId + '"]');

        if ($targetTab.length === 0) return;

        var $siblingTabs = $('.js-tab-content:not([data-tab="' + targetTabId + '"])');
        var $siblingLis = $li.siblings();

        $li.addClass('is-active');
        $siblingLis.removeClass('is-active');

        $siblingTabs.hide();
        $targetTab.fadeIn(250);

        // scroll if tab is past scrolled offset
        if ($container.data('with-scrolltop') !== undefined) {
          var dataScrollOffset = $container.data('scroll-offset')
            ? parseInt($container.data('scroll-offset'), 10)
            : 0;

          var topTarget = $targetTab.offset().top - dataScrollOffset;
          if (APP.Plugins.ScrollBlock.getData().y > topTarget) {
            TweenLite.to(window, 1, {
              scrollTo: { y: topTarget, autoKill: false },
              ease: easingSwing,
            });
          }
        }
      });

      // show intercom window
      _document.on('click', '.show-intercom', function(e) {
        e.preventDefault();
        Intercom('show');
      });

      // change locale
      _document.on('click', '.change-locale', function(e) {
        e.preventDefault();
        var $link = $(this);
        var $locale = $link.data('locale');
        var $path = $link.data('path');
        var newLocale = `/${($locale === 'ru' ? 'en' : 'ru')}`;

        const regexp = /^[/](ru|en|cn)/
        var urlWithNewLocaleAndPage = $path === "/" ? newLocale : $path.replace(regexp, newLocale)
        console.log('urlWithNewLocaleAndPage',urlWithNewLocaleAndPage)
        history.pushState(null, null, urlWithNewLocaleAndPage);
        // перезагружаем страницу
        history.go(0);
      });
    },
    destroy: function() {
      // ... code ...
    },
  };
})(jQuery, window.APP);
