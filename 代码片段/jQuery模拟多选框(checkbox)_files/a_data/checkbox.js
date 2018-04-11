;(function($){
	$.fn.extend({
		checkbox : function(){
			return this.each(function(){
				var $this = $(this);
				if($this.hasClass("on")){
    				$this.siblings("input").prop("checked","checked");
    			}else{
    				$this.siblings("input").removeAttr("checked");
    			}
    			$this.on("click",function(){
					if($this.hasClass("on")){
						$this.siblings("input").removeAttr("checked");
						$this.removeClass("on");
					}else{
						$this.siblings("input").prop("checked","checked");
						$this.addClass("on");
					}
				});	
			});
		}
	});	
})(jQuery);
