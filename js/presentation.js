(function() {
  var Presentation,
    _this = this;

  Presentation = (function() {

    function Presentation() {
      var _this = this;
      this.next = function() {
        return Presentation.prototype.next.apply(_this, arguments);
      };
      this.prev = function() {
        return Presentation.prototype.prev.apply(_this, arguments);
      };
      this.checkHash = function() {
        return Presentation.prototype.checkHash.apply(_this, arguments);
      };
      this.$presentation = $('.presentation');
      this.$current = $('section').first();
      this.y = 0;
      this.$presentation.css('transition-duration', '1s');
      this.bind();
      this.resize();
      this.checkHash();
      this.highlight();
    }

    Presentation.prototype.bind = function() {
      this.bindKeys();
      this.bindGestures();
      this.bindResize();
      return this.bindHashChange();
    };

    Presentation.prototype.bindKeys = function() {
      key('right, down, space, return, j, l', this.next);
      return key('left, up, backspace, k, h', this.prev);
    };

    Presentation.prototype.bindGestures = function() {
      Hammer(document).on('swipeleft swipeup', this.next);
      return Hammer(document).on('swiperight swipedown', this.prev);
    };

    Presentation.prototype.bindResize = function() {
      var _this = this;
      return $(window).resize(function() {
        _this.resize();
        return _this.go(_this.$current);
      });
    };

    Presentation.prototype.bindHashChange = function() {
      return $(window).on('hashchange', this.checkHash);
    };

    Presentation.prototype.resize = function() {
      var height, min, paddingH, paddingV, width, _ref;
      _ref = [$(window).width(), $(window).height()], width = _ref[0], height = _ref[1];
      if (width > height) {
        min = height;
        paddingV = '20px';
        paddingH = "" + ((width - 1.3 * height) / 2) + "px";
      } else {
        min = width;
        paddingH = '20px';
        paddingV = "" + ((height - width / 1.3) / 2) + "px";
      }
      return $('section').css({
        'font-size': "" + (min * 0.4) + "%",
        'padding': "" + paddingV + " " + paddingH
      });
    };

    Presentation.prototype.checkHash = function() {
      var $section, hash, slide;
      hash = window.location.hash;
      slide = hash.substr(2);
      $section = this.find(slide);
      if (!$section.is(this.$current)) {
        return this.go($section);
      }
    };

    Presentation.prototype.highlight = function() {
      return hljs.initHighlightingOnLoad();
    };

    Presentation.prototype.prev = function() {
      if (this.hasSteps()) {
        return this.prevStep();
      } else {
        return this.prevSlide();
      }
    };

    Presentation.prototype.prevSlide = function() {
      var $prev;
      $prev = this.$current.prev('section');
      return this.go($prev);
    };

    Presentation.prototype.prevStep = function() {
      var $prev;
      this.$steps.eq(this.index).removeClass('step').fadeOut();
      $prev = this.$steps.eq(--this.index);
      if (!(this.index < -1)) {
        if ($prev.is(':visible')) {
          return $prev.addClass('step').trigger('step');
        } else if (this.index > -1) {
          return this.prevStep();
        }
      } else {
        return this.prevSlide();
      }
    };

    Presentation.prototype.next = function() {
      if (this.hasSteps()) {
        return this.nextStep();
      } else {
        return this.nextSlide();
      }
    };

    Presentation.prototype.nextSlide = function() {
      var $next;
      $next = this.$current.next('section');
      return this.go($next);
    };

    Presentation.prototype.nextStep = function() {
      var $next;
      this.$steps.eq(this.index).removeClass('step');
      $next = this.$steps.eq(++this.index);
      if ($next.length) {
        return $next.fadeIn().addClass('step').trigger('step');
      } else {
        return this.nextSlide();
      }
    };

    Presentation.prototype.checkSteps = function($section) {
      this.$steps = $section.find('.steps').children();
      if (!this.$steps.length) {
        this.$steps = $section.find('.step');
      }
      this.index = -1;
      return this.$steps.hide();
    };

    Presentation.prototype.hasSteps = function() {
      return (this.$steps != null) && this.$steps.length !== 0;
    };

    Presentation.prototype.find = function(slide) {
      var $section;
      if (slide instanceof $) {
        return slide;
      } else {
        $section = $("#" + slide);
        if ($section.length === 0) {
          $section = $('section').eq(parseInt(slide) - 1);
        }
        return $section;
      }
    };

    Presentation.prototype.go = function(slide) {
      var $section, y;
      if (slide == null) {
        slide = 1;
      }
      $section = this.find(slide);
      if ($section.length) {
        this.checkSteps($section);
        window.location.hash = "/" + ($section.attr('id') || $section.index() + 1);
        y = $section.prevAll().map(function() {
          return $(this).outerHeight();
        }).get().reduce(function(memo, height) {
          return memo + height;
        }, 0);
        $('.presentation').css('transform', "translateY(-" + y + "px)");
        this.$current.removeClass('current');
        $section.addClass('current').trigger('current');
        return this.$current = $section;
      }
    };

    return Presentation;

  })();

  window.Presentation = Presentation;

}).call(this);
