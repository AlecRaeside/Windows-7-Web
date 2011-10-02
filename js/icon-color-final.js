function getDominantColour(imgsrc,callback) {
	//return;
	var elem = document.createElement('canvas'),
		context = elem.getContext('2d');
	if (!context || !context.getImageData || !context.putImageData || !context.drawImage) {
		return;
	}
 
	var img = new Image();

	img.addEventListener('load', function() {
		context.drawImage(this, 0, 0);
	 
		// Get the pixels.
		var imgd = context.getImageData(0, 0, this.width, this.height),
			pix = imgd.data,
			hues = [];

		for (var i = 0, n = pix.length; i < n; i += 4) {
			//ignore black/invisible pixels
			if (pix[i]>1 || pix[i+1]>1 || pix[i+2] > 1) {
				var hue = rgbToHsl(pix[i],pix[i+1],pix[i+2]);
				if (hue[1]>0.6) {
					hues.push(hue[0]);
				}
			}
		}
		
		var all_distances = [];
		for (var i = 0, l = hues.length; i < l; i++) {
			var hue = hues[i];
			
			var distance = [],
				total_distance=0;
			
			for (var n = 0, L2 = hues.length; n < L2; n++) {
				var hue2 = hues[n];
					
				//var hue_dist = Math.min(Math.pow(hue2-hue,2), Math.pow((hue2-1)-hue,2) );
				var hue_dist = Math.abs(hue2-hue,2),
					hue2_dist = Math.abs((hue2-1)-hue,2);
				distance.push(Math.min(hue_dist,hue2_dist));
			}
			all_distances.push(distance.reduce(function(a,b) {return a+b;}));		
		}
		var lowest = 1000,
			lowest_index=0;
		all_distances.forEach(function(d,i) {
			if (Math.round(d)<lowest) {
				lowest=Math.round(d);
				lowest_index=i;
			}
		});
		
		callback(
			hues[lowest_index]
		);
	}, false);
	img.src = imgsrc;
}
var p_count=1;
function testRgb() {
/*
	$("#taskbar .window-btn img").eq(1).each(function(i) {
		var t=$(this);
		setTimeout(function() {
			getDominantColour(t.attr("src"),function(hue) {
					var hsl_colour = [Math.ceil(hue*360),"100%","50%"];
					console.log(hsl_colour);
					var c = $("<div/>",{css:{
											backgroundColor:"hsl("+hsl_colour.join(",")+")",
											display:"inline-block",
											width:"100px",
											height:"100px"
										}
									});
					c.appendTo("body")
				
			});
		},i*500);
		
	})
	*/
}

$(function() {
		var len = $("#taskbar .window-btn img").length;
		$("#taskbar .window-btn img").each(function() {
			var t=$(this);
				getDominantColour(t.attr("src"),function(hue) {
					var btn=t.parents(".window-btn");
					hue=hue*360;
					btn.data("hue",hue);
					btn.mousemove(function(e) {
						if ($(this).hasClass("active")) {
							var offset = e.pageX - t.offset().left
							setRadialGradient(btn,offset,hue)
						}
					}).mouseleave(function() {
						if ($(this).hasClass("active")) {
							$(this).css({backgroundImage:"url(btnbg.svg)"})
						}
					})
				});		
		})
})

function setRadialGradient(el,bgx,hue) {
	var bgx_percent = Math.round(bgx/el.width()*100);
	if (bgx_percent<10) bgx_percent = 10;
	if (bgx_percent>90) bgx_percent = 90;
	
		var side_offset = Math.abs(50-bgx_percent);
		var bgy_percent = 110;
		var radial_bg = "-webkit-radial-gradient("+bgx_percent+"% "+bgy_percent+"%,ellipse farthest-side, hsla("+hue+",100%,82%,0.9) 0px, hsla("+hue+",100%,71%,0.75) 40px,hsla("+hue+",100%,51%,0.2) "+(120+side_offset)+"px,hsla("+hue+",100%,40%,0.1) "+(side_offset+170)+"px)";
		el.css("backgroundImage","url(btnbg.svg),"+radial_bg);
	
}

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}