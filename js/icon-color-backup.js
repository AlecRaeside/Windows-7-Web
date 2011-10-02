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

	var colour_freqs={};
	for (var i = 0, n = pix.length; i < n; i += 4) {
		var colour_key=simplify(pix[i])+","+simplify(pix[i+1])+","+simplify(pix[i+2]);
		
		if (isColourEligible(pix[i],pix[i+1],pix[i+2],pix[i+3])) {
		if (colour_key in colour_freqs) {
			colour_freqs[colour_key]++;
		} else {
			colour_freqs[colour_key]=1;
		}
		}
    }	
	//console.log(colour_freqs);
	var highest="";
	var highest_num=0;
	for (var colour_key in colour_freqs) {
		var num=colour_freqs[colour_key];
		if (num>highest_num) {
			highest_num=num;
			highest=colour_key;
		}
	}
	console.log(highest+":"+highest_num);
	var c = $("<div/>",{css:{backgroundColor:"rgb("+highest+")",display:"inline-block",width:"100px",height:"100px"}});
	c.appendTo("body")
  }, false);

	img.src = imgsrc;

}
function simplify(num) {
	var small = parseInt(num/5);
	return small*5;
}

function rgb2yuv(r,g,b) {

	var y = (0.299*r) + (0.587*g) + (0.114*b),
		u = (-0.14713*r) + (-0.28886*g) + (0.436*b),
		v = (0.615*r) + (-0.515*g) + (-0.1*b);
	return [fixNum(y),fixNum(u),fixNum(v)];
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
	console.log(rgb);
}
function fixNum(n) {
	return parseFloat(n.toFixed(4));
}
/*
function rgb2yuv(r,g,b) {

	var y = (0.299*r) + (0.587*g) + (0.114*b),
		u = (-0.147*r) - (0.289*g) + (0.436*b),
		v = (0.615*r) - (0.515*g) + (0.1*b);
	return [y,u,v];
}
function yuv2rgb(y,u,v) {
	var r = y + (1.14*v),
		g = y - (0.394*u) - (0.581*v),
		b = y + (2.032*u);
	return [r,g,b];
}

function gammaCorrection(val) {
	return (1.099*Math.pow(val,0.45)) - 0.099;
}

function reverseGammaCorrection(corrected) {
	return Math.pow((corrected+0.099)/1.099,2.22);
}

function rgbGammaTest(v) {
	var gammad = gammaCorrection(v);
	return reverseGammaCorrection(gammad);
}

function yuvTest(r,g,b) {
	var rc=gammaCorrection(r);
	var gc=gammaCorrection(g);
	var bc=gammaCorrection(b);
	var yuv=rgb2yuv(rc,gc,bc);
	var rgb =  yuv2rgb(yuv[0],yuv[1],yuv[2]);
	console.log(reverseGammaCorrection(rgb[0]));
	console.log(reverseGammaCorrection(rgb[1]));
	console.log(reverseGammaCorrection(rgb[2]));
}
*/

/*
function rgb2yuv(r,g,b) {
	var y = (0.299*r) + (0.587*g) + (0.114*b),
		u = (0.500*r) - (0.419*g) - (0.081*b),
		v = (-0.169*r) - (0.331*g) + (0.500*b);
	return [y,u,v];
}
function yuv2rgb(y,u,v) {
	var r = y + (1.403*v),
		g = y - (0.344*u) - (0.714*v),
		b = y + (1.770*u);
	return [r,g,b];
}
 function yuvTest(r,g,b) {
	var yuv=rgb2yuv(r,g,b);
	return yuv2rgb(yuv[0],yuv[1],yuv[2]);
 }
 */



function isColourEligible(r,g,b,a) {
	//OPACITY CHECK
	//if mostly transparent then ignore this pixel
	if (a<100) return false;
	
	
	//COLOUR RICHNESS CHECK
	var rgb_variation = Math.abs(r-g) + Math.abs(r-b) + Math.abs(g-b);
	
	//abitrary number for defining what rgb colours are actually 'colourful' - above this is 'colourful'
	//min 0, max 768
	var rgb_variation_threshold = 300;

	
	//BRIGHTNESS CHECK
	var rgba_total = r+g+b+a;
	
	//abitrary number for defining what rgb colours are too dull - below this is 'too dull'
	//min 0, max 1024
	var dull_threshold = 300;
	
	return rgb_variation + rgba_total > 100;
	
}
$(function() {
	$("#taskbar .window-btn img").each(function() {
		getDominantColour($(this).attr("src"));
	})
})

