/*
 * 
 * 触摸移动插件
 * @作者 大猫猫
 * 
 * */
$.touchSlide = function(conf) {
	var opt = {
	    wrap : null,
	    item : null,
	    buttons : null,
	    buttonSelectedClass : null,
	    rightLoop : false,
	    leftLoop : false,
	    autoInterval : 0,
	    animateTime:300,
	    exceed : 1 / 5,
	    degree : 45,
	    callback : {
	        moveStart : function() {
	        },
	        moveComplete : function() {
	        }
	    }
	};
	$.extend(true, opt, conf);
	var context = {
	    currentIndex : 0,
	    maxDistance : 0,
	    minDistance : 0,
	    count : 0,
	    startX : 0,
	    startY : 0,
	    moveX : 0,
	    moveY : 0,
	    open : false,
	    itemWidth : 0
	};

	var button = {
	    clear : function() {
		    opt.buttons.each(function() {
			    $(this).removeClass(opt.buttonSelectedClass);
		    });
	    },
	    select : function(index) {
		    this.clear();
		    opt.buttons.eq(index).addClass(opt.buttonSelectedClass || "");
	    }
	};

	var degree = {
	    complete : false,
	    reset : function() {
		    this.complete = false;
	    },
	    cal : function(degree, callback) {
		    if (this.complete) {
			    return false;
		    }
		    this.complete = true;
		    var result = false;
		    var d = Math.sqrt(Math.pow(Math.abs(context.moveX), 2) + Math.pow(Math.abs(context.moveY), 2));
		    if (Math.acos(Math.abs(context.moveY) / d) * 180 / Math.PI < opt.degree) {
			    result = false;
		    } else {
			    result = true;
		    }
		    if (callback) {
			    callback(result);
		    }
		    return result;
	    }
	};

	var animate = {
		isAction:false,
		start : function(x, callback) {
			opt.callback.moveStart(operate);
			if (context.currentIndex < context.count) {
				if (opt.buttons && opt.buttonSelectedClass) {
					button.select(context.currentIndex);
				}
			}
			opt.wrap.css({
			    "-webkit-transform" : "translate3d(" + x + "px,0px,0px)",
			    "-ms-transform" : "translate3d(" + x + "px,0px,0px)",
			    "-o-transform" : "translate3d(" + x + "px,0px,0px)",
			    "-moz-transform" : "translate3d(" + x + "px,0px,0px)",
			    "-moz-transition-duration" : opt.animateTime+"ms",
			    "-o-transition-duration" : opt.animateTime+"ms",
			    "-ms-transition-duration" : opt.animateTime+"ms",
			    "-webkit-transition-duration" :opt.animateTime+ "ms"
			});
			animate.isAction = true;
			window.setTimeout(function() {
				opt.wrap.css({
				    "-moz-transition-duration" : "0ms",
				    "-o-transition-duration" : "0ms",
				    "-ms-transition-duration" : "0ms",
				    "-webkit-transition-duration" : "0ms",
				});
				if (callback) {
					callback();
				}
				opt.callback.moveComplete(operate);
				animate.isAction = false;
			}, opt.animateTime);
			opt.wrap.attr("x", x);
		}
	};

	var event = {
	    touchstart : function(e) {
		    autoInterval.stop();
		    degree.reset();
		    context.open = false;
		    var p = e.touches[0];
		    context.startX = p.pageX;
		    context.startY = p.pageY;
	    },
	    touchmove : function(e) {
	    	if(animate.isAction){
	    		return;
	    	}
		    var p = e.changedTouches[0];
		    context.moveX = p.pageX - context.startX;
		    context.moveY = p.pageY - context.startY;
		    var callback = function(r) {
			    if (r) {
				    context.open = true;
			    }
		    };
		    if (context.open || degree.cal(opt.degree, callback)) {
			    e.preventDefault();
			    e.stopPropagation();
			    var old = opt.wrap.attr("x") || 0;
			    var d = Number(old) + context.moveX;
			    if (d > 0) {
				    if (!opt.leftLoop)
					    return;
				    opt.item.eq(context.count - 1).css("position", "relative");
			    }
			    if (Math.abs(d) > context.maxDistance) {
				    if (!opt.rightLoop)
					    return;
				    opt.item.eq(0).css("position", "relative");
			    }

			    opt.wrap.css({
			        "-webkit-transform" : "translate3d(" + d + "px,0px,0px)",
			        "-moz-transform" : "translate3d(" + d + "px,0px,0px)",
			        "-ms-transform" : "translate3d(" + d + "px,0px,0px)",
			        "-o-transform" : "translate3d(" + d + "px,0px,0px)"
			    });
		    }
	    },
	    touchend : function(e) {
		    autoInterval.start();
		    if(animate.isAction){
	    		return;
	    	}
		    var callback = null;
		    if (context.open) {
			    var x = 0;
			    if (context.moveX > 0) {
				    if (Math.abs(context.moveX) > context.itemWidth * opt.exceed) {
					    if (context.currentIndex <= 0) {
						    if (!opt.leftLoop) {
							    return;
						    }
						    if (opt.buttons && opt.buttonSelectedClass) {
							    button.select(context.count - 1);
						    }
						    callback = function() {
							    opt.item.eq(context.count - 1).css("position", "static");
							    opt.wrap.css({
							        "-webkit-transform" : "translate3d(" + (-context.count * context.itemWidth) + "px,0px,0px)",
							        "-moz-transform" : "translate3d(" + (-context.count * context.itemWidth) + "px,0px,0px)",
							        "-ms-transform" : "translate3d(" + (-context.count * context.itemWidth) + "px,0px,0px)",
							        "-o-transform" : "translate3d(" + (-context.count * context.itemWidth) + "px,0px,0px)"
							    });
							    operate.moveTo(context.count - 1);
						    };
					    }
					    x = 0 - (--context.currentIndex) * context.itemWidth;
				    } else {
					    callback = function() {
						    opt.item.eq(context.count - 1).css("position", "static");
					    };
					    x = 0 - context.currentIndex * context.itemWidth;
				    }
			    } else if (context.moveX < 0) {
				    if (Math.abs(context.moveX) > context.itemWidth * opt.exceed) {
					    if (context.currentIndex >= context.count - 1) {
						    if (!opt.rightLoop) {
							    return;
						    }
						    if (opt.buttons && opt.buttonSelectedClass) {
							    button.select(0);
						    }
						    callback = function() {
							    opt.item.eq(0).css("position", "static");
							    opt.wrap.css({
							        "-webkit-transform" : "translate3d(0px,0px,0px)",
							        "-moz-transform" : "translate3d(0px,0px,0px)",
							        "-ms-transform" : "translate3d(0px,0px,0px)",
							        "-o-transform" : "translate3d(0px,0px,0px)"
							    });
							    operate.moveTo(0);
						    };
					    }
					    x = 0 - (++context.currentIndex) * context.itemWidth;
				    } else {
					    callback = function() {
						    opt.item.eq(0).css("position", "static");
					    };
					    x = 0 - (context.currentIndex) * context.itemWidth;
				    }
			    }
			    animate.start(x, callback);
		    }
		    context.open = false;
	    }
	};
	var autoInterval = {
	    timer : null,
	    start : function() {
		    if (!opt.autoInterval) {
			    return;
		    }
		    this.stop();
		    this.timer = window.setInterval(function() {
			    operate.next();
		    }, opt.autoInterval);
	    },
	    stop : function() {
		    window.clearInterval(this.timer);
	    }
	};

	var operate = {
	    context : context,
	    animateTo : function(index) {
		    context.currentIndex = index;
		    var x = 0 - index * context.itemWidth;
		    animate.start(x);
	    },
	    moveTo : function(index) {
		    context.currentIndex = index;
		    var x = 0 - index * context.itemWidth;
		    opt.callback.moveStart(operate);
		    opt.wrap.css({
		        "-webkit-transform" : "translate3d(" + x + "px,0px,0px)",
		        "-ms-transform" : "translate3d(" + x + "px,0px,0px)",
		        "-moz-transform" : "translate3d(" + x + "px,0px,0px)",
		        "-o-transform" : "translate3d(" + x + "px,0px,0px)"
		    });
		    opt.wrap.attr("x", x);
		    opt.callback.moveComplete(operate);
	    },
	    next : function() {
		    var callback = null;
		    if (context.currentIndex >= context.count - 1) {
			    if (!opt.rightLoop) {
				    return;
			    }
			    opt.item.eq(0).css("position", "relative");
			    if (opt.buttons && opt.buttonSelectedClass) {
				    button.select(0);
			    }
			    callback = function() {
				    opt.item.eq(0).css("position", "static");
				    opt.wrap.css({
				        "-webkit-transform" : "translate3d(0px,0px,0px)",
				        "-ms-transform" : "translate3d(0px,0px,0px)",
				        "-moz-transform" : "translate3d(0px,0px,0px)",
				        "-o-transform" : "translate3d(0px,0px,0px)"
				    });
				    operate.moveTo(0);
			    };
		    }
		    x = 0 - (++context.currentIndex) * context.itemWidth;
		    animate.start(x, callback);
	    },
	    prev : function() {
		    var callback = null;
		    if (context.currentIndex <= 0) {
			    if (!opt.leftLoop) {
				    return;
			    }
			    opt.item.eq(context.count - 1).css("position", "relative");
			    if (opt.buttons && opt.buttonSelectedClass) {
				    button.select(context.count - 1);
			    }
			    callback = function() {
				    opt.item.eq(context.count - 1).css("position", "static");
				    opt.wrap.css({
				        "-webkit-transform" : "translate3d(0px,0px,0px)",
				        "-ms-transform" : "translate3d(0px,0px,0px)",
				        "-moz-transform" : "translate3d(0px,0px,0px)",
				        "-o-transform" : "translate3d(0px,0px,0px)"
				    });
				    operate.moveTo(context.count - 1);
			    };
		    }
		    var x = 0 - (--context.currentIndex) * context.itemWidth;
		    animate.start(x);
	    },
	    load : function() {
		    if (!opt.item || !opt.wrap || opt.item.length < 2) {
			    opt.buttons.hide();
			    return this;
		    }
		    context.itemWidth = document.documentElement.clientWidth;
		    context.count = opt.item.length;
		    opt.wrap.width(context.count * context.itemWidth);
		    context.maxDistance = (context.count - 1) * context.itemWidth;
		    opt.item.eq(0).css("left", context.count * context.itemWidth);
		    opt.item.eq(context.count - 1).css("left", -context.count * context.itemWidth);
		    var events = [ 'touchstart', 'touchmove', 'touchend' ];
		    opt.wrap.unbind();
		    for ( var e in events) {
			    opt.wrap.on(events[e], event[events[e]]);
		    }
		    this.moveTo(context.currentIndex);
		    autoInterval.start();
		    return this;
	    }
	};
	return operate.load();
};
