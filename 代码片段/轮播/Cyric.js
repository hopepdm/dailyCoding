/*
	Cyric：	v1.0
	QQ：		360282606
	time:	2015-4-8
*/
'use strict';
function DomReady(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',function(){
			(typeof fn == 'function') && fn();
		},false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			(typeof fn == 'function') && fn();
		});
	}
}

function getById(Id){
	return document.getElementById(Id);
}

function getStyle(obj,name){
	return (obj.currentStyle || getComputedStyle(obj,false))[name];
}

function getByClass(obj,sClass){
	var reg = new RegExp('\\b'+sClass+'\\b');
	var Ele = obj.getElementsByTagName('*');
	var arr = [];
	for(var i =0;i<Ele.length;i++){
		if(reg.test(Ele[i].className)){
			arr.push(Ele[i]);
		}
	}
	return arr;
}

function addClass(obj,sClass){
	var re = new RegExp("\\b"+sClass + "\\b");	
	if(!re.test(obj.className)){
		if(obj.className){
			obj.className += " " + sClass;
		} else {
			obj.className = sClass;
		}
	}
	
}

function removeClass(obj,sClass){
	var re = c	
	
	obj.className = obj.className.replace(re,"");
	
	obj.className = obj.className.replace(/^\s+|\s+$/g,"").replace(/\s+/g," ");
	
	if(!obj.className){
		obj.removeAttribute("class");
	}
}

function getPos(obj){
	var l=0;
	var t=0
	while(obj){
		l += obj.offsetLeft;
		t += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return {left:l,top:t};
}

function bind(obj,type,fn){
	if(document.addEventListener){
		obj.addEventListener(type,fn,false);
	}else{
		obj.attachEvent('on'+type,fn);	
	}
}

function drag(obj){
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	obj.onmousedown = function(ev){
		var oEvent = ev||event;
		var disX = oEvent.clientX - getPos(obj).left;
		var disY = oEvent.clientY - getPos(obj).top - scrollTop;
		document.onmousemove = function(ev){
			var oEvent = ev||event;
			obj.style.left = oEvent.clientX - disX +'px';
			obj.style.top = oEvent.clientY - disY + scrollTop+'px';
		};
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
			obj.releaseCapture && obj.releaseCapture();
		};
		obj.setCapture && obj.setCapture();
		return false;
	};
}

function addMouseWheel(obj,fn){
	if(window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
		obj.addEventListener('DOMMouseScroll',fnWheel,false);
	}else{
		obj.onmousewheel = fnWheel;	
	}
	function fnWheel(ev){
		var oEvent = ev||event;
		var bDown = true;
		if(oEvent.detail){
			bDown = oEvent.detail > 0 ? true : false;
		}else{
			bDown = oEvent.wheelDelta > 0 ? false: true;	
		}
		fn && fn(bDown);
		obj.preventDefault && obj.preventDefault();
		return false;
	}
}

function move(obj,json,options){
	options = options || {};
	options.duration = options.duration || 700;
	options.easing = options.easing || Tween.Linear;
	
	var start = {};
	var dis = {};
	for(var name in json){
		start[name] = parseFloat(getStyle(obj,name));
		dis[name] = json[name] - start[name];
	}
	var n=0;
	var cont = parseInt(options.duration/30);
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		n++;
		for(var name in json){
			/*switch(options.easing){
				case 'linear' :
				var a = n/cont;
				var cur = start[name] + dis[name]*a;
				break;
				case 'ease-in' :
				var a = n/cont;
				var cur = start[name] + dis[name]*a*a*a;
				break;
				case 'ease-out' :
				var a = 1-n/cont;
				var cur = start[name] + dis[name]*(1-a*a*a);
				break;
			}*/
			var cur = '';
			cur = options.easing(start[name],dis[name],n/cont*options.duration,options.duration);
			if(name == 'opacity'){
				obj.style[name] = cur;
				obj.style.filter = 'alpha(opacity = '+cur*100+')';
			}else{
				obj.style[name] = cur +'px';	
			}
		}
		if(n == cont){
			clearInterval(obj.timer);
			options.complete && options.complete();
		}	
	},30);
}

function json2url(json){
	json.t = Math.random();
	var arr = [];
	for(var name in json){
		arr.push(name + '=' + encodeURIComponent(json[name]));
	}
	return arr.join('&');
}

