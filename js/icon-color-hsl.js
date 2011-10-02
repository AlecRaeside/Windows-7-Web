Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function getDominantColour(imgsrc) {
	  // Get the canvas element.
	  var elem = document.getElementById('canvas');
	  if (!elem || !elem.getContext) {
		return;
	  }
	 
	  // Get the canvas 2d context.
	  var context = elem.getContext('2d');
	  if (!context || !context.getImageData || !context.putImageData || !context.drawImage) {
		return;
	  }
	 
	  // Create a new image.
	  var img = new Image();
	  img.style.display = "none";
	  // Once it's loaded draw the image on canvas and invert the colors.
	  img.addEventListener('load', function () {
		var x = 0, y = 0;
		// Draw the image on canvas.
		context.drawImage(this, x, y);
	 
		// Get the pixels.
		var imgd = context.getImageData(x, y, this.width, this.height);
		var pix = imgd.data;
		var yuvpix=[]

		for (var i = 0, yuv=[], n = pix.length; i < n; i += 4) {
			//ignore black/invisible pixels
			if (pix[i]>1 || pix[i+1]>1 || pix[i+2] > 1) {
				yuv = rgbToHsl(pix[i],pix[i+1],pix[i+2]);
				if (yuv[1]>0.6) {
					yuvpix.push(yuv[0]);
					yuvpix.push(yuv[1]);
					yuvpix.push(yuv[2]);
					//yuvpix.push(pix);
				}
			}
		}	

		//console.log(yuvpix);
		
		var all_distances = [];
		for (var i = 0, l = yuvpix.length; i < l; i += 3) {
			var y1 = yuvpix[i],
				u1 = yuvpix[i+1],
				v1 = yuvpix[i+2];
				
			//console.log(i,y1,u1,v1);
			var distance = [],
				total_distance=0;
			
			for (var n = 0, L2 = yuvpix.length; n < L2; n += 3) {
				var y2 = yuvpix[n],
					u2 = yuvpix[n+1],
					v2 = yuvpix[n+2];
					
				var d1=Math.abs(y2-y1);
				var d2=Math.abs((y2-1)-y1);
				
				distance.push(Math.min(d1,d2));
				//$dist[] = sqrt(pow(($color2['red'] - $color['red']), 2) + pow(($color2['green'] - $color['green']), 2) + pow(($color2['blue'] - $color['blue']), 2));			
			}
			
			/*
			for (var j = 0, jl = distance.length; j < jl; j++) {
				total_distance+=distance[j];
			}
			*/
			all_distances.push(distance.reduce(function(a,b) {return a+b;}));		
		}
		var lowest = 1000;
		//console.log(all_distances.length)
		all_distances.forEach(function(d,i) {
			if (d<lowest) {
				lowest=d;
				lowest_index=i;
			}
		});
		var dominant_yuv_index = lowest_index*3;
		console.log(yuvpix[dominant_yuv_index],yuvpix[dominant_yuv_index+1],yuvpix[dominant_yuv_index+2]);
		//console.log(dominant_yuv_index,yuvpix[dominant_yuv_index],yuvpix[dominant_yuv_index+1],yuvpix[dominant_yuv_index+2])
		var dominant_rgb = hslToRgb(yuvpix[dominant_yuv_index],yuvpix[dominant_yuv_index+1],yuvpix[dominant_yuv_index+2]);
		//console.log(dominant_rgb);
		dominant_rgb[0] = Math.ceil(dominant_rgb[0]);
		dominant_rgb[1] = Math.ceil(dominant_rgb[1]);
		dominant_rgb[2] = Math.ceil(dominant_rgb[2]);
		console.log(dominant_rgb.join(","));
		var c = $("<div/>",{css:{backgroundColor:"rgba("+dominant_rgb.join(",")+",1)",display:"inline-block",width:"100px",height:"100px"}});
		console.log(c);
		console.log("rgb("+dominant_rgb.join(",")+")");
		c.appendTo("body")
		
	}, false);

	img.src = imgsrc;

}

function fixNum(n) {
	return parseFloat(n.toFixed(4));
}
$(function() {
	$("#taskbar .window-btn img").eq(3).each(function(i) {
		var t=$(this);
		setTimeout(function() {
			
			getDominantColour(t.attr("src"));
				
			
		},i*1000);
	});
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