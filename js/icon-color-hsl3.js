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
			pix = imgd.data,
			hues = [],
			sats = [],
			lums = [];

		for (var i = 0, n = pix.length; i < n; i += 4) {
			//ignore black/invisible pixels
			if (pix[i]>1 || pix[i+1]>1 || pix[i+2] > 1) {
				var hue = rgbToHsl(pix[i],pix[i+1],pix[i+2]);
				if (hue[1]>0.6) {
					hues.push(hue[0]);
					sats.push(hue[1]);
					lums.push(hue[2]);
				}
			}
		}
		
		var all_distances = [];
		for (var i = 0, l = hues.length; i < l; i++) {
			var hue = hues[i],
				sat = sats[i],
				lum = lums[i];
			
			var distance = [],
				total_distance=0;
			
			for (var n = 0, L2 = hues.length; n < L2; n++) {
				var hue2 = hues[n],
					sat2 = sats[n],
					lum2 = lums[n];
					
				//var hue_dist = Math.min(Math.pow(hue2-hue,2), Math.pow((hue2-1)-hue,2) );
				var hue_dist = Math.abs(hue2-hue,2),
					hue2_dist = Math.abs((hue2-1)-hue,2),
					sat_dist = Math.pow(sat2-sat,2),
					lum_dist = Math.abs(lum2-lum,2);
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
		console.log(hues[lowest_index]);
		callback(
			hues[lowest_index]
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
	$("#taskbar .window-btn img").eq(4).each(function(i) {
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