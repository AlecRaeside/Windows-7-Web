$(function() {
	resizeScreen();
	$(window).resize(resizeScreen);
	$("#taskbar")
		.delegate(".window-btn:not(.active)","click",function() {
			
			$(this).addClass("active");
			var win=$("<div/>",{"class":"window"}),
				chrome_tabbar = $("#templates .chrome-tabbar").clone(),
				chrome_toolbar = $("#templates .chrome-mainbar").clone(),
				chrome_iframe = $("<iframe src='http://www.google.com' class='chrome-iframe'></iframe>");
			win.append(chrome_tabbar)
			win.append(chrome_toolbar)
			win.append(chrome_iframe);
			win.prependTo("body");
			
			
			var cache = {},
				last_req;
			win.delegate(".chrome-omnibar","keyup",function () {
					var omnibar = $(this);
					var val=omnibar.text();
					
					if ( val in cache ) {
						displaySuggestions( cache[ val ] );
						return;
					}
					last_req = $.getJSON("google_autocomplete.php",{q:val},function(data, status, xhr) {
					//console.log(data);
						var suggestions = [];
						data[1].forEach(function(suggestion) {
							suggestions.push(suggestion[0]);
						})
						cache[val] = suggestions;
						displaySuggestions(suggestions);						
					})
				function displaySuggestions(suggestions) {
					var omnioptions = $(".chrome-omnioptions");
					var options = "";
					suggestions.forEach(function(suggestion) {
						options+="<span>"+suggestion+"</span>";
						
					})
					omnioptions.html(options);
					omnioptions.position({
						my:"left bottom",
						at:"left top",
						of:omnibar
					})
					.width(omnibar.outerWidth())
				}
			})
			.delegate(".chrome-omnioptions span","click",function() {
				var val=$(this).text();
					$(".chrome-iframe").attr("src","http://www.google.com/search?q="+encodeURIComponent(val));
				$(this).parent().html("");
				$(".chrome-omnibar").text("http://www.google.com/search?q="+val)
			});
			win.delegate(".chrome-mainbar > span","mousedown",function() {
				$(this).addClass("pressed");
			})
			.delegate(".chrome-mainbar > span","mouseup",function() {
				$(this).removeClass("pressed");
			}).delegate(".tab:not(active-tab)","click",function() {
				$(".active-tab").removeClass("active-tab")
				$(this).addClass("active-tab");
			}).delegate(".tab-close","click",function() {
				if ($(this).is("active-tab")) {
					$(this).prev().addClass("active");
				}
				var tab = $(this).parents(".tab")
				tab.addClass("tab-closing");
				setTimeout(function() {
					tab.remove();
				},200);	
			})
						
		})
		.delegate(".window-btn.active","click",function() {
			
		})
		.delegate(".window-btn.active","mousedown",function() {
			$("#taskbar").find(".focused").removeClass("focused");
			$(this).toggleClass("focused");
			$(this).css({
				"paddingTop":"+=1px",
				"paddingBottom":"-=1px",
				"paddingLeft":"+=1px",
				"paddingRight":"-=1px",
				})
		})	
		.delegate(".window-btn.active","mouseup",function() {
			$(this).css({
				"paddingTop":"-=1px",
				"paddingBottom":"+=1px",
				"paddingLeft":"-=1px",
				"paddingRight":"+=1px",
			})
		})
		//$("#taskbar .window-btn:not(.active)").eq(1).trigger("click");
		
		
		function formatOmnibar(contents) {
			var parts = contents.split(/\/+/g);
			console.log(parts);
			var formatted="<span class=chrome-omnibar-basedomain>"+parts[0]+"</span>/"+parts[1];
			console.log(formatted);
			return formatted;
			
		}
		function resizeScreen() {
			var win_height = $(window).height(),
				win_width = $(window).width();
			
			//document.getElementById("bg-filter-normal").attr("height","1200px").attr("width",win_width);
			$("#bg").css({"top":win_height-1200,"left":(win_width-1920)/2});
				
				
				
			//var available_height = $(window).height() - ( $("#taskbar").outerHeight() + $(".chrome-mainbar").outerHeight() );
			//$(".chrome-iframe").height(available_height);
			
		}
		
});