function ajax(options){
	options = options || {};
	options.data = options.data || {};
	options.type = options.type || 'get';
	options.timeout = options.timeout || 0;
	if(!options.url) return;
	
	var str = json2url(options.data);
	if(window.XMLHttpRequest){
		var xhr = new XMLHttpRequest();
	}else{
		var xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
	if(options.type.toLowerCase() == 'get'){
		xhr.open('get',options.url + '?' + str,true);
		xhr.send();
	}else{
		xhr.open('post',options.url,true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');	
		xhr.send(str);
	}
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			clearTimeout(timer);
			if(xhr.status >= 200 && xhr.status <300 || xhr.status == 304){
				options.success && options.success(xhr.responseText);
			}else{
				options.error && options.error(xhr.status);	
			}
		}	
	};
	if(options.timeot){
		var timer = setTimeout(function(){
			xhr.abort();				
		},options.timeout);
	}
}


function jsonp(options){
	options = options || {};
	options.data = options.data || {};
	options.cbname = options.cbname || 'cb';
	options.timeout = options.timeout || 0;
	if(!options.url) return ;
	
	var fnName = ('jsonp'+Math.random()).replace('.','');
	window[fnName] = function(json){
		options.success && options.success(json);
		window[fnName] = null;	
		clearTimeout(timer);
		oHead.removeChild(oS);
	};
	options.data[options.cbname] = fnName;
	var str = json2url(options.data);
	var oS = document.createElement('script');
	oS.src = options.url + '?' + str;
	var oHead = document.getElementsByTagName('head')[0];
	oHead.appendChild(oS);
	if(options.timeout){
		var timer = setTimeout(function(){
			window[fnName] = null;	
			options.error && options.error();
		},options.timeout);	
	}
}



function setCookie(name,value,time){
	if(time){
		var oDate = new Date();
		oDate.setDate(oDate.getDate() + time);
		document.cookie = name +'='+value +';expires=' + oDate.toUTCString();	
	}else{
		document.cookie = name +'='+value;
	}
};

function getCookie(name){
	var str = document.cookie;
	var arr = str.split('; ');
	for(var i=0;i<arr.length;i++){
		var arr2 = arr[i].split('=');
		if(arr2[0] == name){
			return arr2[1];
		}
	}	
	return '';
};

function removeCookie(name){
	setCookie(name,'',-1);
};



function movedir(obj,oSpan){
	obj.onmouseover = function(ev){
		var oEvent = ev||event;
		var src = oEvent.fromElement || oEvent.relatedTarget;
		if(src && this.contains(src)) return;
		var disJson = dir(obj,oEvent);
		if(disJson.bLeft){
			oSpan.style.left = -oSpan.offsetWidth +'px';
			oSpan.style.top = 0 +'px';
		}
		if(disJson.bTop){
			oSpan.style.left = 0 +'px';
			oSpan.style.top = -oSpan.offsetHeight +'px';
		}
		if(disJson.bRight){
			oSpan.style.left = oSpan.offsetWidth +'px';
			oSpan.style.top = 0 +'px';
		}
		if(disJson.bBottom){
			oSpan.style.left = 0 +'px';
			oSpan.style.top = oSpan.offsetHeight +'px';
		}
		move(oSpan,{left:0,top:0},{duration:300,easing:Tween.Quad.easeInOut});
		oEvent.cancelBublle = true;
	};
	obj.onmouseout = function(ev){
		var oEvent = ev||event;
		var oTo = oEvent.toElement || oEvent.relatedTarget;
		if(oTo && this.contains(oTo)) return;
		//var oSpan = this.children[1];
		var disJson = dir(obj,oEvent);
		if(disJson.bLeft){
			move(oSpan,{left:-oSpan.offsetWidth,top:0},{duration:300,easing:Tween.Quad.easeOut});
		}
		if(disJson.bTop){
			move(oSpan,{left:0,top:-oSpan.offsetHeight},{duration:300,easing:Tween.Quad.easeOut});
		}
		if(disJson.bRight){
			move(oSpan,{left:oSpan.offsetWidth,top:0},{duration:300,easing:Tween.Quad.easeOut});
		}
		if(disJson.bBottom){
			move(oSpan,{left:0,top:oSpan.offsetHeight},{duration:300,easing:Tween.Quad.easeOut});
		}
		oEvent.cancelBublle = true;
	};
}
		
