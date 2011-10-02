function getDominantColour(imgsrc,callback) {
  
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
			pix_original = imgd.data,
			pix = [];

		for (var i = 0, n = pix_original.length; i < n; i += 4) {
			//ignore black/invisible pixels
			if (pix_original[i]>10 || pix_original[i+1]>10 || pix_original[i+2] > 10) {
				pix.push(pix_original[i]);
				pix.push(pix_original[i+1]);
				pix.push(pix_original[i+2]);
			}
		}
		
		var all_distances = [];
		for (var i = 0, l = pix.length; i < l; i += 3) {
			var r1 = pix[i],
				g1 = pix[i+1],
				b1 = pix[i+2];
			var distance = [],
				total_distance=0;
			
			for (var n = 0, L2 = pix.length; n < L2; n += 3) {
				var r2 = pix[n],
					g2 = pix[n+1],
					b2 = pix[n+2];
					
				distance.push( Math.sqrt(Math.pow(r2-r1,2) + Math.pow(g2-g1,2) + Math.pow(b2-b1,2)) );			
			}
			all_distances.push(distance.reduce(function(a,b) {return a+b;}));		
		}
		var lowest = 1000000,
			lowest_index=0;
		all_distances.forEach(function(d,i) {
			if (Math.round(d)<lowest) {
				lowest=Math.round(d);
				lowest_index=i;
			}
		});
		
		var dominant_rgb_index = lowest_index*3;
		callback(
			pix[dominant_rgb_index],
			pix[dominant_rgb_index+1],
			pix[dominant_rgb_index+2]
		);
	}, false);
	img.src = imgsrc;
}

function testRgb() {
	var hsl=rgbToHsl(pix[dominant_rgb_index], pix[dominant_rgb_index+1], pix[dominant_rgb_index+2]);
	var hsl_colour = [Math.ceil(hsl[0]*360),"100%","50%"];
	console.log(hsl);
	var rgb = dominant_rgb.join(",");
	var c = $("<div/>",{css:{
							backgroundColor:"hsl("+hsl_colour.join(",")+")",
							display:"inline-block",
							width:"100px",
							height:"100px"
						}
					});
	c.appendTo("body")
}

$(function() {
	$("#taskbar .window-btn img").eq(0).each(function(i) {
		var t=$(this);
		setTimeout(function() {
			getDominantColour(t.attr("src"),function(r,g,b) {
					var hsl=rgbToHsl(r, g, b);
					var hsl_colour = [Math.ceil(hsl[0]*360),"100%","50%"];
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
})


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