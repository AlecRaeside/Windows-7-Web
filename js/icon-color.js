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
			yuv = rgb2yuv(pix[i]/255,pix[i+1]/255,pix[i+2]/255);
			yuvpix.push(yuv[0]);
			yuvpix.push(yuv[1]);
			yuvpix.push(yuv[2]);
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
				
			distance.push( Math.sqrt(Math.pow(y2-y1,2) + Math.pow(u2-u1,2) + Math.pow(v2-v1,2)) );
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
	//console.log(dominant_yuv_index,yuvpix[dominant_yuv_index],yuvpix[dominant_yuv_index+1],yuvpix[dominant_yuv_index+2])
	var dominant_rgb = yuv2rgb(yuvpix[dominant_yuv_index],yuvpix[dominant_yuv_index+1],yuvpix[dominant_yuv_index+2]);
	//console.log(dominant_rgb);
	dominant_rgb[0] = Math.ceil(dominant_rgb[0]*255);
	dominant_rgb[1] = Math.ceil(dominant_rgb[1]*255);
	dominant_rgb[2] = Math.ceil(dominant_rgb[2]*255);
	console.log(dominant_rgb.join(","));
	var c = $("<div/>",{css:{backgroundColor:"rgba("+dominant_rgb.join(",")+",1)",display:"inline-block",width:"100px",height:"100px"}});
	console.log(c);
	console.log("rgb("+dominant_rgb.join(",")+")");
	c.appendTo("body")
	
  }, false);

	img.src = imgsrc;

}
function simplify(num) {
	var small = parseInt(num/5);
	return small*5;
}

function rgb2yuv(r,g,b) {
	var _y = (0.299*r) + (0.587*g) + (0.114*b),
		_u = (-0.14713*r) + (-0.28886*g) + (0.436*b),
		_v = (0.615*r) + (-0.515*g) + (-0.1*b);
	return [fixNum(_y),fixNum(_u),fixNum(_v)];
}
function yuv2rgb(y,u,v) {
	var r = y + 1.13983*v,
		g = y + (-0.39465*u) + (-0.58060*v),
		b = y + (2.03211*u);
	return [fixNum(r),fixNum(g),fixNum(b)];
}
function yuvTest(r,g,b) {
	var yuv = rgb2yuv(r,g,b);
	var rgb = yuv2rgb(yuv[0],yuv[1],yuv[2]);
	return rgb;
}
function fixNum(n) {
	return parseFloat(n.toFixed(4));
}
$(function() {
	$("#taskbar .window-btn img").eq(0).each(function() {
	var t=$(this);
	//getDominantColour(t.attr("src"));
		
	})
})