function dir(obj,oEvent){
	var w= obj.offsetWidth;
	var h= obj.offsetHeight;
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var x = oEvent.clientX-(getPos(obj).left+w/2);
	var y = getPos(obj).top+h/2-oEvent.clientY- scrollTop;
	//宽大于高的正切
	var n =Math.round((Math.atan2(y*w/h,x)*180/Math.PI+180)/90)%4;
	var dirJson = {bLeft:false,bTop:false,bRight:false,bBottom:false};
	switch(n){
		case 0:
		dirJson.bLeft = true;
		break;
		case 1:
		dirJson.bBottom = true;
		break;
		case 2:
		dirJson.bRight = true;
		break;
		case 3:
		dirJson.bTop = true;
		break;
	}
	return dirJson;
}



//起点，差，当前时间，总时间
var Tween = {
Linear:function (start,alter,curTime,dur) {return start+curTime/dur*alter;},
//最简单的线性变化,即匀速运动

Quad:{//二次方缓动

easeIn:function (start,alter,curTime,dur) {

return start+Math.pow(curTime/dur,2)*alter;

},

easeOut:function (start,alter,curTime,dur) {

var progress =curTime/dur;

return start-(Math.pow(progress,2)-2*progress)*alter;

},

easeInOut:function (start,alter,curTime,dur) {

var progress =curTime/dur*2;

return (progress<1?Math.pow(progress,2):-((--progress)*(progress-2) - 1))*alter/2+start;

}

},

Cubic:{//三次方缓动

easeIn:function (start,alter,curTime,dur) {

return start+Math.pow(curTime/dur,3)*alter;

},

easeOut:function (start,alter,curTime,dur) {

var progress =curTime/dur;

return start-(Math.pow(progress,3)-Math.pow(progress,2)+1)*alter;

},

easeInOut:function (start,alter,curTime,dur) {

var progress =curTime/dur*2;

return (progress<1?Math.pow(progress,3):((progress-=2)*Math.pow(progress,2) + 2))*alter/2+start;

}

},

Quart:{//四次方缓动

easeIn:function (start,alter,curTime,dur) {

return start+Math.pow(curTime/dur,4)*alter;

},

easeOut:function (start,alter,curTime,dur) {

var progress =curTime/dur;

return start-(Math.pow(progress,4)-Math.pow(progress,3)-1)*alter;

},

easeInOut:function (start,alter,curTime,dur) {

var progress =curTime/dur*2;

return (progress<1?Math.pow(progress,4):-((progress-=2)*Math.pow(progress,3) - 2))*alter/2+start;

}

},

Quint:{//五次方缓动

easeIn:function (start,alter,curTime,dur) {

return start+Math.pow(curTime/dur,5)*alter;

},

easeOut:function (start,alter,curTime,dur) {

var progress =curTime/dur;

return start-(Math.pow(progress,5)-Math.pow(progress,4)+1)*alter;

},

easeInOut:function (start,alter,curTime,dur) {

var progress =curTime/dur*2;

return (progress<1?Math.pow(progress,5):((progress-=2)*Math.pow(progress,4) +2))*alter/2+start;

}

},

Sine :{//正弦曲线缓动

easeIn:function (start,alter,curTime,dur) {

return start-(Math.cos(curTime/dur*Math.PI/2)-1)*alter;

},

easeOut:function (start,alter,curTime,dur) {

return start+Math.sin(curTime/dur*Math.PI/2)*alter;

},

easeInOut:function (start,alter,curTime,dur) {

return start-(Math.cos(curTime/dur*Math.PI/2)-1)*alter/2;

}

},

Expo: {//指数曲线缓动

easeIn:function (start,alter,curTime,dur) {

return curTime?(start+alter*Math.pow(2,10*(curTime/dur-1))):start;

},

easeOut:function (start,alter,curTime,dur) {

return (curTime==dur)?(start+alter):(start-(Math.pow(2,-10*curTime/dur)+1)*alter);

},

easeInOut:function (start,alter,curTime,dur) {

if (!curTime) {return start;}

if (curTime==dur) {return start+alter;}

var progress =curTime/dur*2;

if (progress < 1) {

return alter/2*Math.pow(2,10* (progress-1))+start;

} else {

return alter/2* (-Math.pow(2, -10*--progress) + 2) +start;

}

}

},

Circ :{//圆形曲线缓动

easeIn:function (start,alter,curTime,dur) {

return start-alter*Math.sqrt(-Math.pow(curTime/dur,2));

},

easeOut:function (start,alter,curTime,dur) {

return start+alter*Math.sqrt(1-Math.pow(curTime/dur-1));

},

easeInOut:function (start,alter,curTime,dur) {

var progress =curTime/dur*2;

return (progress<1?1-Math.sqrt(1-Math.pow(progress,2)):(Math.sqrt(1 - Math.pow(progress-2,2)) + 1))*alter/2+start;

}

},

Elastic: {//指数衰减的正弦曲线缓动

easeIn:function (start,alter,curTime,dur,extent,cycle) {

if (!curTime) {return start;}

if ((curTime==dur)==1) {return start+alter;}

if (!cycle) {cycle=dur*0.3;}

var s;

if (!extent || extent< Math.abs(alter)) {

extent=alter;

s = cycle/4;

} else {s=cycle/(Math.PI*2)*Math.asin(alter/extent);}

return start-extent*Math.pow(2,10*(curTime/dur-1)) * Math.sin((curTime-dur-s)*(2*Math.PI)/cycle);

},

easeOut:function (start,alter,curTime,dur,extent,cycle) {

if (!curTime) {return start;}

if (curTime==dur) {return start+alter;}

if (!cycle) {cycle=dur*0.3;}

var s;

if (!extent || extent< Math.abs(alter)) {

extent=alter;

s =cycle/4;

} else {s=cycle/(Math.PI*2)*Math.asin(alter/extent);}

return start+alter+extent*Math.pow(2,-curTime/dur*10)*Math.sin((curTime-s)*(2*Math.PI)/cycle);

},

easeInOut:function (start,alter,curTime,dur,extent,cycle) {

if (!curTime) {return start;}

if (curTime==dur) {return start+alter;}

if (!cycle) {cycle=dur*0.45;}

var s;

if (!extent || extent< Math.abs(alter)) {

extent=alter;

s =cycle/4;

} else {s=cycle/(Math.PI*2)*Math.asin(alter/extent);}

var progress = curTime/dur*2;

if (progress<1) {

return start-0.5*extent*Math.pow(2,10*(progress-=1))*Math.sin( (progress*dur-s)*(2*Math.PI)/cycle);

} else {

return start+alter+0.5*extent*Math.pow(2,-10*(progress-=1)) * Math.sin( (progress*dur-s)*(2*Math.PI)/cycle);

}

}

},

Back:{

easeIn: function (start,alter,curTime,dur,s){

if (typeof s == "undefined") {s = 1.70158;}

return start+alter*(curTime/=dur)*curTime*((s+1)*curTime - s);

},

easeOut: function (start,alter,curTime,dur,s) {

if (typeof s == "undefined") {s = 1.70158;}

return start+alter*((curTime=curTime/dur-1)*curTime*((s+1)*curTime + s) + 1);

},

easeInOut: function (start,alter,curTime,dur,s){

if (typeof s == "undefined") {s = 1.70158;}

if ((curTime/=dur/2) < 1) {

return start+alter/2*(Math.pow(curTime,2)*(((s*=(1.525))+1)*curTime- s));

}

return start+alter/2*((curTime-=2)*curTime*(((s*=(1.525))+1)*curTime+ s)+2);

}

},

Bounce:{

easeIn: function(start,alter,curTime,dur){

return start+alter-Tween.Bounce.easeOut(0,alter,dur-curTime,dur);

},

easeOut: function(start,alter,curTime,dur){

if ((curTime/=dur) < (1/2.75)) {

return alter*(7.5625*Math.pow(curTime,2))+start;

} else if (curTime < (2/2.75)) {

return alter*(7.5625*(curTime-=(1.5/2.75))*curTime + .75)+start;

} else if (curTime< (2.5/2.75)) {

return alter*(7.5625*(curTime-=(2.25/2.75))*curTime + .9375)+start;

} else {

return alter*(7.5625*(curTime-=(2.625/2.75))*curTime + .984375)+start;

}

},

easeInOut: function (start,alter,curTime,dur){

if (curTime< dur/2) {

return Tween.Bounce.easeIn(0,alter,curTime*2,dur) *0.5+start;

} else {

return Tween.Bounce.easeOut(0,alter,curTime*2-dur,dur) *0.5 + alter*0.5 +start;

}

}

}

};
