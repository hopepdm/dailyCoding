
var Width = $(window).width();
var Height = $(window).height();

function whatBrowser() {
	if (window.navigator.userAgent.indexOf('compatible') != -1) {
		
		createLoadingHtml();
		// console.log("dd");
		$(".failure").show();
		$("body").css("background-color", '#fff');
		return;
	}
	
}

function isMobile(){
	
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Opera Mobi|Windows CE|Symbian|Windows Phone|POLARIS|lgtelecom|nokia|SonyEricsson|LG|SAMSUNG|Samsung/i  
                .test(window.navigator.userAgent)) {
            //移动端浏览器  
            
        return true;
    }
    return false;
}

function createLoadingHtml(){
	var loadHtml=
		"<div class=\"loading\">"+
			"<div class=\"logo\"> <img src=\"images/logo.png\" /> </div>"+
			"<div class=\"loadbox\"> <i class=\"num\" id=\"num\">0%</i>"+
				"<div class=\"loadbar\"> <span id=\"left\"></span> </div>"+
			"</div>"+
		"</div>"+
		"<div class=\"failure\"> <i></i>"+
			"<p>您当前浏览器不支持三维文物的浏览，请更换IE10以上版本、chrome、firefox浏览器进行查看。</p>"+
			"<p>"+
				"<a href=\"http://dlsw.baidu.com/sw-search-sp/gaosu/2015_08_31_14/bind2/14744/ChromeStandalone_v44.0.2403.157_Setup_14744_BDdl.exe\">点击下载chrome</a>"+
			"</p>"+
		"</div>";
	$("#ThreeJS").before(loadHtml);
	// document.body.appendChild(loadHtml);
}
// whatBrowser();