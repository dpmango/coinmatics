//////////
// Cookie
//////////
(function($, APP) {
  APP.Components.Cookie = {
    data: {
      $cookie: undefined,
      localstorageExists: null,
    },
    init: function(fromPjax) {
      this.getData();
      // this.showCookie();
      if (!fromPjax) {
        this.clickListeners();
      }
    },
    getData: function() {
      this.data.$cookie = $('.js-cookie');
      this.data.localstorageExists = this.checkLocalStorageExists();
    },
    showCookie: function() {
      var _this = this;
      if (_this.data.localstorageExists) {
        if (!localStorage.getItem('cookieAccepted')) {
          setTimeout(function() {
            _this.data.$cookie.addClass('is-visible');
            APP.Components.Header.data.header.container.addClass('is-cookie-spaced');
          }, 1500);
        }
      } else {
        setTimeout(function() {
          _this.data.$cookie.addClass('is-visible');
        }, 1500);
      }
    },
    clickListeners: function() {
      var _this = this;
      _document.on('click', '.js-cookie-close', function() {
        _this.data.$cookie.removeClass('is-visible');
        APP.Components.Header.data.header.container.removeClass('is-cookie-spaced');
        if (_this.data.localstorageExists) {
          localStorage.setItem('cookieAccepted', true);
        }
      });
    },
    checkLocalStorageExists: function() {
      var test = 'lsChecker';
      try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    },
  };
})(jQuery, window.APP);
