

var main   = require('../../script.js'),
	webcom = require('./webcom_fct.js');
	init   = require('./init.js');

var mode = main.mode,
	color = "white";

module.exports.color = color;


module.exports.dezoom = function() {

};

/* Manage the display mode in the off-canvas menue */
module.exports.change_mode = function(new_mode) {
	if (new_mode=="draw" || new_mode=="eraseAll") {
	    $(".ul-drawTools").attr("style", "height: 200px");
	    $(".drawTools-buttons-container").css("height", "50%");
	    $("#erase"+" :nth-child(1)").removeClass("fa-square").addClass("fa-square-o");
	    $("#draw"+" :nth-child(1)").removeClass("fa-square-o").addClass("fa-square");
	    $(".color-container").show();
  	}
  	else {
	    $(".ul-drawTools").attr("style", "height: 100px");
	    $(".drawTools-buttons-container").css("height", "100%");
	    $("#erase"+" :nth-child(1)").removeClass("fa-square-o").addClass("fa-square");
	    $("#draw"+" :nth-child(1)").removeClass("fa-square").addClass("fa-square-o");
	    $(".color-list").hide();      
  	}
  	return new_mode;
};

module.exports.hide_colors = function() {
	if (mode == "erase") {
	    $(".ul-drawTools").attr("style", "height: 100px");
	    $(".drawTools-buttons-container").css("height", "100%");
	    $(".color-list").hide();
    }
};

module.exports.color_active = function(elem) {
	$(".brickMenu").removeClass("active");
	elem.addClass("active");
	color = elem.attr('class').replace(/\s*(brickMenu|active)\s*/g, '');
	module.exports.color = color;
};