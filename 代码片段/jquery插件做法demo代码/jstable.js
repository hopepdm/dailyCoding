
;(function($){
// 插件的内容在这里 
 $.fn.extend({
    jsTable: function(opt, callback) {
    	var defaultOpt={
    		name:"默认的名字",
    		background:"blue",
    		width: 200
    	}
    	var finalConfig= $.extend(defaultOpt, opt); // 正式的配置

    	// 干正事
    	this.empty();
    	this.html('<table style="background:'+finalConfig.background+'" class="table"> <thead> <tr> <th>#</th> <th>First Name</th> <th>Last Name</th> <th>Username</th> </tr> </thead> <tbody> <tr> <th scope="row">1</th> <td>Mark</td> <td>Otto</td> <td>@mdo</td> </tr> <tr> <th scope="row">2</th> <td>Jacob</td> <td>Thornton</td> <td>@fat</td> </tr> <tr> <th scope="row">3</th> <td>Larry</td> <td>the Bird</td> <td>@twitter</td> </tr> </tbody> </table>');

    	//处理逻辑
    	this.find("th").click(function(){
    		alert("hi bitch");
    	});

 

    	if(callback) callback("done");
    }
});

})(jQuery);
