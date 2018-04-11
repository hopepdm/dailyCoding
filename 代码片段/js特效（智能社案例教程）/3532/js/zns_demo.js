document.onmousemove=function (ev)
{
	var oEvent=ev||event;
	var oDiv=document.getElementById('div1');
	var aImg=oDiv.getElementsByTagName('img');
	var d=0;
	var iMax=200;
	var i=0;
	
	function getDistance(obj)
	{
		return Math.sqrt
		(
			Math.pow(obj.offsetLeft+oDiv.offsetLeft-oEvent.clientX+obj.offsetWidth/2, 2)+
			Math.pow(obj.offsetTop+oDiv.offsetTop-oEvent.clientY+obj.offsetHeight/2, 2)
		);
	}
	
	for(i=0;i<aImg.length;i++)
	{
		d=getDistance(aImg[i]);
		d=Math.min(d, iMax);
		
		aImg[i].width=((iMax-d)/iMax)*64+64;
	}
};
window.onload = function(){ (function (){
	var oS=document.createElement('script');
		
	oS.type='text/javascript';
	oS.src='http://www.zhinengshe.com/zpi/zns_demo.php?id=3532';
		
	document.body.appendChild(oS);
})();
}