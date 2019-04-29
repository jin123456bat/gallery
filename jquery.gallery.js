jQuery.fn.extend({
	gallery:function(args){
		var args = args||{};
		
		var afterLoad = args.afterLoad;
		
		var afterClose = args.afterClose;
		
		$(this).on('click',function(){
			var bg = $('<div></div>').css({
				position:'fixed',
				width:'100%',
				height:'100%',
			    top: '0px',
			    left: '0px',
			    backgroundColor: 'rgb(0,0,0)',
			    zIndex: 1001,
			    opacity: 0,
			});
			
			if(args.ajax)
			{
				var image_url = null;
				$.ajax({
					url:args.ajax.url,
					method:args.ajax.method||'GET',
					data:args.ajax.data||{},
					async:false,
					success:function(response){
						image_url = args.ajax.success(response);
					}
				});
				
				if(typeof image_url == 'string')
				{
					var is_image = true;
					image = $('<img src="'+image_url+'">');
				}
				else if(image_url instanceof jQuery)
				{
					var is_image = false;
					image = image_url;
				}
				else
				{
					return false;
				}
			}
			else
			{
				var image = $(this).clone();
				if(image.data('image'))
				{
					var image = $('<img src="'+image.data('image')+'">');
				}
			}
			
			var speed = 500;
			var easing = 'swing';
			
			$('body').append(bg).append(image);
			bg.animate({
				opacity: '.8',
			}).on('click',function(){
				bg.remove();
				image.remove();
				if(afterClose)
				{
					afterClose();
				}
				return false;
			});

			image.on('load',function(){
				if(is_image)
				{
					var height = image.get(0).naturalHeight;
					var width = image.get(0).naturalWidth;
				}
				else
				{
					var height = image.height();
					var width = image.width();
				}
				
				var see_width = document.documentElement.clientWidth;
				var see_height = document.documentElement.clientHeight;
				if(height > see_height)
				{
					var per = (see_height*0.8/height);
					
					height *= per;
					width *= per;
				}
				
				while(height < see_height*0.5 && width < see_width*0.5)
				{
					height *= 1.1;
					width *= 1.1;
				}
				
				var top = (see_height - height)/2;
				var left = (see_width - width)/2;
				

				image.css({
					width:width,
					height:height,
					top:top,
					left:left,
					position:'fixed',
				    zIndex: '1002',
				}).on('click',function(){
					return false;
				});
				
				if(afterLoad)
				{
					afterLoad(image);
				}
			});
		}).css({
		    cursor: 'pointer',
		});
			
	}
});