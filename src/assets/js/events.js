var main   = require('../../script.js'),
	webcom = require('./webcom_fct.js');
	init   = require('./init.js');

var mode = main.mode,
	color = "white",
	panel = $('#overlayPanel'),
	drawspace = $('.drawspace');

module.exports.color = color;


module.exports.dezoom = function() {

};


module.exports.disableScroll = function(sc) {
	if (panel.hasClass('ui-panel-open') === false) {
		$('html').removeClass('showOverflow').addClass('hideOverflow');
		drawspace.removeClass('showOverflow').addClass('hideOverflow');
		$('#btn_dezoom').hide();
	} else {
		$('html').removeClass('hideOverflow').addClass('showOverflow');
		drawspace.removeClass('hideOverflow').addClass('showOverflow');
		if (sc == 2) {
			$('#btn_dezoom').show();
		}
	}
};

/* Manage the display mode in the off-canvas menue */
module.exports.change_mode = function(new_mode) {
	if (new_mode=="draw" || new_mode=="eraseAll") {
	    $(".ul-drawTools").attr("style", "height: 200px");
	    $(".drawTools-buttons-container").css("height", "50%");
	    // $("#erase"+" :nth-child(1)").removeClass("fa-square").addClass("fa-square-o");
	    // $("#draw"+" :nth-child(1)").removeClass("fa-square-o").addClass("fa-square");
	    $(".color-container").show();
  	}
  	else {
	    $(".ul-drawTools").attr("style", "height: 100px");
	    $(".drawTools-buttons-container").css("height", "100%");
	    // $("#erase"+" :nth-child(1)").removeClass("fa-square-o").addClass("fa-square");
	    // $("#draw"+" :nth-child(1)").removeClass("fa-square").addClass("fa-square-o");
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