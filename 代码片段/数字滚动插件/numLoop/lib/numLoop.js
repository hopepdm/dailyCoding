;
(function($) {
    // 插件的内容在这里
    $.fn.extend({
        numLoop: function(opt, callback) {
            var defaultOpt = {
                isAuto: false,
                time: 1000,
                isRight: true
            }
            var finalConfig = $.extend(defaultOpt, opt); // 正式的配置

            // 干正事
            var $numBox = this;
            var _qian = $numBox.data('num');
            var _numText = _qian + '';
            var numArr = _numText.split('');
            $numBox.append('<span class="num-item"><span class="num-item-main qian"></span></span>')
            for (var i = 0; i < numArr.length; i++) {
                $numBox.append('<span class="num-item"><span class="num-item-main num" data-value="' + numArr[i] + '"></span></span>')
            }
            //处理逻辑
            if (finalConfig.isAuto) {
                setTimeout(function() {
                    numLoopCtrl($numBox);
                }, finalConfig.time);
            } else {
                if (finalConfig.isRight) {
                    var winH = $(window).height();
                    var X = $numBox.offset().top;
                    if (X <= (winH / 2)) {
                        numLoopCtrl($numBox);
                    }
                    $(window).on('scroll', function() {
                        var _top = $(this).scrollTop();
                        if (_top >= X - winH / 2) {
                            numLoopCtrl($numBox);
                        }
                    });
                    console.log(X);
                } else {
                    numLoopCtrl($numBox);
                }
            }

            function numLoopCtrl(el) {
                var $box = el;
                $box.find('.num-item-main.num').each(function(index, el) {
                    var $this = $(this)
                    var _num = $(this).data('value');
                    if (_num === 0) {
                        _num = 10;
                    }
                    console.log(_num);
                    var _value = _num * 77;
                    $(this).animate({
                        backgroundPositionX: '0',
                        backgroundPositionY: -_value
                    }, 1000);
                });
            }

            if (callback) callback("done");
        }
    });

})(jQuery);
//花喵当道
